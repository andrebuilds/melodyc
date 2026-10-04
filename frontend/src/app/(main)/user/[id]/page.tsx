import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Heart, Music } from "lucide-react";
import { getPresignedUrl } from "~/actions/generation";
import { SongCard } from "~/components/home/song-card";
import { DashboardPageHeader } from "~/components/layout/dashboard-page-header";
import { FollowControls } from "~/components/profile/follow-controls";
import { auth } from "~/lib/auth";
import { isMascotId, mascotLabel, mascotSrc } from "~/lib/mascots";
import { db } from "~/server/db";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const lookup = id.startsWith("@") ? id.slice(1) : id;
  const user = await db.user.findFirst({
    where: { OR: [{ id: lookup }, { username: lookup }] },
    select: { name: true, username: true },
  });

  if (!user) return { title: "User profile | Melodyc" };

  const displayName = user.username
    ? `${user.name} (@${user.username})`
    : user.name;

  return {
    title: `${displayName} | Melodyc`,
  };
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lookup = id.startsWith("@") ? id.slice(1) : id;
  const session = await auth.api.getSession({ headers: await headers() });
  const user = await db.user.findFirst({
    where: { OR: [{ id: lookup }, { username: lookup }] },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      mascot: true,
      _count: { select: { followers: true, following: true } },
      followers: session
        ? {
            where: { followerId: session.user.id },
            select: { followerId: true },
          }
        : false,
      songs: {
        where: { published: true },
        include: {
          user: { select: { name: true, username: true } },
          _count: { select: { likes: true } },
          categories: true,
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      },
    },
  });

  if (!user) notFound();

  const songs = await Promise.all(
    user.songs.map(async (song) => ({
      ...song,
      thumbnailUrl: song.thumbnailS3Key
        ? await getPresignedUrl(song.thumbnailS3Key)
        : null,
    })),
  );
  const likesReceived = songs.reduce(
    (total, song) => total + song._count.likes,
    0,
  );

  return (
    <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col gap-8 p-4 pb-8 sm:p-6 sm:pb-10 lg:p-8 lg:pb-12">
      <DashboardPageHeader
        eyebrow="Melodyc creator"
        title={user.name}
        description="Public profile and published tracks."
        icon={Music}
      />

      <div className="flex flex-col gap-5 border-y py-5 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex min-w-0 flex-col items-center gap-3 text-center sm:flex-row sm:gap-4 sm:text-left">
          <div className="bg-muted flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full text-2xl font-semibold">
            {user.image ? (
              <img src={user.image} alt="" className="size-full object-cover" />
            ) : (
              user.name.slice(0, 1).toUpperCase()
            )}
          </div>
          <div className="flex min-w-0 flex-col items-center space-y-2 sm:items-start">
            <div>
              <p className="truncate text-lg leading-tight font-semibold">
                {user.name}
              </p>
              {user.username && (
                <p className="text-muted-foreground truncate text-sm">
                  @{user.username}
                </p>
              )}
            </div>
            <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm sm:justify-start">
              <span>{songs.length} published songs</span>
              <span className="inline-flex items-center gap-1">
                <Heart className="size-4" />
                {likesReceived} likes received
              </span>
            </div>
            <FollowControls
              userId={user.id}
              isOwnProfile={session?.user.id === user.id}
              initialIsFollowing={(user.followers ?? []).length > 0}
              initialFollowersCount={user._count.followers}
              followingCount={user._count.following}
            />
          </div>
        </div>
        {user.mascot && isMascotId(user.mascot) && (
          <div className="bg-muted/40 flex flex-col items-center gap-1.5 self-center rounded-xl px-6 py-3 sm:ml-auto sm:bg-transparent sm:p-0">
            <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
              {session?.user.id === user.id ? "My mascot" : "Mascot"}
            </p>
            <img
              src={mascotSrc(user.mascot)}
              alt={mascotLabel(user.mascot)}
              className="size-24 object-contain"
            />
          </div>
        )}
      </div>

      {songs.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground flex min-h-48 items-center justify-center rounded-lg border border-dashed text-sm">
          This creator has not published any songs yet.
        </div>
      )}
    </div>
  );
}
