"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPresignedUrl } from "~/actions/generation";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

const HOME_PAGE_SIZE = 20;

export async function getPublishedSongs(cursor?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  const songs = await db.song.findMany({
    where: {
      published: true,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
      categories: true,
      likes: {
        where: {
          userId: session.user.id,
        },
      },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    take: HOME_PAGE_SIZE + 1,
  });

  const hasMore = songs.length > HOME_PAGE_SIZE;
  const pageSongs = hasMore ? songs.slice(0, HOME_PAGE_SIZE) : songs;

  const songsWithUrls = await Promise.all(
    pageSongs.map(async (song) => {
      const thumbnailUrl = song.thumbnailS3Key
        ? await getPresignedUrl(song.thumbnailS3Key)
        : null;

      return { ...song, thumbnailUrl };
    }),
  );

  return {
    songs: songsWithUrls,
    nextCursor: hasMore ? (pageSongs.at(-1)?.id ?? null) : null,
    hasMore,
  };
}

export async function getProcessingSongStatuses(songIds: string[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  return db.song.findMany({
    where: {
      id: { in: songIds },
      userId: session.user.id,
    },
    select: {
      id: true,
      status: true,
    },
  });
}

export async function setPublishedStatus(songId: string, published: boolean) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  await db.song.update({
    where: {
      id: songId,
      userId: session.user.id,
    },
    data: {
      published,
    },
  });

  revalidatePath("/create");
}

export async function renameSong(songId: string, newTitle: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  await db.song.update({
    where: {
      id: songId,
      userId: session.user.id,
    },
    data: {
      title: newTitle,
    },
  });

  revalidatePath("/create");
}

export async function toggleLikeSong(songId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  const existingLike = await db.like.findUnique({
    where: {
      userId_songId: {
        userId: session.user.id,
        songId,
      },
    },
  });

  if (existingLike) {
    await db.like.delete({
      where: {
        userId_songId: {
          userId: session.user.id,
          songId,
        },
      },
    });
  } else {
    await db.like.create({
      data: {
        userId: session.user.id,
        songId,
      },
    });
  }

  revalidatePath("/");
}
