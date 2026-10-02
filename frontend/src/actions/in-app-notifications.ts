"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

const RETENTION_DAYS = 90;

async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/sign-in");
  return session.user.id;
}

export async function getInAppNotifications() {
  const userId = await requireUserId();
  const since = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);

  const [notifications, unreadCount] = await Promise.all([
    db.notification.findMany({
      where: { userId, createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true,
        type: true,
        value: true,
        readAt: true,
        createdAt: true,
        actor: { select: { id: true, name: true, username: true, image: true } },
        song: { select: { id: true, title: true } },
      },
    }),
    db.notification.count({
      where: { userId, readAt: null, createdAt: { gte: since } },
    }),
  ]);

  return { notifications, unreadCount };
}

export async function markAllNotificationsRead() {
  const userId = await requireUserId();
  await db.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  });
}
