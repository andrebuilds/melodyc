"use client";

import {
  AccountSettingsCards,
  SecuritySettingsCards,
} from "@daveyplate/better-auth-ui";
import {
  ChevronRightIcon,
  LockKeyholeIcon,
  ShieldCheckIcon,
  UserRoundIcon,
} from "lucide-react";
import Link from "next/link";
import { DashboardPageHeader } from "~/components/layout/dashboard-page-header";
import { cn } from "~/lib/utils";

const navigation = [
  {
    pathname: "settings",
    href: "/account/settings",
    label: "Account",
    description: "Profile and personal details",
    icon: UserRoundIcon,
  },
  {
    pathname: "security",
    href: "/account/security",
    label: "Security",
    description: "Password and active sessions",
    icon: ShieldCheckIcon,
  },
] as const;

const cardClassNames = {
  base: "gap-0 overflow-hidden rounded-md border-border/70 bg-card py-0 shadow-sm",
  header: "border-b border-border/60 bg-transparent px-5 py-3 sm:px-6",
  content: "px-5 py-5 sm:px-6",
  footer:
    "border-t border-border/60 bg-transparent px-5 py-4 sm:px-6 [&_button]:min-w-24",
  title: "text-base font-bold text-foreground",
  description: "mt-1 leading-6 text-muted-foreground",
  instructions: "text-xs leading-5 text-muted-foreground",
  input: "bg-background",
  cell: "rounded-md border-border/60 bg-background/70 shadow-none",
  icon: "text-primary",
  primaryButton: "shadow-xs",
  destructiveButton: "shadow-none",
};

function AccountSettingsView({ pathname }: { pathname: string }) {
  const isSecurity = pathname === "security";

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <DashboardPageHeader
        eyebrow="Your Melodyc account"
        title={isSecurity ? "Security" : "Account settings"}
        description={
          isSecurity
            ? "Control your password, connected providers, and active sessions."
            : "Keep your profile and personal information up to date."
        }
        icon={isSecurity ? ShieldCheckIcon : UserRoundIcon}
      />

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <nav
          className="grid gap-2 sm:grid-cols-2 lg:sticky lg:top-20 lg:grid-cols-1"
          aria-label="Account settings"
        >
          <p className="mb-1 hidden px-3 text-xs font-bold text-muted-foreground uppercase lg:block">
            Settings
          </p>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.pathname;

            return (
              <Link
                key={item.pathname}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex min-h-16 items-center gap-3 rounded-md border px-3 py-2.5 transition-colors",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-card hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-md",
                    isActive
                      ? "bg-primary-foreground/15"
                      : "bg-muted text-foreground group-hover:bg-accent",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">{item.label}</span>
                  <span
                    className={cn(
                      "mt-0.5 hidden truncate text-xs sm:block",
                      isActive
                        ? "text-primary-foreground/75"
                        : "text-muted-foreground",
                    )}
                  >
                    {item.description}
                  </span>
                </span>
                <ChevronRightIcon
                  className={cn(
                    "size-4 shrink-0",
                    isActive ? "opacity-80" : "opacity-35",
                  )}
                  aria-hidden="true"
                />
              </Link>
            );
          })}

          <div className="mt-4 hidden rounded-md border bg-muted/30 p-4 lg:block">
            <LockKeyholeIcon className="size-4 text-primary" aria-hidden="true" />
            <p className="mt-3 text-sm font-semibold">Private by default</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Your account data and security controls are only visible to you.
            </p>
          </div>
        </nav>

        <section className="min-w-0" aria-label={isSecurity ? "Security settings" : "Account settings"}>
          {isSecurity ? (
            <SecuritySettingsCards classNames={{ cards: "gap-5", card: cardClassNames }} />
          ) : (
            <AccountSettingsCards classNames={{ cards: "gap-5", card: cardClassNames }} />
          )}
        </section>
      </div>
    </div>
  );
}

export { AccountSettingsView };