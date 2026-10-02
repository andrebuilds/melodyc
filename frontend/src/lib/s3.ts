import { DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "~/env";

export function createS3Client() {
  return new S3Client({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY_ID,
    },
  });
}

type SongFiles = { s3Key: string | null; thumbnailS3Key: string | null };

export function avatarKey(userId: string) {
  return `avatars/${userId}`;
}

// Includes the MP3/FLAC exports stored next to the original WAV.
export async function deleteSongFiles(songs: SongFiles[]) {
  const keys = [
    ...new Set(
      songs.flatMap((song) =>
        [
          song.s3Key,
          song.s3Key?.replace(/\.wav$/i, ".mp3"),
          song.s3Key?.replace(/\.wav$/i, ".flac"),
          song.thumbnailS3Key,
        ].filter((key): key is string => !!key),
      ),
    ),
  ];

  const s3Client = createS3Client();
  // DeleteObjects accepts at most 1000 keys per request.
  for (let i = 0; i < keys.length; i += 1000) {
    await s3Client.send(
      new DeleteObjectsCommand({
        Bucket: env.S3_BUCKET_NAME,
        Delete: {
          Objects: keys.slice(i, i + 1000).map((Key) => ({ Key })),
          Quiet: true,
        },
      }),
    );
  }
}
