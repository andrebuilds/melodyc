"use server";

import { headers } from "next/headers";
import { CoinsIcon } from "lucide-react";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

export async function Credits() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  const user = await db.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { credits: true },
  });

  return (
    <div className="flex items-center gap-2" title={`${user.credits} credits available`}>
      <span className="flex size-6 items-center justify-center rounded-md bg-primary/15 text-primary">
        <CoinsIcon className="size-3.5" aria-hidden="true" />
      </span>
      <span className="flex items-baseline gap-1">
        <span className="font-bold tabular-nums">{user.credits}</span>
        <span className="hidden text-muted-foreground sm:inline">credits</span>
      </span>
    </div>
  );
}
