import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  HeadphonesIcon,
  HeartIcon,
  Music2Icon,
  RadioIcon,
  SparklesIcon,
  UsersIcon,
  UserPlusIcon,
  UserRoundCheckIcon,
} from "lucide-react";
import { getAnalytics } from "~/actions/analytics";
import { AnalyticsChart } from "~/components/analytics/analytics-chart";
import { DashboardPageHeader } from "~/components/layout/dashboard-page-header";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { auth } from "~/lib/auth";

const numberFormatter = new Intl.NumberFormat("en-US");

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

export default async function AnalyticsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/sign-in");

  const analytics = await getAnalytics();
  const { totals } = analytics;

  const cards = [
    {
      label: "Songs generated",
      value: totals.generated,
      icon: Music2Icon,
      tone: "bg-primary/15 text-primary",
    },
    {
      label: "Published songs",
      value: totals.published,
      icon: RadioIcon,
      tone: "bg-secondary/30 text-foreground",
    },
    {
      label: "Total likes",
      value: totals.likes,
      icon: HeartIcon,
      tone: "bg-pink-500/15 text-pink-600 dark:text-pink-300",
    },
    {
      label: "Total listens",
      value: totals.listens,
      icon: HeadphonesIcon,
      tone: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
    },
  ];

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col p-4 sm:p-6 lg:p-8">
      <DashboardPageHeader
        eyebrow="Your Melodyc insights"
        title="Analytics"
        description="See how your music is growing and how listeners are engaging with it."
        icon={SparklesIcon}
      />

      <div className="grid gap-4 py-8 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="gap-4 py-5">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">{card.label}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight">
                  {formatNumber(card.value)}
                </p>
              </div>
              <span
                className={`flex size-11 items-center justify-center rounded-xl ${card.tone}`}
              >
                <card.icon className="size-5" aria-hidden="true" />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 pb-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.75fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Creation activity</CardTitle>
            <p className="text-muted-foreground text-sm">
              Your generated and published songs over time.
            </p>
          </CardHeader>
          <CardContent>
            <AnalyticsChart data={analytics.activity} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Community</CardTitle>
            <p className="text-muted-foreground text-sm">
              Your audience at a glance.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <CommunityRow
              icon={UsersIcon}
              label="Followers"
              value={totals.followers}
            />
            <CommunityRow
              icon={UserRoundCheckIcon}
              label="Following"
              value={totals.following}
            />
            <CommunityRow
              icon={UserPlusIcon}
              label="New followers (14 days)"
              value={totals.newFollowers}
            />
            <CommunityRow
              icon={UsersIcon}
              label="New following (14 days)"
              value={totals.newFollowing}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CommunityRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UsersIcon;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="bg-muted text-primary flex size-9 items-center justify-center rounded-lg">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span className="text-sm">{label}</span>
      </div>
      <span className="font-semibold">{formatNumber(value)}</span>
    </div>
  );
}
