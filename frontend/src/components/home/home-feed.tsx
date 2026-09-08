"use client";

import { Music, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getPublishedSongs } from "~/actions/song";
import { SongCard } from "~/components/home/song-card";

type HomePage = Awaited<ReturnType<typeof getPublishedSongs>>;
type HomeSong = HomePage["songs"][number];

export function HomeFeed({ initialPage }: { initialPage: HomePage }) {
  const [songs, setSongs] = useState<HomeSong[]>(initialPage.songs);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [nextCursor, setNextCursor] = useState(initialPage.nextCursor);
  const [hasMore, setHasMore] = useState(initialPage.hasMore);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const updateSearchQuery = useCallback((query: string) => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query.trim().toLowerCase());
    }, 300);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(
    () => updateSearchQuery(searchQuery),
    [searchQuery, updateSearchQuery],
  );

  // Mirror of state, kept up to date so the observer (created once)
  // can always read fresh values without needing to be recreated.
  const stateRef = useRef({ hasMore, isLoading, nextCursor });
  useEffect(() => {
    stateRef.current = { hasMore, isLoading, nextCursor };
  }, [hasMore, isLoading, nextCursor]);

  useEffect(() => {
    const loadMore = async () => {
      const current = stateRef.current;
      if (!current.hasMore || current.isLoading || !current.nextCursor) return;

      // Lock immediately to prevent overlapping loads before React state/effects update.
      stateRef.current = { ...current, isLoading: true };
      setIsLoading(true);
      try {
        const nextPage = await getPublishedSongs(current.nextCursor);
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

  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const filteredSongs = debouncedQuery
    ? songs.filter((song) => {
        return [
          song.title,
          song.prompt,
          ...song.categories.map((category) => category.name),
        ].some((value) => value?.toLowerCase().includes(debouncedQuery));
      })
    : songs;

  const trendingSongs = filteredSongs
    .filter((song) => song.createdAt >= twoDaysAgo)
    .slice(0, 10);
  const trendingSongIds = new Set(trendingSongs.map((song) => song.id));
  const categorizedSongs = filteredSongs
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Discover Music</h1>
        <div className="relative w-full sm:max-w-xs">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search music..."
            aria-label="Search songs by title, prompt, or category"
            className="border-input bg-background placeholder:text-muted-foreground focus:ring-ring h-10 w-full rounded-md border py-2 pr-3 pl-9 text-sm outline-none focus:ring-2"
          />
        </div>
      </div>

      {filteredSongs.length === 0 && (
        <div className="flex min-h-48 flex-col items-center justify-center text-center">
          <Search className="text-muted-foreground h-12 w-12" />
          <h2 className="mt-4 text-xl font-semibold">No songs found</h2>
          <p className="text-muted-foreground mt-2">
            Try a different title, prompt, or category.
          </p>
        </div>
      )}

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
