"use client";

import {
  AccountSettingsCards,
  SecuritySettingsCards,
} from "@daveyplate/better-auth-ui";
import {
  BellIcon,
  ChevronRightIcon,
  LockKeyholeIcon,
  ShieldCheckIcon,
  UserRoundIcon,
} from "lucide-react";
import Link from "next/link";
import { DashboardPageHeader } from "~/components/layout/dashboard-page-header";
import { UsernameSettingsCard } from "~/components/settings/username-settings-card";
import { AvatarSettingsCard } from "~/components/settings/avatar-settings-card";
import { MascotSettingsCard } from "~/components/settings/mascot-settings-card";
import { NotificationSettingsCard } from "~/components/settings/notification-settings-card";
import { settingsCardClassNames as cardClassNames } from "~/components/settings/settings-card-styles";
import type { NotificationType } from "~/lib/email";
import { cn } from "~/lib/utils";

const navigation = [
  {
    pathname: "settings",
    href: "/account/settings",
    label: "Account",
    description: "Profile and username",
    icon: UserRoundIcon,
  },
  {
    pathname: "security",
    href: "/account/security",
    label: "Security",
    description: "Password and active sessions",
    icon: ShieldCheckIcon,
  },
  {
    pathname: "notifications",
    href: "/account/notifications",
    label: "Notifications",
    description: "Email notification preferences",
    icon: BellIcon,
  },
] as const;

function AccountSettingsView({
  pathname,
  initialUsername,
  initialMascot,
  initialNotificationSettings,
}: {
  pathname: string;
  initialUsername: string | null;
  initialMascot: string | null;
  initialNotificationSettings: Record<NotificationType, boolean>;
}) {
  const isSecurity = pathname === "security";
  const isNotifications = pathname === "notifications";
  const activeView = navigation.find((item) => item.pathname === pathname);

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <DashboardPageHeader
        eyebrow="Your Melodyc account"
        title={
          isSecurity
            ? "Security"
            : isNotifications
              ? "Notifications"
              : "Account settings"
        }
        description={
          isSecurity
            ? "Control your password, connected providers, and active sessions."
            : isNotifications
              ? "Choose which emails Melodyc sends you."
              : "Keep your profile and personal information up to date."
        }
        icon={activeView?.icon ?? UserRoundIcon}
      />

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <nav
          className="grid gap-2 sm:grid-cols-2 lg:sticky lg:top-20 lg:grid-cols-1"
          aria-label="Account settings"
        >
          <p className="text-muted-foreground mb-1 hidden px-3 text-xs font-bold uppercase lg:block">
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
                    : "text-muted-foreground hover:border-border hover:bg-card hover:text-foreground border-transparent",
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

          <div className="bg-muted/30 mt-4 hidden rounded-md border p-4 lg:block">
            <LockKeyholeIcon
              className="text-primary size-4"
              aria-hidden="true"
            />
            <p className="mt-3 text-sm font-semibold">Private by default</p>
            <p className="text-muted-foreground mt-1 text-xs leading-5">
              Your account data and security controls are only visible to you.
            </p>
          </div>
        </nav>

        <section
          className="min-w-0"
          aria-label={`${activeView?.label ?? "Account"} settings`}
        >
          {isSecurity ? (
            <SecuritySettingsCards
              classNames={{ cards: "gap-5", card: cardClassNames }}
            />
          ) : isNotifications ? (
            <NotificationSettingsCard
              initialSettings={initialNotificationSettings}
            />
          ) : (
            <>
              <AvatarSettingsCard />
              <AccountSettingsCards
                classNames={{ cards: "gap-5", card: cardClassNames }}
              />
              <UsernameSettingsCard initialUsername={initialUsername} />
              <MascotSettingsCard initialMascot={initialMascot} />
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export { AccountSettingsView };
