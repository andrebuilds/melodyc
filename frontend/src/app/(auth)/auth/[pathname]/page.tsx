import { authViewPaths } from "@daveyplate/better-auth-ui/server";
import { notFound } from "next/navigation";
import { AuthView } from "./view";

const dashboardViews = new Set(["settings", "security", "api-keys"]);

export function generateStaticParams() {
  return Object.values(authViewPaths)
    .filter((pathname) => !dashboardViews.has(pathname))
    .map((pathname) => ({ pathname }));
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ pathname: string }>;
}) {
  const { pathname } = await params;

  if (dashboardViews.has(pathname)) notFound();

  return <AuthView pathname={pathname} />;
}
