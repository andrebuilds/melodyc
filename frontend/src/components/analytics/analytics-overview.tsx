"use client";

import { useState } from "react";
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  HeartIcon,
  Music2Icon,
  UserPlusIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";
import type { AnalyticsData } from "~/actions/analytics";
import { AnalyticsChart } from "~/components/analytics/analytics-chart";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";

type MetricId = keyof AnalyticsData["summary"];

const metrics: {
  id: MetricId;
  label: string;
  chartLabel: string;
  icon: LucideIcon;
  colorClass: string;
}[] = [
  {
    id: "likes",
    label: "Likes received",
    chartLabel: "likes",
    icon: HeartIcon,
    colorClass: "text-pink-500",
  },
  {
    id: "followers",
    label: "New followers",
    chartLabel: "new followers",
    icon: UserPlusIcon,
    colorClass: "text-primary",
  },
  {
    id: "totalFollowers",
    label: "Total followers",
    chartLabel: "followers",
    icon: UsersIcon,
    colorClass: "text-sky-500",
  },
  {
    id: "songs",
    label: "Songs created",
    chartLabel: "songs",
    icon: Music2Icon,
    colorClass: "text-amber-500",
  },
];

const numberFormatter = new Intl.NumberFormat("en-US");

function Change({ current, previous }: { current: number; previous: number }) {
  if (current === previous) {
    return <span className="text-muted-foreground text-xs">No change</span>;
  }
  const up = current > previous;
  const Icon = up ? ArrowUpRightIcon : ArrowDownRightIcon;
  const text =
    previous === 0
      ? `+${numberFormatter.format(current)}`
      : `${Math.abs(Math.round(((current - previous) / previous) * 100))}%`;
  return (
    <span
      className={cn(
        "flex items-center gap-0.5 text-xs font-medium",
        up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {text}
    </span>
  );
}

export function AnalyticsOverview({
  days,
  summary,
  range,
}: Pick<AnalyticsData, "days" | "summary" | "range">) {
  const [selected, setSelected] = useState<MetricId>("likes");
  const metric = metrics.find((item) => item.id === selected) ?? metrics[0]!;

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="grid grid-cols-2 border-b lg:grid-cols-4">
        {metrics.map((item) => {
          const value = summary[item.id];
          const isActive = item.id === selected;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item.id)}
              aria-pressed={isActive}
              className={cn(
                "relative flex flex-col gap-2 border-r p-4 text-left transition-colors last:border-r-0 sm:p-5 even:max-lg:border-r-0 max-lg:[&:nth-child(-n+2)]:border-b",
                isActive ? "bg-muted/60" : "hover:bg-muted/30",
              )}
            >
              <span className="text-muted-foreground flex items-center gap-2 text-sm">
                <item.icon className={cn("size-4", item.colorClass)} aria-hidden="true" />
                {item.label}
              </span>
              <span className="text-2xl font-bold tracking-tight sm:text-3xl">
                {numberFormatter.format(value.current)}
              </span>
              <Change current={value.current} previous={value.previous} />
              {isActive && (
                <span
                  className={cn("absolute inset-x-0 bottom-0 h-0.5 bg-current", item.colorClass)}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
      <CardContent className="space-y-3 p-4 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-semibold">{metric.label}</p>
          <p className="text-muted-foreground text-xs">
            Last {range} days, compared with the previous {range} days
          </p>
        </div>
        <AnalyticsChart
          data={days.map((day) => ({
            label: day.label,
            value: metric.id === "totalFollowers" ? day.totalFollowers : day[metric.id],
          }))}
          metricLabel={metric.chartLabel}
          colorClass={metric.colorClass}
        />
      </CardContent>
    </Card>
  );
}
