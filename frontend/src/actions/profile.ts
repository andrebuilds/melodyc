"use server";

import { headers } from "next/headers";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

const USERNAME_PATTERN = /^[a-z0-9_]{3,24}$/;

type UsernameResult = {
  error?: string;
  success?: string;
};

export async function updateUsername(
  username: string,
): Promise<UsernameResult> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return { error: "You must be signed in." };

  const normalizedUsername = username.trim().toLowerCase();

  if (!USERNAME_PATTERN.test(normalizedUsername)) {
    return {
      error: "Use 3-24 lowercase letters, numbers, or underscores.",
    };
  }

  const existingUser = await db.user.findFirst({
    where: {
      username: normalizedUsername,
      NOT: { id: session.user.id },
    },
    select: { id: true },
  });

  if (existingUser) return { error: "That username is already taken." };

  await db.user.update({
    where: { id: session.user.id },
    data: { username: normalizedUsername },
  });

  return { success: "Username updated." };
}
