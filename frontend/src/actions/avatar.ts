"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { headers } from "next/headers";
import { env } from "~/env";
import { auth } from "~/lib/auth";
import { avatarKey, createS3Client } from "~/lib/s3";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

export async function uploadAvatar(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("You must be signed in.");

  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("No image received.");
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Use a PNG, JPEG, or WebP image.");
  }
  if (file.size > MAX_AVATAR_BYTES) {
    throw new Error("The image must be smaller than 2 MB.");
  }

  await createS3Client().send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: avatarKey(session.user.id),
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
    }),
  );

  // Version param busts browser caches after a new upload.
  return `/api/avatar/${session.user.id}?v=${Date.now()}`;
}
