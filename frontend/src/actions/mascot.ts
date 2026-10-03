"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "~/lib/auth";
import { isMascotId } from "~/lib/mascots";
import { db } from "~/server/db";

export async function updateMascot(mascot: string | null) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("You must be signed in.");
  if (mascot !== null && !isMascotId(mascot)) throw new Error("Invalid mascot.");

  await db.user.update({
    where: { id: session.user.id },
    data: { mascot },
  });

  revalidatePath("/", "layout");
}
