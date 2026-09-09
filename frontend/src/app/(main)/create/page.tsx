import { Loader2, WandSparklesIcon } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SongPanel } from "~/components/create/song-panel";
import TrackListFetcher from "~/components/create/track-list-fetcher";
import { DashboardPageHeader } from "~/components/layout/dashboard-page-header";
import { auth } from "~/lib/auth";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        <DashboardPageHeader
          eyebrow="Your Melodyc studio"
          title="Create music"
          description="Describe your idea, shape the sound, and generate your next track."
          icon={WandSparklesIcon}
        />
      </div>
      <div className="flex min-h-full flex-col lg:flex-row">
        <SongPanel />
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          <TrackListFetcher />
        </Suspense>
      </div>
    </>
  );
}
