"use client";

import { Music } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getPublishedSongs } from "~/actions/song";
import { SongCard } from "~/components/home/song-card";

type HomePage = Awaited<ReturnType<typeof getPublishedSongs>>;
type HomeSong = HomePage["songs"][number];

export function HomeFeed({ initialPage }: { initialPage: HomePage }) {
  const [songs, setSongs] = useState<HomeSong[]>(initialPage.songs);
  const [nextCursor, setNextCursor] = useState(initialPage.nextCursor);
  const [hasMore, setHasMore] = useState(initialPage.hasMore);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Mirror of state, kept up to date so the observer (created once)
  // can always read fresh values without needing to be recreated.
  const stateRef = useRef({ hasMore, isLoading, nextCursor });
  useEffect(() => {
    stateRef.current = { hasMore, isLoading, nextCursor };
  }, [hasMore, isLoading, nextCursor]);

  useEffect(() => {
    const loadMore = async () => {
      const { hasMore, isLoading, nextCursor } = stateRef.current;
      if (!hasMore || isLoading || !nextCursor) return;

      setIsLoading(true);
      try {
        const nextPage = await getPublishedSongs(nextCursor);
        setSongs((currentSongs) => [...currentSongs, ...nextPage.songs]);
        setNextCursor(nextPage.nextCursor);
        setHasMore(nextPage.hasMore);
      } finally {
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

  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const trendingSongs = songs
    .filter((song) => song.createdAt >= twoDaysAgo)
    .slice(0, 10);
  const trendingSongIds = new Set(trendingSongs.map((song) => song.id));
  const categorizedSongs = songs
    .filter(
      (song) => !trendingSongIds.has(song.id) && song.categories.length > 0,
    )
    .reduce(
      (categories, song) => {
        const primaryCategory = song.categories[0];
        if (primaryCategory) {
          categories[primaryCategory.name] ??= [];
          if (categories[primaryCategory.name]!.length < 10) {
            categories[primaryCategory.name]!.push(song);
          }
        }
        return categories;
      },
      {} as Record<string, HomeSong[]>,
    );

  if (songs.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 text-center">
        <Music className="text-muted-foreground h-20 w-20" />
        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          No Music Here
        </h1>
        <p className="text-muted-foreground mt-2">
          There are no published songs available right now. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold tracking-tight">Discover Music</h1>

      {trendingSongs.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Trending</h2>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {trendingSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      )}

      {Object.entries(categorizedSongs)
        .slice(0, 5)
        .map(([category, categorySongs]) => (
          <div key={category} className="mt-6">
            <h2 className="text-xl font-semibold">{category}</h2>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {categorySongs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </div>
        ))}

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