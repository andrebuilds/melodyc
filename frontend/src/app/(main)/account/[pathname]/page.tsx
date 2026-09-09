import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { AccountSettingsView } from "~/components/settings/account-settings-view";
import { auth } from "~/lib/auth";

const accountViews = new Set(["settings", "security"]);

export default async function AccountPage({
  params,
}: {
  params: Promise<{ pathname: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/auth/sign-in");

  const { pathname } = await params;

  if (!accountViews.has(pathname)) notFound();

  return <AccountSettingsView pathname={pathname} />;
}