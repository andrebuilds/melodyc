"use client";

import { Loader2, UserCheck, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { getFollowList, toggleFollow } from "~/actions/follow";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

type FollowListType = "followers" | "following";
type FollowUser = Awaited<ReturnType<typeof getFollowList>>[number];

export function FollowControls({
  userId,
  isOwnProfile,
  initialIsFollowing,
  initialFollowersCount,
  followingCount,
}: {
  userId: string;
  isOwnProfile: boolean;
  initialIsFollowing: boolean;
  initialFollowersCount: number;
  followingCount: number;
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [isPending, setIsPending] = useState(false);
  const [openList, setOpenList] = useState<FollowListType | null>(null);
  const [listUsers, setListUsers] = useState<FollowUser[] | null>(null);

  const handleToggle = async () => {
    setIsPending(true);
    setIsFollowing(!isFollowing);
    setFollowersCount((count) => count + (isFollowing ? -1 : 1));
    try {
      const result = await toggleFollow(userId);
      setIsFollowing(result.isFollowing);
      setFollowersCount(result.followersCount);
    } catch {
      setIsFollowing(isFollowing);
      setFollowersCount(followersCount);
      toast.error("Unable to update follow. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const openFollowList = async (type: FollowListType) => {
    setOpenList(type);
    setListUsers(null);
    try {
      setListUsers(await getFollowList(userId, type));
    } catch {
      setListUsers([]);
      toast.error("Unable to load the list.");
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => void openFollowList("followers")}
          className="text-sm hover:underline"
        >
          <span className="font-semibold tabular-nums">{followersCount}</span>{" "}
          <span className="text-muted-foreground">
            {followersCount === 1 ? "follower" : "followers"}
          </span>
        </button>
        <button
          type="button"
          onClick={() => void openFollowList("following")}
          className="text-sm hover:underline"
        >
          <span className="font-semibold tabular-nums">{followingCount}</span>{" "}
          <span className="text-muted-foreground">following</span>
        </button>
        {!isOwnProfile && (
          <Button
            size="sm"
            variant={isFollowing ? "outline" : "default"}
            disabled={isPending}
            onClick={() => void handleToggle()}
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : isFollowing ? (
              <UserCheck />
            ) : (
              <UserPlus />
            )}
            {isFollowing ? "Following" : "Follow"}
          </Button>
        )}
      </div>

      <Dialog
        open={openList !== null}
        onOpenChange={(open) => !open && setOpenList(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {openList === "followers" ? "Followers" : "Following"}
            </DialogTitle>
            <DialogDescription>
              {openList === "followers"
                ? "People who follow this creator."
                : "Creators this person follows."}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {listUsers === null ? (
              <div className="flex justify-center py-8">
                <Loader2 className="text-muted-foreground size-6 animate-spin" />
              </div>
            ) : listUsers.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center text-sm">
                No one here yet.
              </p>
            ) : (
              <ul className="divide-border/60 divide-y">
                {listUsers.map((user) => (
                  <li key={user.id}>
                    <Link
                      href={`/user/${user.username ?? user.id}`}
                      onClick={() => setOpenList(null)}
                      className="hover:bg-muted/50 flex items-center gap-3 rounded-md px-2 py-2.5"
                    >
                      <span className="bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-semibold">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : (
                          user.name.slice(0, 1).toUpperCase()
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {user.name}
                        </span>
                        {user.username && (
                          <span className="text-muted-foreground block truncate text-xs">
                            @{user.username}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
