import { db } from "~/server/db";
import { inngest } from "./client";
import { env } from "~/env";
import { notifySongResult } from "~/lib/notifications";
import { deleteSongFiles } from "~/lib/s3";

const DEMO_RETENTION_DAYS = 30;
const DEMO_CLEANUP_BATCH = 500;

// Enforces the 30-day demo retention stated in the Privacy Policy (section 9).
export const cleanupDemoGenerations = inngest.createFunction(
  { id: "cleanup-demo-generations" },
  { cron: "TZ=Europe/Rome 0 3 * * *" },
  async ({ step }) => {
    const cutoff = new Date(
      Date.now() - DEMO_RETENTION_DAYS * 24 * 60 * 60 * 1000,
    ).toISOString();
    let deleted = 0;

    for (let batch = 0; ; batch++) {
      const count = await step.run(`delete-batch-${batch}`, async () => {
        const demos = await db.demoGeneration.findMany({
          where: { createdAt: { lt: new Date(cutoff) } },
          select: { id: true, s3Key: true, thumbnailS3Key: true },
          take: DEMO_CLEANUP_BATCH,
        });
        if (demos.length === 0) return 0;

        await deleteSongFiles(demos);
        await db.demoGeneration.deleteMany({
          where: { id: { in: demos.map((demo) => demo.id) } },
        });
        return demos.length;
      });

      deleted += count;
      if (count < DEMO_CLEANUP_BATCH) break;
    }

    return { deleted, cutoff };
  },
);

type GenerationResponse = {
  s3_key: string;
  cover_image_s3_key: string;
  categories: string[];
  title?: string | null;
};

export const generateDemoSong = inngest.createFunction(
  {
    id: "generate-demo-song",
    concurrency: { limit: 1 },
    onFailure: async ({ event }) => {
      const { demoGenerationId } = event.data.event.data as {
        demoGenerationId: string;
      };

      await db.demoGeneration.update({
        where: { id: demoGenerationId },
        data: { status: "failed" },
      });
    },
  },
  { event: "generate-demo-song-event" },
  async ({ event, step }) => {
    const { demoGenerationId } = event.data as {
      demoGenerationId: string;
    };

    const demo = await step.run("load-demo-generation", async () => {
      return db.demoGeneration.update({
        where: { id: demoGenerationId },
        data: { status: "processing" },
      });
    });

    const response = await step.fetch(env.GENERATE_FROM_DESCRIPTION, {
      method: "POST",
      body: JSON.stringify({
        full_described_song: demo.prompt,
        instrumental: demo.instrumental,
        audio_duration: 30,
        infer_step: 30,
        guidance_scale: 7.5,
      }),
      headers: {
        "Content-Type": "application/json",
        "Modal-Key": env.MODAL_KEY,
        "Modal-Secret": env.MODAL_SECRET,
      },
    });

    const responseData = response.ok
      ? ((await response.json()) as GenerationResponse)
      : null;

    await step.run("save-demo-result", async () => {
      return db.demoGeneration.update({
        where: { id: demoGenerationId },
        data: {
          s3Key: responseData?.s3_key,
          thumbnailS3Key: responseData?.cover_image_s3_key,
          status: response.ok ? "processed" : "failed",
        },
      });
    });
  },
);

export const generateSong = inngest.createFunction(
  {
    id: "generate-song",
    concurrency: {
      limit: 1,
      key: "event.data.userId",
    },
    onFailure: async ({ event }) => {
      const { songId } = event?.data?.event?.data as { songId: string };

      await db.song.update({
        where: {
          id: songId,
        },
        data: {
          status: "failed",
        },
      });

      try {
        await notifySongResult(songId, false);
      } catch (error) {
        console.error("Song failure email failed", error);
      }
    },
  },
  { event: "generate-song-event" },
  async ({ event, step }) => {
    const { songId } = event.data as {
      songId: string;
      userId: string;
    };

    const { userId, credits, endpoint, body, originalTitle } = await step.run(
      "check-credits",
      async () => {
        const song = await db.song.findUniqueOrThrow({
          where: {
            id: songId,
          },
          select: {
            user: {
              select: {
                id: true,
                credits: true,
              },
            },
            prompt: true,
            title: true,
            lyrics: true,
            fullDescribedSong: true,
            describedLyrics: true,
            instrumental: true,
            guidanceScale: true,
            inferStep: true,
            audioDuration: true,
            seed: true,
          },
        });

        type RequestBody = {
          guidance_scale?: number;
          infer_step?: number;
          audio_duration?: number;
          seed?: number;
          full_described_song?: string;
          prompt?: string;
          lyrics?: string;
          described_lyrics?: string;
          instrumental?: boolean;
        };

        let endpoint = "";
        let body: RequestBody = {};

        const commomParams = {
          guidance_scale: song.guidanceScale ?? undefined,
          infer_step: song.inferStep ?? undefined,
          audio_duration: song.audioDuration ?? undefined,
          seed: song.seed ?? undefined,
          instrumental: song.instrumental ?? undefined,
        };

        // Description of a song
        if (song.fullDescribedSong) {
          endpoint = env.GENERATE_FROM_DESCRIPTION;
          body = {
            full_described_song: song.fullDescribedSong,
            ...commomParams,
          };
        }

        // Custom mode: Lyrics + prompt
        else if (song.lyrics && song.prompt) {
          endpoint = env.GENERATE_WITH_LYRICS;
          body = {
            lyrics: song.lyrics,
            prompt: song.prompt,
            ...commomParams,
          };
        }

        // Custom mode: Prompt + described lyrics
        else if (song.describedLyrics && song.prompt) {
          endpoint = env.GENERATE_FROM_DESCRIBED_LYRICS;
          body = {
            described_lyrics: song.describedLyrics,
            prompt: song.prompt,
            ...commomParams,
          };
        }

        return {
          userId: song.user.id,
          credits: song.user.credits,
          endpoint: endpoint,
          body: body,
          originalTitle: song.title,
        };
      },
    );

    if (credits > 0) {
      // Generate the song
      await step.run("set-status-processing", async () => {
        return await db.song.update({
          where: {
            id: songId,
          },
          data: {
            status: "processing",
          },
        });
      });

      const response = await step.fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Modal-Key": env.MODAL_KEY,
          "Modal-Secret": env.MODAL_SECRET,
        },
      });

      await step.run("update-song-result", async () => {
        const responseData = response.ok
          ? ((await response.json()) as GenerationResponse)
          : null;

        await db.song.update({
          where: {
            id: songId,
          },
          data: {
            s3Key: responseData?.s3_key,
            thumbnailS3Key: responseData?.cover_image_s3_key,
            status: response.ok ? "processed" : "failed",
          },
        });

        const generatedTitle = responseData?.title?.trim();
        if (generatedTitle) {
          // Only replace the fallback title, never one the user renamed meanwhile.
          await db.song.updateMany({
            where: { id: songId, title: originalTitle },
            data: { title: generatedTitle },
          });
        }

        if (responseData && responseData.categories.length > 0) {
          await db.song.update({
            where: { id: songId },
            data: {
              categories: {
                connectOrCreate: responseData.categories.map(
                  (categoryName) => ({
                    where: { name: categoryName },
                    create: { name: categoryName },
                  }),
                ),
              },
            },
          });
        }
      });

      await step.run("deduct-credits", async () => {
        if (!response.ok) return;

        return await db.user.update({
          where: { id: userId },
          data: {
            credits: {
              decrement: 1,
            },
          },
        });
      });

      await step.run("notify-user", async () => {
        try {
          await notifySongResult(songId, response.ok);
        } catch (error) {
          // A failed email must not retry or fail an already completed generation.
          console.error("Song result email failed", error);
        }
      });
    } else {
      // Set song status "not enough credits"
      await step.run("set-status-no-credits", async () => {
        return await db.song.update({
          where: {
            id: songId,
          },
          data: {
            status: "no credits",
          },
        });
      });
    }
  },
);
