"use client";

import type { Category, Like, Song } from "@prisma/client";
import { Globe, Heart, Loader2, Lock, Music, Play } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { getPlayUrl } from "~/actions/generation";
import { toggleLikeSong } from "~/actions/song";
import { usePlayerStore } from "~/stores/use-player-store";
import { Badge } from "~/components/ui/badge";
import { SongDownloadMenu } from "~/components/my-music/song-download-menu";
import { SongActionsMenu } from "~/components/my-music/song-actions-menu";

type SongWithRelation = Song & {
  user: { name: string | null; username: string | null };
  _count: {
    likes: number;
  };
  categories: Category[];
  thumbnailUrl?: string | null;
  likes?: Like[];
};

export function SongCard({
  song: initialSong,
  showVisibility = false,
  manageable = false,
}: {
  song: SongWithRelation;
  showVisibility?: boolean;
  manageable?: boolean;
}) {
  const [song, setSong] = useState(initialSong);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setTrack = usePlayerStore((state) => state.setTrack);
  const [isLiked, setIsLiked] = useState(
    song.likes ? song.likes.length > 0 : false,
  );
  const [likesCount, setLikesCount] = useState(song._count.likes);

  const handlePlay = async () => {
    setIsLoading(true);
    const playUrl = await getPlayUrl(song.id);

    setTrack({
      id: song.id,
      title: song.title,
      url: playUrl,
      artwork: song.thumbnailUrl,
      prompt: song.prompt,
      createdByUserName: song.user.name,
      createdByUserId: song.userId,
      createdByUserHandle: song.user.username ?? song.userId,
    });

    setIsLoading(false);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    await toggleLikeSong(song.id);
  };

  if (isDeleted) return null;

  return (
    <div>
      <div onClick={handlePlay} className="relative cursor-pointer">
        {showVisibility && (
          <Badge
            variant="outline"
            className={`bg-background absolute top-0 right-2 z-10 -translate-y-1/2 gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold shadow-sm ${
              song.published
                ? "border-primary/40 text-primary"
                : "border-border text-muted-foreground"
            }`}
          >
            {song.published ? (
              <Globe className="size-3" aria-hidden="true" />
            ) : (
              <Lock className="size-3" aria-hidden="true" />
            )}
            {song.published ? "Public" : "Private"}
          </Badge>
        )}
        <div className="group bg-muted relative aspect-square w-full overflow-hidden rounded-md group-hover:opacity-75">
          {song.thumbnailUrl ? (
            <img
              className="h-full w-full object-cover object-center"
              src={song.thumbnailUrl}
            />
          ) : (
            <div className="bg-muted flex h-full w-full items-center justify-center">
              <Music className="text-muted-foreground h-12 w-12" />
            </div>
          )}

          {/* Loader */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 transition-transform group-hover:scale-105">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              ) : (
                <Play className="h-6 w-6 fill-white text-white" />
              )}
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <h3 className="text-foreground min-w-0 truncate text-sm font-medium">
            {song.title}
          </h3>
          {manageable && (
            <div className="flex shrink-0 items-center">
              <SongDownloadMenu songId={song.id} />
              <SongActionsMenu
                song={song}
                onChange={(changes) =>
                  setSong((current) => ({
                    ...current,
                    published: changes.published,
                    title: changes.title ?? current.title,
                  }))
                }
                onDeleted={() => setIsDeleted(true)}
              />
            </div>
          )}
        </div>

        <Link
          href={`/user/${song.user.username ?? song.userId}`}
          onClick={(event) => event.stopPropagation()}
          className="text-muted-foreground text-xs hover:underline"
        >
          {song.user.name}
        </Link>

        <div className="text-muted-foreground mt-1 flex items-center justify-between text-xs">
          <span>{song.listenCount} listens</span>
          <button
            onClick={handleLike}
            className="flex cursor-pointer items-center gap-1"
          >
            <Heart
              className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
            />
            {likesCount} likes
          </button>
        </div>
      </div>
    </div>
  );
}
