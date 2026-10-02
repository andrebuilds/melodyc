"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { inngest } from "~/inngest/client";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";
import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { env } from "~/env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createS3Client } from "~/lib/s3";

export interface GenerateRequest {
  prompt?: string;
  lyrics?: string;
  fullDescribedSong?: string;
  describedLyrics?: string;
  instrumental?: boolean;
}

export async function generateSong(generateRequest: GenerateRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  await queueSong(generateRequest, 7.5, session.user.id);

  revalidatePath("/create");
}

function buildFallbackTitle(generateRequest: GenerateRequest) {
  const firstLyricsLine = generateRequest.lyrics
    ?.split("\n")
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith("["));

  const source = [
    generateRequest.fullDescribedSong,
    generateRequest.describedLyrics,
    firstLyricsLine,
    generateRequest.prompt,
  ].find((value) => value?.trim());

  const words = source?.trim().split(/\s+/).slice(0, 6).join(" ");
  if (!words) return "Untitled";

  const title = words.length > 60 ? words.slice(0, 60).trim() : words;
  return title.charAt(0).toUpperCase() + title.slice(1);
}

export async function queueSong(
  generateRequest: GenerateRequest,
  guidanceScale: number,
  userId: string,
) {
  const title = buildFallbackTitle(generateRequest);

  const song = await db.song.create({
    data: {
      userId: userId,
      title: title,
      prompt: generateRequest.prompt,
      lyrics: generateRequest.lyrics,
      describedLyrics: generateRequest.describedLyrics,
      fullDescribedSong: generateRequest.fullDescribedSong,
      instrumental: generateRequest.instrumental,
      guidanceScale: guidanceScale,
      audioDuration: 180,
    },
  });

  await inngest.send({
    name: "generate-song-event",
    data: { songId: song.id, userId: song.userId },
  });
}

export async function getPlayUrl(songId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  const song = await db.song.findUniqueOrThrow({
    where: {
      id: songId,
      OR: [{ userId: session.user.id }, { published: true }],
      s3Key: {
        not: null,
      },
    },
    select: {
      s3Key: true,
    },
  });

  await db.song.update({
    where: {
      id: songId,
    },
    data: {
      listenCount: {
        increment: 1,
      },
    },
  });

  return await getPresignedUrl(song.s3Key!);
}

export async function getPresignedUrl(key: string) {
  const s3Client = createS3Client();

  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });
}

const DOWNLOAD_FORMATS = ["wav", "mp3", "flac"] as const;
export type DownloadFormat = (typeof DOWNLOAD_FORMATS)[number];

async function getDownloadableSong(songId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  return db.song.findUniqueOrThrow({
    where: {
      id: songId,
      OR: [{ userId: session.user.id }, { published: true }],
      s3Key: { not: null },
    },
    select: { s3Key: true, title: true, thumbnailS3Key: true },
  });
}

function toFileBaseName(title: string | null) {
  return (
    (title ?? "melodyc-song")
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 80) || "melodyc-song"
  );
}

function getFormatKey(wavKey: string, format: DownloadFormat) {
  return wavKey.replace(/\.wav$/i, `.${format}`);
}

export async function getDownloadFormats(songId: string) {
  const song = await getDownloadableSong(songId);
  const s3Client = createS3Client();

  const available = await Promise.all(
    DOWNLOAD_FORMATS.map(async (format) => {
      if (format === "wav") return format;
      try {
        await s3Client.send(
          new HeadObjectCommand({
            Bucket: env.S3_BUCKET_NAME,
            Key: getFormatKey(song.s3Key!, format),
          }),
        );
        return format;
      } catch {
        return null;
      }
    }),
  );

  const formats = available.filter(
    (format): format is DownloadFormat => !!format,
  );

  return { formats, hasCover: !!song.thumbnailS3Key };
}

export async function getCoverDownloadUrl(songId: string) {
  const song = await getDownloadableSong(songId);
  if (!song.thumbnailS3Key) throw new Error("This song has no cover.");

  const extension = song.thumbnailS3Key.split(".").pop() ?? "png";
  const fileName = `${toFileBaseName(song.title)}-cover.${extension}`;

  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: song.thumbnailS3Key,
    ResponseContentDisposition: `attachment; filename="${fileName}"`,
  });

  return await getSignedUrl(createS3Client(), command, {
    expiresIn: 300,
  });
}

export async function getDownloadUrl(songId: string, format: DownloadFormat) {
  if (!DOWNLOAD_FORMATS.includes(format)) throw new Error("Invalid format.");

  const song = await getDownloadableSong(songId);
  const fileName = `${toFileBaseName(song.title)}.${format}`;

  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: getFormatKey(song.s3Key!, format),
    ResponseContentDisposition: `attachment; filename="${fileName}"`,
  });

  return await getSignedUrl(createS3Client(), command, {
    expiresIn: 300,
  });
}
