import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CompassIcon } from "lucide-react";
import { getPublishedSongs } from "~/actions/song";
import { HomeFeed } from "~/components/home/home-feed";
import { DashboardPageHeader } from "~/components/layout/dashboard-page-header";
import { auth } from "~/lib/auth";

export default async function DiscoverPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const initialPage = await getPublishedSongs();

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col p-4 sm:p-6 lg:p-8">
      <DashboardPageHeader
        eyebrow="Your Melodyc feed"
        title="Discover music"
        description="Explore fresh tracks created by the Melodyc community."
        icon={CompassIcon}
      />
      <HomeFeed initialPage={initialPage} />
    </div>
  );
}