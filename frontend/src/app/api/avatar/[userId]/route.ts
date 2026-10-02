import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { env } from "~/env";
import { avatarKey, createS3Client } from "~/lib/s3";

const USER_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  if (!USER_ID_PATTERN.test(userId)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const url = await getSignedUrl(
    createS3Client(),
    new GetObjectCommand({ Bucket: env.S3_BUCKET_NAME, Key: avatarKey(userId) }),
    { expiresIn: 3600 },
  );

  return NextResponse.redirect(url, {
    status: 302,
    headers: { "Cache-Control": "public, max-age=3000" },
  });
}
