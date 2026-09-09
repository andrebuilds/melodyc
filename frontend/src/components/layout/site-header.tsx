"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { MelodycLogo } from "~/components/brand/melodyc-logo";
import { AuthHeaderActions } from "~/components/layout/auth-header-actions";
import { GitHubRepoButton } from "~/components/layout/github-repo-button";
import { MobileNav } from "~/components/layout/mobile-nav";
import { ModeToggle } from "~/components/theme/mode-toggle";
import { Separator } from "~/components/ui/separator";
import { mainNav } from "~/lib/site-config";
import { cn } from "~/lib/utils";

const compactScrollThreshold = 24;

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

function getScrollSnapshot() {
  return window.scrollY > compactScrollThreshold;
}

function getServerScrollSnapshot() {
  return false;
}

function SiteHeader() {
  const isCompact = useSyncExternalStore(
    subscribeToScroll,
    getScrollSnapshot,
    getServerScrollSnapshot,
  );

  return (
    <header className="sticky top-0 z-50 h-16 w-full">
      <div
        className={cn(
          "relative top-0 mx-auto w-full border-b bg-background/85 backdrop-blur-xl motion-reduce:transition-none lg:absolute lg:right-0 lg:left-0 lg:w-auto lg:transition-[top,right,left,border-radius,border-color,box-shadow,background-color] lg:duration-500 lg:ease-[cubic-bezier(0.22,1,0.36,1)]",
          isCompact &&
            "lg:top-3 lg:right-[max(1rem,calc((100vw-72rem)/2))] lg:left-[max(1rem,calc((100vw-72rem)/2))] lg:rounded-md lg:border lg:bg-background/95 lg:shadow-lg",
        )}
      >
        <div
          className={cn(
            "mx-auto flex h-16 w-full max-w-6xl items-center gap-8 px-4 transition-[height,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:px-6",
            isCompact && "lg:h-14 lg:px-5",
          )}
        >
          <Link href="/" aria-label="Melodyc home">
            <MelodycLogo />
          </Link>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            {mainNav.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.75}
                    className="size-3.5 opacity-75 transition-opacity group-hover:opacity-100"
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <GitHubRepoButton className="hidden lg:inline-flex" />
            <Separator
              orientation="vertical"
              className="hidden data-[orientation=vertical]:h-5 lg:block"
            />
            <ModeToggle className="hidden md:inline-flex" />
            <Separator
              orientation="vertical"
              className="hidden data-[orientation=vertical]:h-5 md:block"
            />
            <AuthHeaderActions className="hidden md:flex" />
            <MobileNav items={mainNav} className="md:hidden" />
          </div>
        </div>
      </div>
    </header>
  );
}

export { SiteHeader };
