import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  CoinsIcon,
  LifeBuoyIcon,
  MailIcon,
  TrophyIcon,
} from "lucide-react";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";
import { CREDITS_SUPPORT_EMAIL } from "~/lib/credits";
import { DashboardPageHeader } from "~/components/layout/dashboard-page-header";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default async function CreditsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/auth/sign-in");

  const user = await db.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { credits: true },
  });

  return (
    <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
      <DashboardPageHeader
        eyebrow="Free for everyone"
        title="Credits"
        description="Melodyc is free. Credits are used whenever you generate a new song."
        icon={CoinsIcon}
      />

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="rounded-md">
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-md bg-primary/15 text-primary">
              <CoinsIcon className="size-5" aria-hidden="true" />
            </div>
            <CardTitle className="mt-4">Available credits</CardTitle>
            <CardDescription>
              One completed song uses one credit. Failed generations are never
              charged.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black tabular-nums">{user.credits}</p>
          </CardContent>
        </Card>

        <Card className="rounded-md">
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <LifeBuoyIcon className="size-5" aria-hidden="true" />
            </div>
            <CardTitle className="mt-4">Need more credits?</CardTitle>
            <CardDescription>
              Credits cannot be purchased. If you run out, write to the team
              and we will top up your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="border-primary/70 hover:border-primary dark:border-primary/70 dark:hover:border-primary"
              asChild
            >
              <a href={`mailto:${CREDITS_SUPPORT_EMAIL}?subject=Melodyc%20credits%20request`}>
                <MailIcon aria-hidden="true" />
                Contact the team
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="relative mt-10 rounded-md border-dashed">
        <span className="absolute top-0 left-0 -translate-x-2 -translate-y-1/2 rounded-md bg-primary px-3 py-1 text-xs font-bold whitespace-nowrap text-primary-foreground uppercase">
          Coming soon
        </span>
        <CardHeader>
          <div className="flex size-10 items-center justify-center rounded-md bg-primary/15 text-primary">
            <TrophyIcon className="size-5" aria-hidden="true" />
          </div>
          <CardTitle className="mt-4">Earn credits by playing</CardTitle>
          <CardDescription className="leading-6">
            Daily missions, weekly challenges, streaks, and badges will soon let
            you earn new credits just by being part of the community.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
