import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Heart, Music } from "lucide-react";
import { getPresignedUrl } from "~/actions/generation";
import { SongCard } from "~/components/home/song-card";
import { DashboardPageHeader } from "~/components/layout/dashboard-page-header";
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
    select: { name: true },
  });

  return {
    title: user ? `${user.name} | Melodyc` : "User profile | Melodyc",
  };
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lookup = id.startsWith("@") ? id.slice(1) : id;
  const user = await db.user.findFirst({
    where: { OR: [{ id: lookup }, { username: lookup }] },
    select: {
      id: true,
      name: true,
      image: true,
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
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-8 p-4 sm:p-6 lg:p-8">
      <DashboardPageHeader
        eyebrow="Melodyc creator"
        title={user.name}
        description="Public profile and published tracks."
        icon={Music}
      />

      <div className="flex flex-wrap items-center gap-4 border-y py-5">
        <div className="bg-muted flex size-16 items-center justify-center overflow-hidden rounded-full text-2xl font-semibold">
          {user.image ? (
            <img src={user.image} alt="" className="size-full object-cover" />
          ) : (
            user.name.slice(0, 1).toUpperCase()
          )}
        </div>
        <div>
          <p className="text-lg font-semibold">{user.name}</p>
          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <span>{songs.length} published songs</span>
            <span className="inline-flex items-center gap-1">
              <Heart className="size-4" />
              {likesReceived} likes received
            </span>
          </div>
        </div>
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
