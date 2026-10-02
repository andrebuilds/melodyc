"use client";

import {
  BellIcon,
  CheckCheck,
  CoinsIcon,
  HeartIcon,
  Loader2,
  MusicIcon,
  PlayIcon,
  UserPlusIcon,
  XCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  getInAppNotifications,
  markAllNotificationsRead,
} from "~/actions/in-app-notifications";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

type NotificationsData = Awaited<ReturnType<typeof getInAppNotifications>>;
type NotificationItem = NotificationsData["notifications"][number];

const POLL_INTERVAL_MS = 30_000;

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

function describe(notification: NotificationItem) {
  const actor = notification.actor?.name ?? "Someone";
  const song = notification.song?.title ?? "your song";

  switch (notification.type) {
    case "like":
      return { text: `${actor} liked "${song}"`, href: "/my-music", icon: HeartIcon };
    case "follow":
      return {
        text: `${actor} started following you`,
        href: `/user/${notification.actor?.username ?? notification.actor?.id ?? ""}`,
        icon: UserPlusIcon,
      };
    case "listen_milestone":
      return {
        text: `"${song}" reached ${notification.value?.toLocaleString() ?? ""} listens`,
        href: "/my-music",
        icon: PlayIcon,
      };
    case "song_ready":
      return { text: `"${song}" is ready to listen`, href: "/my-music", icon: MusicIcon };
    case "song_failed":
      return {
        text: `"${song}" could not be generated. No credits were used.`,
        href: "/create",
        icon: XCircleIcon,
      };
    case "credits_added":
      return {
        text: `${notification.value ?? ""} credits were added to your account`,
        href: "/billing",
        icon: CoinsIcon,
      };
    default:
      return { text: "New activity on your account", href: "/discover", icon: BellIcon };
  }
}

export function NotificationsBell() {
  const [data, setData] = useState<NotificationsData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadAtOpen, setUnreadAtOpen] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    try {
      setData(await getInAppNotifications());
    } catch {
      // Polling failures are retried on the next interval.
    }
  }, []);

  useEffect(() => {
    void load();
    const intervalId = window.setInterval(() => void load(), POLL_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [load]);

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    if (!open || !data || data.unreadCount === 0) return;

    setUnreadAtOpen(
      new Set(data.notifications.filter((n) => !n.readAt).map((n) => n.id)),
    );
    setData({ ...data, unreadCount: 0 });
    await markAllNotificationsRead();
  };

  const unreadCount = data?.unreadCount ?? 0;

  return (
    <DropdownMenu open={isOpen} onOpenChange={(open) => void handleOpenChange(open)}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-9"
          aria-label={
            unreadCount > 0
              ? `Notifications, ${unreadCount} unread`
              : "Notifications"
          }
        >
          <BellIcon className="size-4" />
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 sm:w-96">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          {unreadAtOpen.size > 0 && (
            <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
              <CheckCheck className="size-3.5" /> All caught up
            </span>
          )}
        </div>
        <div className="max-h-[26rem] overflow-y-auto">
          {!data ? (
            <div className="flex justify-center py-10">
              <Loader2 className="text-muted-foreground size-5 animate-spin" />
            </div>
          ) : data.notifications.length === 0 ? (
            <p className="text-muted-foreground px-4 py-10 text-center text-sm">
              No notifications yet. Likes, followers, listens, and song updates
              will appear here.
            </p>
          ) : (
            <ul className="divide-border/60 divide-y">
              {data.notifications.map((notification) => {
                const { text, href, icon: Icon } = describe(notification);
                const isNew = unreadAtOpen.has(notification.id);
                return (
                  <li key={notification.id}>
                    <Link
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "hover:bg-muted/60 flex items-start gap-3 px-4 py-3 transition-colors",
                        isNew && "bg-primary/5",
                      )}
                    >
                      <span className="bg-primary/15 text-primary flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full">
                        {notification.actor?.image ? (
                          <img
                            src={notification.actor.image}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : (
                          <Icon className="size-4" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm leading-5">{text}</span>
                        <span className="text-muted-foreground mt-0.5 block text-xs">
                          {timeAgo(notification.createdAt)}
                        </span>
                      </span>
                      {isNew && (
                        <span className="bg-primary mt-1.5 size-2 shrink-0 rounded-full" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
