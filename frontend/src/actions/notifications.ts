"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NOTIFICATION_TYPES, type NotificationType } from "~/lib/email";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

export async function updateNotificationPreference(
  type: NotificationType,
  enabled: boolean,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  if (!NOTIFICATION_TYPES.includes(type)) throw new Error("Invalid type.");

  await db.notificationPreference.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, [type]: enabled },
    update: { [type]: enabled },
  });
}
