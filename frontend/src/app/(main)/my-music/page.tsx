import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LibraryIcon } from "lucide-react";
import { getMySongs } from "~/actions/song";
import { DashboardPageHeader } from "~/components/layout/dashboard-page-header";
import { MyMusicFeed } from "~/components/my-music/my-music-feed";
import { auth } from "~/lib/auth";

export default async function MyMusicPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const initialPage = await getMySongs();

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col p-4 sm:p-6 lg:p-8">
      <DashboardPageHeader
        eyebrow="Your Melodyc library"
        title="My music"
        description="Listen to every song you have created, published or private."
        icon={LibraryIcon}
      />
      <MyMusicFeed initialPage={initialPage} />
    </div>
  );
}
