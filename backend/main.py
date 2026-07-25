import base64
import logging
from typing import List
import uuid
import modal
import os
import boto3
from botocore.exceptions import ConnectionError, ConnectTimeoutError, EndpointConnectionError, ReadTimeoutError
from tenacity import before_sleep_log, retry, retry_if_exception_type, stop_after_attempt, wait_exponential

from pydantic import BaseModel
import requests

from prompts import LYRICS_GENERATOR_PROMPT, PROMPT_GENERATOR_PROMPT
from datetime import datetime, timezone
from loguru import logger
import hashlib

app = modal.App("melodyc")

image = (
    modal.Image.debian_slim()
    .apt_install("git", "ffmpeg")
    .pip_install_from_requirements("requirements.txt")
    .run_commands(["git clone https://github.com/ace-step/ACE-Step.git /tmp/ACE-Step", "cd /tmp/ACE-Step && pip install ."])
    .env({"HF_HOME": "/.cache/huggingface"})
    .add_local_python_source("prompts")
)

model_volume = modal.Volume.from_name(
    "ace-step-models", create_if_missing=True)
hf_volume = modal.Volume.from_name("qwen-hf-cache", create_if_missing=True)

qwen_prompt_cache = modal.Dict.from_name("qwen-prompt-cache", create_if_missing=True)

melodyc_secrets = modal.Secret.from_name("melodyc-secret")

CACHE_VERSION = "v1"

def _make_cache_key(namespace: str, text: str) -> str:
    digest = hashlib.sha256(text.encode("utf-8")).hexdigest()
    return f"{CACHE_VERSION}:{namespace}:{digest}"

class AudioGenerationBase(BaseModel):
    audio_duration: float = 180.0
    seed: int = -1
    guidance_scale: float = 15.0
    infer_step: int = 60
    instrumental: bool = False


class GenerateFromDescriptionRequest(AudioGenerationBase):
    full_described_song: str


class GenerateWithCustomLyricsRequest(AudioGenerationBase):
    prompt: str
    lyrics: str


class GenerateWithDescribedLyricsRequest(AudioGenerationBase):
    prompt: str
    described_lyrics: str


class GenerateMusicResponseS3(BaseModel):
    s3_key: str
    cover_image_s3_key: str
    categories: List[str]


class GenerateMusicResponse(BaseModel):
    audio_data: str


class HealthCheck(BaseModel):
    status: str
    music_model_loaded: bool
    llm_model_loaded: bool
    image_pipe_loaded: bool
    checked_at: str

@app.cls(
    image=image,
    gpu="L40S",
    volumes={"/models": model_volume, "/.cache/huggingface": hf_volume},
    secrets=[melodyc_secrets],
    scaledown_window=15
)

class MusicGenServer:
    @modal.enter()
    def load_model(self):
        from acestep.pipeline_ace_step import ACEStepPipeline
        from transformers import AutoModelForCausalLM, AutoTokenizer
        from diffusers import AutoPipelineForText2Image
        import torch

        # Music Generation Model
        self.music_model = ACEStepPipeline(
            checkpoint_dir="/models",
            dtype="bfloat16",
            torch_compile=False,
            cpu_offload=False,
            overlapped_decode=False
        )

        # Large Language Model
        model_id = "Qwen/Qwen2-7B-Instruct"
        self.tokenizer = AutoTokenizer.from_pretrained(model_id)

        self.llm_model = AutoModelForCausalLM.from_pretrained(
            model_id,
            torch_dtype="auto",
            device_map="auto",
            cache_dir="/.cache/huggingface"
        )

        # Stable Diffusion Model (thumbnails)
        self.image_pipe = AutoPipelineForText2Image.from_pretrained(
            "stabilityai/sdxl-turbo", torch_dtype=torch.float16, variant="fp16", cache_dir="/.cache/huggingface")
        self.image_pipe.to("cuda")

    def prompt_qwen(self, question: str):
        messages = [
            {"role": "user", "content": question}
        ]
        text = self.tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True
        )
        model_inputs = self.tokenizer(
            [text], return_tensors="pt").to(self.llm_model.device)

        try:
            generated_ids = self.llm_model.generate(
                model_inputs.input_ids,
                max_new_tokens=512
            )
        except Exception as e:
            logger.error(f"LLM inference failed | question_length={len(question)}: {e}")
            raise

        generated_ids = [
            output_ids[len(input_ids):] for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
        ]

        response = self.tokenizer.batch_decode(
            generated_ids, skip_special_tokens=True)[0]

        return response

    def input_validation(self, description: str) -> str:
        max_characters = 500

        if not isinstance(description, str):
            raise TypeError("Description must be a string.")

        description = description.strip()

        if not description:
            raise ValueError("Description must be a non empty string.")

        if len(description) > max_characters:
            raise ValueError(f"Description is too long. Maximum length is {max_characters} characters.")

        return description

    def generate_prompt(self, description: str):
        # Insert description into template
        cache_key = _make_cache_key("prompt", description)
        cached = qwen_prompt_cache.get(cache_key)
        if cached is not None:
            logger.info(f"Cache hit | fn=generate_prompt key={cache_key}")
            return cached

        # Run LLM inference and return that
        full_prompt = PROMPT_GENERATOR_PROMPT.format(user_prompt=description)
        result = self.prompt_qwen(full_prompt)

        qwen_prompt_cache.put(cache_key, result)
        return result



    def generate_lyrics(self, description: str):
        # Insert description into template
        cache_key = _make_cache_key("lyrics", description)
        cached = qwen_prompt_cache.get(cache_key)
        if cached is not None:
            logger.info(f"Cache hit | fn=generate_lyrics key={cache_key}")
            return cached

            # Run LLM inference and return that
        full_prompt = LYRICS_GENERATOR_PROMPT.format(description=description)
        result = self.prompt_qwen(full_prompt)

        qwen_prompt_cache.put(cache_key, result)
        return result

    def generate_categories(self, description: str) -> List[str]:
        cache_key = _make_cache_key("categories", description)
        cached = qwen_prompt_cache.get(cache_key)
        if cached is not None:
            logger.info(f"Cache hit | fn=generate_categories key={cache_key}")
            return cached

        prompt = f"Based on the following music description, list 3-5 relevant genres or categories as a comma-separated list. For example: Pop, Electronic, Sad, 80s. Description: '{description}'"
        response_text = self.prompt_qwen(prompt)
        categories = [cat.strip()
                    for cat in response_text.split(",") if cat.strip()]

        qwen_prompt_cache.put(cache_key, categories)
        return categories
    
    @retry(
        retry=retry_if_exception_type((
            ConnectionError,
            ReadTimeoutError,
        )),
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10),
        reraise=True,
        before_sleep=before_sleep_log(logger, "WARNING"),
    )
    def _upload_to_s3(self, s3_client, local_path, bucket_name, s3_key):
        s3_client.upload_file(local_path, bucket_name, s3_key)

    def generate_and_upload_to_s3(
            self,
            prompt: str,
            lyrics: str,
            instrumental: bool,
            audio_duration: float,
            infer_step: int,
            guidance_scale: float,
            seed: int,
            description_for_categorization: str
    ) -> GenerateMusicResponseS3:
        final_lyrics = "[instrumental]" if instrumental else lyrics
        logger.success(f"Generated lyrics: \n{final_lyrics}")
        logger.info(f"Prompt: \n{prompt}")

        s3_client = boto3.client("s3", region_name=os.environ.get("AWS_REGION", "us-east-1"))
        bucket_name = os.environ["S3_BUCKET_NAME"]

        output_dir = "/tmp/outputs"
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, f"{uuid.uuid4()}.wav")

        try:
            self.music_model(
                prompt=prompt,
                lyrics=final_lyrics,
                audio_duration=audio_duration,
                infer_step=infer_step,
                guidance_scale=guidance_scale,
                save_path=output_path,
                manual_seeds=str(seed)
            )
        except Exception as e:
            logger.error(f"Music inference failed | prompt='{prompt}' seed={seed} duration={audio_duration}: {e}")
            raise

        audio_s3_key = f"{uuid.uuid4()}.wav"

        try:
            self._upload_to_s3(s3_client, output_path, bucket_name, audio_s3_key)
        except Exception as e:
            logger.error(f"S3 upload failed for audio file {audio_s3_key}: {e}")
            raise
        finally:
            os.remove(output_path)

        # Thumbnail generation
        thumbnail_prompt = f"{prompt}, album cover art"
        try:
            image = self.image_pipe(
                prompt=thumbnail_prompt, num_inference_steps=2, guidance_scale=0.0).images[0]
        except Exception as e:
            logger.error(f"Image inference failed | thumbnail_prompt='{thumbnail_prompt}': {e}")
            raise

        image_output_path = os.path.join(output_dir, f"{uuid.uuid4()}.png")
        image.save(image_output_path)

        image_s3_key = f"{uuid.uuid4()}.png"

        try:
            self._upload_to_s3(s3_client, image_output_path, bucket_name, image_s3_key)
        except Exception as e:
            logger.error(f"S3 upload failed for thumbnail {image_s3_key}: {e}")
            raise
        finally:
            os.remove(image_output_path)

        # Category generation: "hip-hop", "rock"
        categories = self.generate_categories(description_for_categorization)

        return GenerateMusicResponseS3(
            s3_key=audio_s3_key,
            cover_image_s3_key=image_s3_key,
            categories=categories
        )

    @modal.fastapi_endpoint(method="GET", requires_proxy_auth=False)
    def health_check(self) -> HealthCheck:
        music_ok = hasattr(self, "music_model")
        llm_ok = hasattr(self, "llm_model")
        image_ok = hasattr(self, "image_pipe")

        status = "healthy" if (music_ok and llm_ok and image_ok) else "unhealthy"

        return HealthCheck(
            status=status,
            music_model_loaded=music_ok,
            llm_model_loaded=llm_ok,
            image_pipe_loaded=image_ok,
            checked_at=datetime.now(timezone.utc).isoformat()
        )

    @modal.fastapi_endpoint(method="POST", requires_proxy_auth=True)
    def generate(self) -> GenerateMusicResponse:
        output_dir = "/tmp/outputs"
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, f"{uuid.uuid4()}.wav")

        self.music_model(
            prompt="electronic rap",
            lyrics="[verse]\nWaves on the bass, pulsing in the speakers,\nTurn the dial up, we chasing six-figure features,\nGrinding on the beats, codes in the creases,\nDigital hustler, midnight in sneakers.\n\n[chorus]\nElectro vibes, hearts beat with the hum,\nUrban legends ride, we ain't ever numb,\nCircuits sparking live, tapping on the drum,\nLiving on the edge, never succumb.\n\n[verse]\nSynthesizers blaze, city lights a glow,\nRhythm in the haze, moving with the flow,\nSwagger on stage, energy to blow,\nFrom the blocks to the booth, you already know.\n\n[bridge]\nNight's electric, streets full of dreams,\nBass hits collective, bursting at seams,\nHustle perspective, all in the schemes,\nRise and reflective, ain't no in-betweens.\n\n[verse]\nVibin' with the crew, sync in the wire,\nGot the dance moves, fire in the attire,\nRhythm and blues, soul's our supplier,\nRun the digital zoo, higher and higher.\n\n[chorus]\nElectro vibes, hearts beat with the hum,\nUrban legends ride, we ain't ever numb,\nCircuits sparking live, tapping on the drum,\nLiving on the edge, never succumb.",
            audio_duration=180,
            infer_step=60,
            guidance_scale=15,
            save_path=output_path,
        )

        with open(output_path, "rb") as f:
            audio_bytes = f.read()

        audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")

        os.remove(output_path)

        return GenerateMusicResponse(audio_data=audio_b64)

    @modal.fastapi_endpoint(method="POST", requires_proxy_auth=True)
    def generate_from_description(self, request: GenerateFromDescriptionRequest) -> GenerateMusicResponseS3:
        logger.info(f"generate_from_description called | audio_duration={request.audio_duration}")

        full_described_song = self.input_validation(request.full_described_song)

        # Generating a prompt
        prompt = self.generate_prompt(full_described_song)

        # Generating lyrics
        lyrics = ""
        if not request.instrumental:
            lyrics = self.generate_lyrics(full_described_song)
        return self.generate_and_upload_to_s3(prompt=prompt, lyrics=lyrics,
                                              description_for_categorization=full_described_song, **request.model_dump(exclude={"full_described_song"}))

    @modal.fastapi_endpoint(method="POST", requires_proxy_auth=True)
    def generate_with_lyrics(self, request: GenerateWithCustomLyricsRequest) -> GenerateMusicResponseS3:
        logger.info(f"generate_with_lyrics called | audio_duration={request.audio_duration}")

        validated_prompt = self.input_validation(request.prompt)
        validated_lyrics = self.input_validation(request.lyrics)

        return self.generate_and_upload_to_s3(prompt=validated_prompt, lyrics=validated_lyrics,
                                              description_for_categorization=validated_prompt, **request.model_dump(exclude={"prompt", "lyrics"}))

    @modal.fastapi_endpoint(method="POST", requires_proxy_auth=True)
    def generate_with_described_lyrics(self, request: GenerateWithDescribedLyricsRequest) -> GenerateMusicResponseS3:
        logger.info(f"generate_with_described_lyrics called | audio_duration={request.audio_duration}")

        validated_prompt = self.input_validation(request.prompt)

        # Generating lyrics
        lyrics = ""
        if not request.instrumental:
            validated_described_lyrics = self.input_validation(request.described_lyrics)
            lyrics = self.generate_lyrics(validated_described_lyrics)
        return self.generate_and_upload_to_s3(prompt=validated_prompt, lyrics=lyrics,
                                              description_for_categorization=validated_prompt, **request.model_dump(exclude={"described_lyrics", "prompt"}))


@app.local_entrypoint()
def main():
    server = MusicGenServer()
    endpoint_url = server.generate_with_described_lyrics.get_web_url()

    request_data = GenerateWithDescribedLyricsRequest(
        prompt="rave, funk, 140BPM, disco",
        described_lyrics="lyrics about water bottles",
        guidance_scale=15
    )

    payload = request_data.model_dump()

    headers = {
            "Modal-Key": os.environ["MODAL_KEY"],
            "Modal-Secret": os.environ["MODAL_SECRET"],
        }

    response = requests.post(endpoint_url, json=payload, headers=headers)
    response.raise_for_status()
    result = GenerateMusicResponseS3(**response.json())

    logger.success(
        f"Success: {result.s3_key} {result.cover_image_s3_key} {result.categories}")

    # audio_bytes = base64.b64decode(result.audio_data)
    # output_filename = "generated.wav"
    # with open(output_filename, "wb") as f:
    #     f.write(audio_bytes)