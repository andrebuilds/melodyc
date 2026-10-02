import base64
import logging
from typing import List, Optional
import uuid
import modal
import os
import boto3
from botocore.exceptions import ConnectionError, ConnectTimeoutError, EndpointConnectionError, ReadTimeoutError
from tenacity import before_sleep_log, retry, retry_if_exception_type, stop_after_attempt, wait_exponential

from pydantic import BaseModel
import requests

from prompts import COVER_ART_PROMPT, LYRICS_GENERATOR_PROMPT, LYRICS_PROMPTS_BY_GENRE, PROMPT_GENERATOR_PROMPT
from datetime import datetime, timezone
from loguru import logger
import hashlib
import subprocess
from langdetect import detect, LangDetectException

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

#Prompt caching
CACHE_VERSION = "v1"

def _make_cache_key(namespace: str, text: str) -> str:
    digest = hashlib.sha256(text.encode("utf-8")).hexdigest()
    return f"{CACHE_VERSION}:{namespace}:{digest}"

#Language detection
LANGUAGE_NAMES = {
    "en": "English",
    "it": "Italian",
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "pt": "Portuguese",
}

GENRE_INFERENCE_PROFILES = {
    "classical": {"infer_step": 80, "guidance_scale": 14.0},
    "orchestral": {"infer_step": 80, "guidance_scale": 14.0},
    "cinematic": {"infer_step": 78, "guidance_scale": 14.0},
    "jazz": {"infer_step": 72, "guidance_scale": 13.0},
    "ambient": {"infer_step": 70, "guidance_scale": 12.5},
    "acoustic": {"infer_step": 68, "guidance_scale": 13.0},
    "metal": {"infer_step": 58, "guidance_scale": 16.0},
    "rock": {"infer_step": 58, "guidance_scale": 15.5},
    "edm": {"infer_step": 56, "guidance_scale": 16.0},
    "electronic": {"infer_step": 56, "guidance_scale": 16.0},
    "trap": {"infer_step": 55, "guidance_scale": 16.5},
    "rap": {"infer_step": 54, "guidance_scale": 16.0},
    "hip hop": {"infer_step": 54, "guidance_scale": 16.0},
    "pop": {"infer_step": 60, "guidance_scale": 15.0},
}

GENRE_PROFILE_KEYWORDS = tuple(GENRE_INFERENCE_PROFILES.keys())

ALLOWED_CATEGORIES = (
    "pop", "rock", "hip-hop", "electronic", "jazz", "classical",
    "r&b", "metal", "folk", "latin", "blues", "country", "ambient",
    "cinematic", "acoustic", "instrumental", "energetic", "chill",
    "sad", "romantic", "dark", "uplifting", "80s", "90s", "2000s",
)

# Extra download formats exported next to the original WAV, as "<song_folder>/audio.<ext>".
AUDIO_EXPORT_FORMATS = {
    "mp3": ["-codec:a", "libmp3lame", "-b:a", "320k"],
    "flac": ["-codec:a", "flac"],
}

def _make_song_folder() -> str:
    """Builds a unique, ASCII-only S3 folder name for one generated song's assets."""
    return str(uuid.uuid4())


def _detect_language(text: str) -> str:
    try:
        code = detect(text)
    except LangDetectException:
        logger.warning(f"Language detection failed, defaulting to English | text_length={len(text)}")
        return "English"

    return LANGUAGE_NAMES.get(code, "English")

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
    title: Optional[str] = None


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
        from transformers import AutoModelForCausalLM, AutoTokenizer, T5EncoderModel
        from transformers import BitsAndBytesConfig as TransformersBitsAndBytesConfig
        from diffusers import FluxPipeline, FluxTransformer2DModel
        from diffusers import BitsAndBytesConfig as DiffusersBitsAndBytesConfig
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

        # FLUX.1-schnell (Apache 2.0) for cover art, quantized to fit next to ACE-Step and Qwen on one L40S.
        flux_model_id = "black-forest-labs/FLUX.1-schnell"
        flux_transformer = FluxTransformer2DModel.from_pretrained(
            flux_model_id,
            subfolder="transformer",
            quantization_config=DiffusersBitsAndBytesConfig(
                load_in_4bit=True,
                bnb_4bit_quant_type="nf4",
                bnb_4bit_compute_dtype=torch.bfloat16,
            ),
            torch_dtype=torch.bfloat16,
            cache_dir="/.cache/huggingface",
        )
        flux_text_encoder = T5EncoderModel.from_pretrained(
            flux_model_id,
            subfolder="text_encoder_2",
            quantization_config=TransformersBitsAndBytesConfig(load_in_8bit=True),
            torch_dtype=torch.bfloat16,
            cache_dir="/.cache/huggingface",
        )
        self.image_pipe = FluxPipeline.from_pretrained(
            flux_model_id,
            transformer=flux_transformer,
            text_encoder_2=flux_text_encoder,
            torch_dtype=torch.bfloat16,
            cache_dir="/.cache/huggingface",
        )
        self.image_pipe.to("cuda")

    def prompt_qwen(
        self,
        question: str,
        temperature: float = 0.7,
        top_p: float = 0.9,
        top_k: int = 50,
        max_new_tokens: int = 512,
    ):
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

        generation_kwargs = {
            "max_new_tokens": max_new_tokens,
            "do_sample": temperature > 0.0,
            "temperature": temperature,
            "top_p": top_p,
            "top_k": top_k,
            "pad_token_id": self.tokenizer.eos_token_id,
        }

        try:
            generated_ids = self.llm_model.generate(
                model_inputs.input_ids,
                **generation_kwargs,
            )
        except Exception as e:
            logger.error(f"LLM inference failed | question_length={len(question)} temperature={temperature} top_p={top_p} top_k={top_k}: {e}")
            raise

        generated_ids = [
            output_ids[len(input_ids):] for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
        ]

        response = self.tokenizer.batch_decode(
            generated_ids, skip_special_tokens=True)[0]

        return response

    def input_validation(self, description: str) -> tuple[str, str]:
        max_characters = 500

        if not isinstance(description, str):
            raise TypeError("Description must be a string.")

        description = description.strip()

        if not description:
            raise ValueError("Description must be a non empty string.")

        if len(description) > max_characters:
            raise ValueError(f"Description is too long. Maximum length is {max_characters} characters.")

        language = _detect_language(description)

        return description, language
        
    def generate_prompt(self, description: str, language: str):
        # Insert description into template
        cache_key = _make_cache_key("prompt", f"{language}:{description}")
        cached = qwen_prompt_cache.get(cache_key)
        if cached is not None:
            logger.info(f"Cache hit | fn=generate_prompt key={cache_key}")
            return cached

        # Run LLM inference and return that
        full_prompt = PROMPT_GENERATOR_PROMPT.format(user_prompt=description)
        result = self.prompt_qwen(full_prompt)

        qwen_prompt_cache.put(cache_key, result)
        return result



    def generate_lyrics(self, description: str, language: str, mood: str = "as conveyed by the description"):
        # Insert description into template
        cache_key = _make_cache_key("lyrics", f"{language}:{mood}:{description}")
        cached = qwen_prompt_cache.get(cache_key)
        if cached is not None:
            logger.info(f"Cache hit | fn=generate_lyrics key={cache_key}")
            return cached

        selected_template = LYRICS_GENERATOR_PROMPT
        lowered_description = description.lower()
        selected_genre = "default"

        for genre_keyword, genre_template in LYRICS_PROMPTS_BY_GENRE.items():
            if genre_keyword in lowered_description:
                selected_template = genre_template
                selected_genre = genre_keyword
                break

        logger.info(f"Lyrics template selected | genre={selected_genre}")

        # Run LLM inference and return that
        full_prompt = selected_template.format(description=description, language=language, mood=mood)
        result = self.prompt_qwen(full_prompt)

        qwen_prompt_cache.put(cache_key, result)
        return result

    def generate_categories(self, description: str, language: str) -> List[str]:
        cache_key = _make_cache_key("categories-v2", f"{language}:{description}")
        cached = qwen_prompt_cache.get(cache_key)
        if cached is not None:
            logger.info(f"Cache hit | fn=generate_categories key={cache_key}")
            return cached

        allowed_categories = ", ".join(ALLOWED_CATEGORIES)
        prompt = (
            "Choose 3-5 relevant categories from this list only: "
            f"{allowed_categories}. Return only a comma-separated list, "
            f"with no extra text. Description: '{description}'"
        )
        response_text = self.prompt_qwen(prompt)
        categories_by_name = {category.casefold(): category for category in ALLOWED_CATEGORIES}
        categories = []
        for raw_category in response_text.split(","):
            normalized_category = (
                raw_category.strip()
                .strip("-•*\"'")
                .rstrip(".,;:!?")
                .strip()
                .casefold()
            )
            category = categories_by_name.get(normalized_category)
            if category and category not in categories:
                categories.append(category)
            if len(categories) == 5:
                break

        if len(categories) < 3:
            fallback_matches = {
                "pop": "pop",
                "rock": "rock",
                "hip hop": "hip-hop",
                "hip-hop": "hip-hop",
                "electronic": "electronic",
                "jazz": "jazz",
                "classical": "classical",
                "metal": "metal",
                "ambient": "ambient",
                "acoustic": "acoustic",
                "instrumental": "instrumental",
            }
            description_lower = description.casefold()
            for keyword, category in fallback_matches.items():
                if len(categories) >= 5:
                    break
                if keyword in description_lower and category not in categories:
                    categories.append(category)
            for category in ("pop", "electronic", "ambient"):
                if len(categories) >= 3:
                    break
                if category not in categories:
                    categories.append(category)

        qwen_prompt_cache.put(cache_key, categories)
        return categories

    def generate_cover_prompt(self, description: str) -> str:
        style_suffix = "album cover, square composition, no text, no typography"
        fallback = f"{description}, 35mm film photograph, natural light, {style_suffix}"

        cache_key = _make_cache_key("cover-prompt", description)
        cached = qwen_prompt_cache.get(cache_key)
        if cached is not None:
            logger.info(f"Cache hit | fn=generate_cover_prompt key={cache_key}")
            return cached

        try:
            response_text = self.prompt_qwen(
                COVER_ART_PROMPT.format(description=description), max_new_tokens=120)
        except Exception as e:
            logger.warning(f"Cover prompt generation failed, using fallback: {e}")
            return fallback

        cover_prompt = " ".join(response_text.split()).strip("\"'")
        if not cover_prompt:
            return fallback

        cover_prompt = f"{cover_prompt.rstrip('.')}, {style_suffix}"
        qwen_prompt_cache.put(cache_key, cover_prompt)
        logger.info(f"Cover prompt: {cover_prompt}")
        return cover_prompt

    def generate_title(self, description: str, language: str) -> Optional[str]:
        cache_key = _make_cache_key("title", f"{language}:{description}")
        cached = qwen_prompt_cache.get(cache_key)
        if cached is not None:
            logger.info(f"Cache hit | fn=generate_title key={cache_key}")
            return cached

        prompt = (
            f"Write a short, catchy song title in {language} (2 to 5 words) "
            "for a song matching this description. Return only the title, "
            f"with no quotes, punctuation at the end, or extra text. Description: '{description}'"
        )
        try:
            response_text = self.prompt_qwen(prompt, max_new_tokens=24)
        except Exception as e:
            logger.warning(f"Title generation failed, keeping default title: {e}")
            return None

        lines = response_text.strip().splitlines()
        title = lines[0].strip().strip("\"'*#`“”").rstrip(".,;:!?").strip() if lines else ""
        if not title or len(title) > 60:
            return None

        qwen_prompt_cache.put(cache_key, title)
        return title

    def resolve_dynamic_inference_settings(
        self,
        context_text: str,
        infer_step: int,
        guidance_scale: float,
    ) -> tuple[int, float]:
        normalized_text = context_text.lower()
        matched_genres = [k for k in GENRE_PROFILE_KEYWORDS if k in normalized_text]

        if not matched_genres:
            return infer_step, guidance_scale

        # Keep explicit user overrides untouched and only replace default values.
        resolved_infer_step = infer_step
        resolved_guidance_scale = guidance_scale
        applied_profiles = []

        for genre in matched_genres:
            profile = GENRE_INFERENCE_PROFILES[genre]
            applied_profiles.append(genre)
            if infer_step == AudioGenerationBase.model_fields["infer_step"].default:
                resolved_infer_step = max(resolved_infer_step, profile["infer_step"])
            if guidance_scale == AudioGenerationBase.model_fields["guidance_scale"].default:
                resolved_guidance_scale = max(resolved_guidance_scale, profile["guidance_scale"])

        logger.info(
            "Dynamic inference settings applied | genres=%s infer_step=%s guidance_scale=%s",
            ",".join(applied_profiles),
            resolved_infer_step,
            resolved_guidance_scale,
        )

        return resolved_infer_step, resolved_guidance_scale
    
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
    def _upload_to_s3(self, s3_client, local_path, bucket_name, s3_key, extra_args=None):
        upload_args = {"ExtraArgs": extra_args} if extra_args else {}
        s3_client.upload_file(local_path, bucket_name, s3_key, **upload_args)

    def _upload_extra_audio_formats(self, s3_client, wav_path, bucket_name, song_folder, extra_args=None):
        for extension, codec_args in AUDIO_EXPORT_FORMATS.items():
            converted_path = f"{os.path.splitext(wav_path)[0]}.{extension}"
            s3_key = f"{song_folder}/audio.{extension}"
            try:
                subprocess.run(
                    ["ffmpeg", "-y", "-loglevel", "error", "-i", wav_path, *codec_args, converted_path],
                    check=True,
                    timeout=180,
                )
                self._upload_to_s3(s3_client, converted_path, bucket_name, s3_key, extra_args)
            except Exception as e:
                # A missing extra format must never fail the whole generation.
                logger.warning(f"Audio export skipped | format={extension} key={s3_key}: {e}")
            finally:
                if os.path.exists(converted_path):
                    os.remove(converted_path)

    def generate_and_upload_to_s3(
            self,
            prompt: str,
            lyrics: str,
            instrumental: bool,
            audio_duration: float,
            infer_step: int,
            guidance_scale: float,
            seed: int,
            description_for_categorization: str,
            language: str = "English",
            title_context: Optional[str] = None,
    ) -> GenerateMusicResponseS3:
        infer_step, guidance_scale = self.resolve_dynamic_inference_settings(
            context_text=f"{prompt} {description_for_categorization}",
            infer_step=infer_step,
            guidance_scale=guidance_scale,
        )

        final_lyrics = "[instrumental]" if instrumental else lyrics
        logger.success(f"Generated lyrics: \n{final_lyrics}")
        logger.info(f"Prompt: \n{prompt}")

        s3_client = boto3.client("s3", region_name=os.environ.get("AWS_REGION", "us-east-1"))
        bucket_name = os.environ["S3_BUCKET_NAME"]

        # Every asset for this generation (audio + cover) lives together under
        # one ASCII-safe folder, e.g. "3f9a1c2d-....../".
        song_folder = _make_song_folder()

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

        audio_s3_key = f"{song_folder}/audio.wav"

        audio_extra_args = {
            "Metadata": {
                "generation-requested-seed": str(seed),
                "generation-infer-step": str(infer_step),
                "generation-guidance-scale": str(guidance_scale),
                "generation-audio-duration": str(audio_duration),
                "generation-instrumental": str(instrumental).lower(),
                "generation-language": language,
            },
        }

        try:
            self._upload_to_s3(
                s3_client, output_path, bucket_name, audio_s3_key, audio_extra_args)
            self._upload_extra_audio_formats(
                s3_client, output_path, bucket_name, song_folder, audio_extra_args)
        except Exception as e:
            logger.error(f"S3 upload failed for audio file {audio_s3_key}: {e}")
            raise
        finally:
            os.remove(output_path)

        # Thumbnail generation
        cover_prompt = self.generate_cover_prompt(description_for_categorization)
        try:
            image = self.image_pipe(
                prompt=cover_prompt,
                num_inference_steps=4,
                guidance_scale=0.0,
                height=1024,
                width=1024,
                max_sequence_length=256,
            ).images[0]
        except Exception as e:
            logger.error(f"Image inference failed | cover_prompt='{cover_prompt}': {e}")
            raise

        image_output_path = os.path.join(output_dir, f"{uuid.uuid4()}.jpg")
        image.convert("RGB").save(image_output_path, "JPEG", quality=90)

        image_s3_key = f"{song_folder}/cover.jpg"

        try:
            self._upload_to_s3(s3_client, image_output_path, bucket_name, image_s3_key,
                               {"ContentType": "image/jpeg"})
        except Exception as e:
            logger.error(f"S3 upload failed for thumbnail {image_s3_key}: {e}")
            raise
        finally:
            os.remove(image_output_path)

        # Category generation: "hip-hop", "rock"
        categories = self.generate_categories(description_for_categorization, language)

        title = self.generate_title(title_context or description_for_categorization, language)

        return GenerateMusicResponseS3(
            s3_key=audio_s3_key,
            cover_image_s3_key=image_s3_key,
            categories=categories,
            title=title,
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

        full_described_song, language = self.input_validation(request.full_described_song)

        prompt = self.generate_prompt(full_described_song, language)

        lyrics = ""
        if not request.instrumental:
            lyrics = self.generate_lyrics(full_described_song, language)
        return self.generate_and_upload_to_s3(prompt=prompt, lyrics=lyrics,
                                                    description_for_categorization=full_described_song,
                                                    language=language,
                                                    **request.model_dump(exclude={"full_described_song"}))

    @modal.fastapi_endpoint(method="POST", requires_proxy_auth=True)
    def generate_with_lyrics(self, request: GenerateWithCustomLyricsRequest) -> GenerateMusicResponseS3:
        logger.info(f"generate_with_lyrics called | audio_duration={request.audio_duration}")

        validated_prompt, _ = self.input_validation(request.prompt)
        validated_lyrics, lyrics_language = self.input_validation(request.lyrics)

        return self.generate_and_upload_to_s3(prompt=validated_prompt, lyrics=validated_lyrics,
                                              description_for_categorization=validated_prompt,
                                              language=lyrics_language,
                                              title_context=f"Style: {validated_prompt}. Lyrics: {validated_lyrics[:300]}",
                                              **request.model_dump(exclude={"prompt", "lyrics"}))

    @modal.fastapi_endpoint(method="POST", requires_proxy_auth=True)
    def generate_with_described_lyrics(self, request: GenerateWithDescribedLyricsRequest) -> GenerateMusicResponseS3:
        logger.info(f"generate_with_described_lyrics called | audio_duration={request.audio_duration}")

        validated_prompt, language = self.input_validation(request.prompt)

        #Generating lyrics
        lyrics = ""
        if not request.instrumental:
            validated_described_lyrics, _ = self.input_validation(request.described_lyrics)
            lyrics = self.generate_lyrics(validated_described_lyrics, language)
        return self.generate_and_upload_to_s3(prompt=validated_prompt, lyrics=lyrics,
                                              description_for_categorization=validated_prompt,
                                              language=language,
                                              title_context=f"Style: {validated_prompt}. Theme: {request.described_lyrics}",
                                              **request.model_dump(exclude={"described_lyrics", "prompt"}))

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