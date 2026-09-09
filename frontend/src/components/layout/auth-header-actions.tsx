"use client";

import Link from "next/link";
import { LayoutDashboardIcon, LogInIcon, MusicIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";
import { cn } from "~/lib/utils";

function AuthHeaderActions({ className }: { className?: string }) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div
        aria-hidden="true"
        className={cn("h-9 w-40 animate-pulse rounded-md bg-muted", className)}
      />
    );
  }

  if (session) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button className="col-span-full w-full" asChild>
          <Link href="/discover">
            <LayoutDashboardIcon aria-hidden="true" />
            Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button variant="ghost" asChild>
        <Link href="/auth/sign-in">
          <LogInIcon aria-hidden="true" />
          <span className="hidden sm:inline">Sign in</span>
        </Link>
      </Button>
      <Button asChild>
        <Link href="/auth/sign-up">
          <MusicIcon aria-hidden="true" />
          Create music
        </Link>
      </Button>
    </div>
  );
}

export { AuthHeaderActions };
