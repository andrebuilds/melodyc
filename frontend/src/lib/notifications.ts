import type { NotificationPreference } from "@prisma/client";
import { db } from "~/server/db";
import { createInAppNotification } from "~/lib/in-app-notifications";
import {
  sendNewFollowerEmail,
  sendPaymentConfirmedEmail,
  sendSongFailedEmail,
  sendSongReadyEmail,
  type NotificationType,
} from "~/lib/email";

export type NotificationSettings = Pick<
  NotificationPreference,
  NotificationType
>;

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  songReady: true,
  songFailed: true,
  paymentConfirmed: true,
  newFollower: true,
  productUpdates: false,
};

export async function getNotificationSettings(
  userId: string,
): Promise<NotificationSettings> {
  const preference = await db.notificationPreference.findUnique({
    where: { userId },
  });

  if (!preference) return DEFAULT_NOTIFICATION_SETTINGS;

  return {
    songReady: preference.songReady,
    songFailed: preference.songFailed,
    paymentConfirmed: preference.paymentConfirmed,
    newFollower: preference.newFollower,
    productUpdates: preference.productUpdates,
  };
}

export async function notifySongResult(songId: string, succeeded: boolean) {
  const song = await db.song.findUnique({
    where: { id: songId },
    select: {
      title: true,
      user: { select: { id: true, email: true } },
    },
  });
  if (!song) return;

  await createInAppNotification({
    type: succeeded ? "song_ready" : "song_failed",
    userId: song.user.id,
    songId,
  });

  const settings = await getNotificationSettings(song.user.id);

  if (succeeded && settings.songReady) {
    await sendSongReadyEmail(song.user.email, song.user.id, song.title);
  } else if (!succeeded && settings.songFailed) {
    await sendSongFailedEmail(song.user.email, song.user.id, song.title);
  }
}

export async function notifyNewFollower(followerId: string, followingId: string) {
  const [follower, following] = await Promise.all([
    db.user.findUnique({
      where: { id: followerId },
      select: { id: true, name: true, username: true },
    }),
    db.user.findUnique({
      where: { id: followingId },
      select: { email: true },
    }),
  ]);
  if (!follower || !following) return;

  const settings = await getNotificationSettings(followingId);
  if (!settings.newFollower) return;

  await sendNewFollowerEmail(
    following.email,
    followingId,
    follower.name,
    `/user/${follower.username ?? follower.id}`,
  );
}

export async function notifyPaymentConfirmed(
  userId: string,
  creditsAdded: number,
) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { email: true, credits: true },
  });
  if (!user) return;

  await createInAppNotification({
    type: "credits_added",
    userId,
    value: creditsAdded,
  });

  const settings = await getNotificationSettings(userId);
  if (!settings.paymentConfirmed) return;

  await sendPaymentConfirmedEmail(user.email, userId, creditsAdded, user.credits);
}
