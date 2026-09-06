import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPublishedSongs } from "~/actions/song";
import { HomeFeed } from "~/components/home/home-feed";
import { auth } from "~/lib/auth";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const initialPage = await getPublishedSongs();

  return <HomeFeed initialPage={initialPage} />;
}
