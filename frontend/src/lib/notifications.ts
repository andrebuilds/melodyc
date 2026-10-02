import type { NotificationPreference } from "@prisma/client";
import { db } from "~/server/db";
import {
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

  const settings = await getNotificationSettings(song.user.id);

  if (succeeded && settings.songReady) {
    await sendSongReadyEmail(song.user.email, song.user.id, song.title);
  } else if (!succeeded && settings.songFailed) {
    await sendSongFailedEmail(song.user.email, song.user.id, song.title);
  }
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

  const settings = await getNotificationSettings(userId);
  if (!settings.paymentConfirmed) return;

  await sendPaymentConfirmedEmail(user.email, userId, creditsAdded, user.credits);
}
