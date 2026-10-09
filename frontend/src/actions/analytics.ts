"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPresignedUrl } from "~/actions/generation";
import { parseAnalyticsRange } from "~/lib/analytics";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

const DAY_MS = 24 * 60 * 60 * 1000;

type DailyMetric = "likes" | "followers" | "songs";

export type AnalyticsDay = Record<DailyMetric, number> & {
  date: string;
  label: string;
  totalFollowers: number;
};

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function getAnalytics(requestedRange: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  const range = parseAnalyticsRange(requestedRange);
  const userId = session.user.id;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const start = new Date(today.getTime() - (range - 1) * DAY_MS);
  const previousStart = new Date(start.getTime() - range * DAY_MS);

  const [songs, likeEvents, followEvents, totalLikes, followers, following, milestones] =
    await Promise.all([
      db.song.findMany({
        where: { userId, s3Key: { not: null } },
        select: {
          id: true,
          title: true,
          createdAt: true,
          published: true,
          listenCount: true,
          thumbnailS3Key: true,
          categories: { select: { name: true } },
          _count: { select: { likes: true } },
        },
      }),
      // Like notifications carry the like timestamp (the Like table has none) and exclude self-likes.
      db.notification.findMany({
        where: { userId, type: "like", createdAt: { gte: previousStart } },
        select: { createdAt: true },
      }),
      db.follow.findMany({
        where: { followingId: userId, createdAt: { gte: previousStart } },
        select: { createdAt: true },
      }),
      db.like.count({ where: { song: { userId } } }),
      db.follow.count({ where: { followingId: userId } }),
      db.follow.count({ where: { followerId: userId } }),
      db.notification.findMany({
        where: { userId, type: "listen_milestone", createdAt: { gte: start } },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          value: true,
          createdAt: true,
          song: { select: { title: true } },
        },
      }),
    ]);

  const days: AnalyticsDay[] = Array.from({ length: range }, (_, index) => {
    const date = new Date(start.getTime() + index * DAY_MS);
    return {
      date: dateKey(date),
      label: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      likes: 0,
      followers: 0,
      songs: 0,
      totalFollowers: 0,
    };
  });
  const daysByDate = new Map(days.map((day) => [day.date, day]));
  const previous: Record<DailyMetric, number> = { likes: 0, followers: 0, songs: 0 };

  const tally = (date: Date, metric: DailyMetric) => {
    const day = daysByDate.get(dateKey(date));
    if (day) day[metric] += 1;
    else if (date >= previousStart && date < start) previous[metric] += 1;
  };

  likeEvents.forEach((event) => tally(event.createdAt, "likes"));
  followEvents.forEach((event) => tally(event.createdAt, "followers"));
  songs.forEach((song) => tally(song.createdAt, "songs"));

  const current: Record<DailyMetric, number> = {
    likes: days.reduce((sum, day) => sum + day.likes, 0),
    followers: days.reduce((sum, day) => sum + day.followers, 0),
    songs: days.reduce((sum, day) => sum + day.songs, 0),
  };

  const followersAtStart = Math.max(0, followers - current.followers);
  let runningFollowers = followersAtStart;
  for (const day of days) {
    runningFollowers += day.followers;
    day.totalFollowers = runningFollowers;
  }

  const listens = songs.reduce((sum, song) => sum + song.listenCount, 0);

  const topSongs = await Promise.all(
    [...songs]
      .sort(
        (a, b) =>
          b.listenCount - a.listenCount || b._count.likes - a._count.likes,
      )
      .slice(0, 5)
      .map(async (song) => ({
        id: song.id,
        title: song.title,
        published: song.published,
        listens: song.listenCount,
        likes: song._count.likes,
        thumbnailUrl: song.thumbnailS3Key
          ? await getPresignedUrl(song.thumbnailS3Key)
          : null,
      })),
  );

  const categoryCounts = new Map<string, number>();
  for (const song of songs) {
    for (const category of song.categories) {
      categoryCounts.set(category.name, (categoryCounts.get(category.name) ?? 0) + 1);
    }
  }
  const topCategories = [...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count, share: count / songs.length }));

  const bestDay = days.reduce<AnalyticsDay | null>(
    (best, day) => (day.likes > (best?.likes ?? 0) ? day : best),
    null,
  );

  return {
    range,
    days,
    summary: {
      likes: { current: current.likes, previous: previous.likes },
      followers: { current: current.followers, previous: previous.followers },
      songs: { current: current.songs, previous: previous.songs },
      totalFollowers: { current: followers, previous: followersAtStart },
    },
    lifetime: {
      listens,
      likes: totalLikes,
      songs: songs.length,
      published: songs.filter((song) => song.published).length,
      followers,
      following,
      engagementRate: listens > 0 ? totalLikes / listens : 0,
    },
    topSongs,
    topCategories,
    bestDay: bestDay ? { label: bestDay.label, likes: bestDay.likes } : null,
    milestones: milestones.map((milestone) => ({
      id: milestone.id,
      listens: milestone.value ?? 0,
      songTitle: milestone.song?.title ?? "A song",
      date: milestone.createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    })),
  };
}

export type AnalyticsData = Awaited<ReturnType<typeof getAnalytics>>;
