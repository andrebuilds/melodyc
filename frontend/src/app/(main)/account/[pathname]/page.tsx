import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { AccountSettingsView } from "~/components/settings/account-settings-view";
import { auth } from "~/lib/auth";
import { getNotificationSettings } from "~/lib/notifications";
import { db } from "~/server/db";

const accountViews = new Set(["settings", "security", "notifications"]);

export default async function AccountPage({
  params,
}: {
  params: Promise<{ pathname: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/auth/sign-in");

  const { pathname } = await params;

  if (!accountViews.has(pathname)) notFound();

  const [user, notificationSettings] = await Promise.all([
    db.user.findUniqueOrThrow({
      where: { id: session.user.id },
      select: { username: true, mascot: true },
    }),
    getNotificationSettings(session.user.id),
  ]);

  return (
    <AccountSettingsView
      pathname={pathname}
      initialUsername={user.username}
      initialMascot={user.mascot}
      initialNotificationSettings={notificationSettings}
    />
  );
}
