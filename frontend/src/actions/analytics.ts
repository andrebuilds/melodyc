"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

const CHART_DAYS = 14;

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function getAnalytics() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  const userId = session.user.id;
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - (CHART_DAYS - 1));
  since.setUTCHours(0, 0, 0, 0);

  const [songs, likes, followers, following, newFollowers, newFollowing] =
    await Promise.all([
      db.song.findMany({
        where: { userId, s3Key: { not: null } },
        select: { createdAt: true, published: true, listenCount: true },
      }),
      db.like.count({ where: { song: { userId } } }),
      db.follow.count({ where: { followingId: userId } }),
      db.follow.count({ where: { followerId: userId } }),
      db.follow.count({
        where: { followingId: userId, createdAt: { gte: since } },
      }),
      db.follow.count({
        where: { followerId: userId, createdAt: { gte: since } },
      }),
    ]);

  const days = Array.from({ length: CHART_DAYS }, (_, index) => {
    const date = new Date(since);
    date.setUTCDate(since.getUTCDate() + index);
    return {
      date: dateKey(date),
      label: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      generated: 0,
      published: 0,
    };
  });
  const daysByDate = new Map(days.map((day) => [day.date, day]));

  for (const song of songs) {
    const day = daysByDate.get(dateKey(song.createdAt));
    if (!day) continue;
    day.generated += 1;
    if (song.published) day.published += 1;
  }

  return {
    totals: {
      generated: songs.length,
      published: songs.filter((song) => song.published).length,
      likes,
      listens: songs.reduce((total, song) => total + song.listenCount, 0),
      followers,
      following,
      newFollowers,
      newFollowing,
    },
    activity: days,
  };
}
