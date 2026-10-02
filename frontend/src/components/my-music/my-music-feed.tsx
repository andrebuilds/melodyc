"use client";

import { Music, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getMySongs } from "~/actions/song";
import { SongCard } from "~/components/home/song-card";
import { Button } from "~/components/ui/button";

type MyMusicPage = Awaited<ReturnType<typeof getMySongs>>;
type MyMusicSong = MyMusicPage["songs"][number];

export function MyMusicFeed({ initialPage }: { initialPage: MyMusicPage }) {
  const [songs, setSongs] = useState<MyMusicSong[]>(initialPage.songs);
  const [searchQuery, setSearchQuery] = useState("");
  const [nextCursor, setNextCursor] = useState(initialPage.nextCursor);
  const [hasMore, setHasMore] = useState(initialPage.hasMore);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSongs(initialPage.songs);
    setNextCursor(initialPage.nextCursor);
    setHasMore(initialPage.hasMore);
  }, [initialPage]);

  const stateRef = useRef({ hasMore, isLoading, nextCursor });
  useEffect(() => {
    stateRef.current = { hasMore, isLoading, nextCursor };
  }, [hasMore, isLoading, nextCursor]);

  useEffect(() => {
    const loadMore = async () => {
      const current = stateRef.current;
      if (!current.hasMore || current.isLoading || !current.nextCursor) return;

      stateRef.current = { ...current, isLoading: true };
      setIsLoading(true);
      try {
        const nextPage = await getMySongs(current.nextCursor);
        setSongs((currentSongs) => [...currentSongs, ...nextPage.songs]);
        setNextCursor(nextPage.nextCursor);
        setHasMore(nextPage.hasMore);
      } finally {
        stateRef.current = { ...stateRef.current, isLoading: false };
        setIsLoading(false);
      }
    };

    const loadMoreElement = loadMoreRef.current;
    if (!loadMoreElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore();
      },
      { rootMargin: "400px" },
    );

    observer.observe(loadMoreElement);
    return () => observer.disconnect();
  }, []);

  const query = searchQuery.trim().toLowerCase();
  const filteredSongs = query
    ? songs.filter((song) =>
        [
          song.title,
          song.prompt,
          ...song.categories.map((category) => category.name),
        ].some((value) => value?.toLowerCase().includes(query)),
      )
    : songs;

  if (songs.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <Music className="text-muted-foreground h-20 w-20" />
        <h2 className="mt-4 text-2xl font-bold tracking-tight">
          No music yet
        </h2>
        <p className="text-muted-foreground mt-2">
          Your generated songs will appear here.
        </p>
        <Button asChild className="mt-6">
          <Link href="/create">Create your first song</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-8">
      <div className="flex justify-end">
        <div className="relative w-full sm:max-w-xs">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search your music..."
            aria-label="Search your songs by title, prompt, or category"
            className="border-input bg-background placeholder:text-muted-foreground focus:ring-ring h-10 w-full rounded-md border py-2 pr-3 pl-9 text-sm outline-none focus:ring-2"
          />
        </div>
      </div>

      {filteredSongs.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center text-center">
          <Search className="text-muted-foreground h-12 w-12" />
          <h2 className="mt-4 text-xl font-semibold">No songs found</h2>
          <p className="text-muted-foreground mt-2">
            Try a different title, prompt, or category.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredSongs.map((song) => (
            <SongCard key={song.id} song={song} showVisibility manageable />
          ))}
        </div>
      )}

      <div
        ref={loadMoreRef}
        className="flex min-h-16 items-center justify-center"
      >
        {isLoading && (
          <span className="text-muted-foreground text-sm">
            Loading more songs...
          </span>
        )}
      </div>
    </div>
  );
}
