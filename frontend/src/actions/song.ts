"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

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
