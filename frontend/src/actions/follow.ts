"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPresignedUrl } from "~/actions/generation";
import { auth } from "~/lib/auth";
import { notifyNewFollower } from "~/lib/notifications";
import { createInAppNotification } from "~/lib/in-app-notifications";
import { db } from "~/server/db";

async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/sign-in");
  return session.user.id;
}

export async function toggleFollow(targetUserId: string) {
  const userId = await requireUserId();
  if (userId === targetUserId) throw new Error("You cannot follow yourself.");

  const key = { followerId: userId, followingId: targetUserId };
  const existing = await db.follow.findUnique({
    where: { followerId_followingId: key },
  });

  if (existing) {
    await db.follow.delete({ where: { followerId_followingId: key } });
    await db.notification.deleteMany({
      where: { type: "follow", actorId: userId, userId: targetUserId },
    });
  } else {
    await db.follow.create({ data: key });
    await createInAppNotification({
      type: "follow",
      userId: targetUserId,
      actorId: userId,
    });
    try {
      await notifyNewFollower(userId, targetUserId);
    } catch (error) {
      console.error("New follower email failed", error);
    }
  }

  const followersCount = await db.follow.count({
    where: { followingId: targetUserId },
  });

  revalidatePath("/discover");
  return { isFollowing: !existing, followersCount };
}

export async function getFollowList(
  userId: string,
  type: "followers" | "following",
) {
  await requireUserId();

  const follows = await db.follow.findMany({
    where: type === "followers" ? { followingId: userId } : { followerId: userId },
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      follower: { select: { id: true, name: true, username: true, image: true } },
      following: { select: { id: true, name: true, username: true, image: true } },
    },
  });

  return follows.map((follow) =>
    type === "followers" ? follow.follower : follow.following,
  );
}

export async function getFollowingSongs() {
  const userId = await requireUserId();

  const songs = await db.song.findMany({
    where: {
      published: true,
      user: { followers: { some: { followerId: userId } } },
    },
    include: {
      user: { select: { name: true, username: true } },
      _count: { select: { likes: true } },
      categories: true,
      likes: { where: { userId } },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 12,
  });

  return Promise.all(
    songs.map(async (song) => ({
      ...song,
      thumbnailUrl: song.thumbnailS3Key
        ? await getPresignedUrl(song.thumbnailS3Key)
        : null,
    })),
  );
}
