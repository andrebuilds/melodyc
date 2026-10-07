import { BarChart3Icon } from "lucide-react";

type ActivityDay = {
  date: string;
  label: string;
  generated: number;
  published: number;
};

export function AnalyticsChart({ data }: { data: ActivityDay[] }) {
  const maxValue = Math.max(
    1,
    ...data.map((day) => Math.max(day.generated, day.published)),
  );
  const chartWidth = 700;
  const chartHeight = 220;
  const left = 12;
  const bottom = 28;
  const top = 12;
  const usableHeight = chartHeight - top - bottom;
  const step = chartWidth / data.length;
  const barWidth = Math.max(8, step * 0.28);

  return (
    <div className="space-y-5">
      <div className="text-muted-foreground flex items-center gap-5 text-sm">
        <span className="flex items-center gap-2">
          <span className="bg-primary size-2.5 rounded-full" />
          Generated
        </span>
        <span className="flex items-center gap-2">
          <span className="bg-secondary size-2.5 rounded-full" />
          Published
        </span>
      </div>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-64 w-full min-w-[620px]"
          role="img"
          aria-label="Songs generated and published over the last 14 days"
        >
          {[0, 0.5, 1].map((fraction) => {
            const y = top + usableHeight * (1 - fraction);
            return (
              <line
                key={fraction}
                x1={left}
                x2={chartWidth}
                y1={y}
                y2={y}
                className="stroke-border"
                strokeDasharray="3 5"
              />
            );
          })}
          {data.map((day, index) => {
            const x = index * step + step / 2;
            const generatedHeight = (day.generated / maxValue) * usableHeight;
            const publishedHeight = (day.published / maxValue) * usableHeight;
            return (
              <g key={day.date}>
                <rect
                  x={x - barWidth - 1}
                  y={top + usableHeight - generatedHeight}
                  width={barWidth}
                  height={generatedHeight}
                  rx="3"
                  className="fill-primary"
                />
                <rect
                  x={x + 1}
                  y={top + usableHeight - publishedHeight}
                  width={barWidth}
                  height={publishedHeight}
                  rx="3"
                  className="fill-secondary"
                />
                {(index === 0 ||
                  index === data.length - 1 ||
                  index % 3 === 0) && (
                  <text
                    x={x}
                    y={chartHeight - 7}
                    textAnchor="middle"
                    className="fill-muted-foreground text-[10px]"
                  >
                    {day.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <p className="text-muted-foreground flex items-center gap-2 text-xs">
        <BarChart3Icon className="size-3.5" />
        Daily activity for the last 14 days
      </p>
    </div>
  );
}
