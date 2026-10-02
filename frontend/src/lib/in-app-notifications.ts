import { db } from "~/server/db";

export type InAppNotificationType =
  | "like"
  | "follow"
  | "listen_milestone"
  | "song_ready"
  | "song_failed"
  | "credits_added";

const LISTEN_MILESTONES = new Set([10, 50, 100, 500, 1000, 5000, 10000]);

export async function createInAppNotification(data: {
  type: InAppNotificationType;
  userId: string;
  actorId?: string;
  songId?: string;
  value?: number;
}) {
  if (data.actorId && data.actorId === data.userId) return;

  try {
    await db.notification.create({ data });
  } catch (error) {
    console.error("In-app notification failed", error);
  }
}

export async function removeLikeNotification(actorId: string, songId: string) {
  await db.notification.deleteMany({
    where: { type: "like", actorId, songId },
  });
}

export async function notifyListenMilestone(
  songId: string,
  ownerId: string,
  listenCount: number,
) {
  if (!LISTEN_MILESTONES.has(listenCount)) return;
  await createInAppNotification({
    type: "listen_milestone",
    userId: ownerId,
    songId,
    value: listenCount,
  });
}
