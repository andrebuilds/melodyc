import { Prisma } from "@prisma/client";
import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPresignedUrl } from "~/actions/generation";
import { inngest } from "~/inngest/client";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

const requestSchema = z.object({
  prompt: z.string().trim().min(10).max(300),
  instrumental: z.boolean().default(false),
});

function getRateLimitKey(request: NextRequest) {
  const address =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "local";
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const day = new Date().toISOString().slice(0, 10);
  const visitorHash = createHash("sha256")
    .update(`${address}:${userAgent}`)
    .digest("hex");

  return `${day}:${visitorHash}`;
}

async function serializeGeneration(id: string) {
  const generation = await db.demoGeneration.findUnique({ where: { id } });

  if (!generation) return null;

  const [audioUrl, thumbnailUrl] = await Promise.all([
    generation.status === "processed" && generation.s3Key
      ? getPresignedUrl(generation.s3Key)
      : null,
    generation.status === "processed" && generation.thumbnailS3Key
      ? getPresignedUrl(generation.thumbnailS3Key)
      : null,
  ]);

  return {
    id: generation.id,
    prompt: generation.prompt,
    status: generation.status,
    audioUrl,
    thumbnailUrl,
  };
}

export async function POST(request: NextRequest) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Describe your song using between 10 and 300 characters." },
      { status: 400 },
    );
  }

  const rateLimitKey = getRateLimitKey(request);
  const existing = await db.demoGeneration.findUnique({
    where: { rateLimitKey },
  });

  if (existing && existing.status !== "failed") {
    return NextResponse.json(await serializeGeneration(existing.id));
  }

  let generation;

  try {
    generation = existing
      ? await db.demoGeneration.update({
          where: { id: existing.id },
          data: {
            prompt: parsed.data.prompt,
            instrumental: parsed.data.instrumental,
            status: "queued",
            s3Key: null,
            thumbnailS3Key: null,
          },
        })
      : await db.demoGeneration.create({
          data: {
            prompt: parsed.data.prompt,
            instrumental: parsed.data.instrumental,
            rateLimitKey,
          },
        });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const racedGeneration = await db.demoGeneration.findUnique({
        where: { rateLimitKey },
      });

      if (racedGeneration) {
        return NextResponse.json(await serializeGeneration(racedGeneration.id));
      }
    }

    throw error;
  }

  try {
    await inngest.send({
      name: "generate-demo-song-event",
      data: { demoGenerationId: generation.id },
    });
  } catch (error) {
    await db.demoGeneration.update({
      where: { id: generation.id },
      data: { status: "failed" },
    });
    throw error;
  }

  return NextResponse.json(
    { id: generation.id, prompt: generation.prompt, status: generation.status },
    { status: 202 },
  );
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id || id.length > 64) {
    return NextResponse.json({ error: "Invalid generation id." }, { status: 400 });
  }

  const generation = await serializeGeneration(id);

  if (!generation) {
    return NextResponse.json({ error: "Generation not found." }, { status: 404 });
  }

  return NextResponse.json(generation, {
    headers: { "Cache-Control": "no-store" },
  });
}