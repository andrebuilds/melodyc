import Link from "next/link";
import {
  AwardIcon,
  CalendarIcon,
  HeadphonesIcon,
  HeartIcon,
  MusicIcon,
  PercentIcon,
  RadioIcon,
  SparklesIcon,
  TagsIcon,
  TrophyIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";
import { getAnalytics } from "~/actions/analytics";
import { AnalyticsOverview } from "~/components/analytics/analytics-overview";
import { DashboardPageHeader } from "~/components/layout/dashboard-page-header";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ANALYTICS_RANGES, parseAnalyticsRange } from "~/lib/analytics";
import { cn } from "~/lib/utils";

const numberFormatter = new Intl.NumberFormat("en-US");
const compactFormatter = new Intl.NumberFormat("en-US", { notation: "compact" });
const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string | string[] }>;
}) {
  const { range: rawRange } = await searchParams;
  const analytics = await getAnalytics(parseAnalyticsRange(rawRange));
  const { lifetime } = analytics;

  const lifetimeStats: { label: string; value: string; icon: LucideIcon }[] = [
    { label: "Total listens", value: compactFormatter.format(lifetime.listens), icon: HeadphonesIcon },
    { label: "Total likes", value: compactFormatter.format(lifetime.likes), icon: HeartIcon },
    {
      label: "Engagement rate",
      value: percentFormatter.format(lifetime.engagementRate),
      icon: PercentIcon,
    },
    {
      label: "Published songs",
      value: `${numberFormatter.format(lifetime.published)} / ${numberFormatter.format(lifetime.songs)}`,
      icon: RadioIcon,
    },
  ];

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <DashboardPageHeader
        eyebrow="Your Melodyc insights"
        title="Analytics"
        description="See how your music is growing and how listeners are engaging with it."
        icon={SparklesIcon}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">
          Activity for the last {analytics.range} days
        </p>
        <nav
          aria-label="Time range"
          className="bg-muted inline-flex rounded-full border p-1"
        >
          {ANALYTICS_RANGES.map((range) => (
            <Link
              key={range}
              href={`/analytics?range=${range}`}
              scroll={false}
              aria-current={range === analytics.range ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                range === analytics.range
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {range}D
            </Link>
          ))}
        </nav>
      </div>

      <AnalyticsOverview
        days={analytics.days}
        summary={analytics.summary}
        range={analytics.range}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {lifetimeStats.map((stat) => (
          <Card key={stat.label} className="gap-0 py-4">
            <CardContent className="flex items-center gap-3 px-4">
              <span className="bg-muted text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                <stat.icon className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-muted-foreground truncate text-xs">{stat.label}</p>
                <p className="text-xl font-bold tracking-tight">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 pb-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrophyIcon className="text-primary size-4" aria-hidden="true" />
              Top songs
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Your most listened songs of all time.
            </p>
          </CardHeader>
          <CardContent>
            {analytics.topSongs.length > 0 ? (
              <ol className="divide-y">
                {analytics.topSongs.map((song, index) => {
                  const engagement = song.listens > 0 ? song.likes / song.listens : 0;
                  return (
                    <li key={song.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <span className="text-muted-foreground w-5 text-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <div className="bg-muted flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md">
                        {song.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={song.thumbnailUrl}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : (
                          <MusicIcon className="text-muted-foreground size-5" aria-hidden="true" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{song.title}</p>
                        <p className="text-muted-foreground mt-0.5 text-xs sm:hidden">
                          {compactFormatter.format(song.listens)} listens ·{" "}
                          {compactFormatter.format(song.likes)} likes
                        </p>
                        <Badge variant="outline" className="mt-1 text-[10px] max-sm:hidden">
                          {song.published ? "Public" : "Private"}
                        </Badge>
                      </div>
                      <dl className="hidden grid-cols-3 gap-4 text-right text-sm sm:grid">
                        <SongStat label="Listens" value={compactFormatter.format(song.listens)} />
                        <SongStat label="Likes" value={compactFormatter.format(song.likes)} />
                        <SongStat label="Engagement" value={percentFormatter.format(engagement)} />
                      </dl>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <EmptyState text="Create your first song to see how it performs." />
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="text-primary size-4" aria-hidden="true" />
                Audience
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-3 text-center">
              <AudienceStat label="Followers" value={lifetime.followers} />
              <AudienceStat label="Following" value={lifetime.following} />
              <AudienceStat
                label={`New (${analytics.range}D)`}
                value={analytics.summary.followers.current}
                highlight
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TagsIcon className="text-primary size-4" aria-hidden="true" />
                Top categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics.topCategories.length > 0 ? (
                analytics.topCategories.map((category) => (
                  <div key={category.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="truncate capitalize">{category.name}</span>
                      <span className="text-muted-foreground">
                        {numberFormatter.format(category.count)}
                      </span>
                    </div>
                    <div className="bg-muted h-2 overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{ width: `${Math.max(4, category.share * 100)}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState text="Categories appear once your songs are generated." />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AwardIcon className="text-primary size-4" aria-hidden="true" />
                Highlights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {analytics.bestDay && (
                <div className="flex items-center gap-3">
                  <CalendarIcon className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
                  <p>
                    Best day: <span className="font-semibold">{analytics.bestDay.label}</span>, with{" "}
                    {numberFormatter.format(analytics.bestDay.likes)}{" "}
                    {analytics.bestDay.likes === 1 ? "like" : "likes"}
                  </p>
                </div>
              )}
              {analytics.milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-3">
                  <HeadphonesIcon className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
                  <p className="min-w-0">
                    <span className="font-semibold">{milestone.songTitle}</span> reached{" "}
                    {numberFormatter.format(milestone.listens)} listens
                    <span className="text-muted-foreground"> · {milestone.date}</span>
                  </p>
                </div>
              ))}
              {!analytics.bestDay && analytics.milestones.length === 0 && (
                <EmptyState text="Likes and listen milestones from this period will show up here." />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SongStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground text-[11px]">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}

function AudienceStat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="bg-muted/50 rounded-lg p-3">
      <p className={cn("text-xl font-bold", highlight && "text-primary")}>
        {highlight && value > 0 ? "+" : ""}
        {numberFormatter.format(value)}
      </p>
      <p className="text-muted-foreground text-xs">{label}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-muted-foreground py-6 text-center text-sm">{text}</p>;
}
