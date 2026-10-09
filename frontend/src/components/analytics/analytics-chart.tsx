"use client";

import { useRef, useState, type PointerEvent } from "react";

type ChartPoint = { label: string; value: number };

const WIDTH = 720;
const HEIGHT = 260;
const PAD = { top: 16, right: 12, bottom: 28, left: 40 };
const INNER_WIDTH = WIDTH - PAD.left - PAD.right;
const INNER_HEIGHT = HEIGHT - PAD.top - PAD.bottom;

const numberFormatter = new Intl.NumberFormat("en-US");

// Rounds up to a multiple of 4 so the quarter gridlines stay whole numbers.
function chartMax(value: number) {
  return Math.max(4, Math.ceil(value / 4) * 4);
}

export function AnalyticsChart({
  data,
  metricLabel,
  colorClass,
}: {
  data: ChartPoint[];
  metricLabel: string;
  colorClass: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const max = chartMax(Math.max(0, ...data.map((point) => point.value)));
  const x = (index: number) =>
    PAD.left +
    (data.length > 1 ? (index / (data.length - 1)) * INNER_WIDTH : INNER_WIDTH / 2);
  const y = (value: number) => PAD.top + INNER_HEIGHT - (value / max) * INNER_HEIGHT;

  const line = data
    .map((point, index) => `${index ? "L" : "M"}${x(index)},${y(point.value)}`)
    .join(" ");
  const baseline = PAD.top + INNER_HEIGHT;
  const area = `${line} L${x(data.length - 1)},${baseline} L${x(0)},${baseline} Z`;
  const labelStep = Math.max(1, Math.ceil(data.length / 6));
  const gradientId = `analytics-fill-${metricLabel.replace(/\W/g, "")}`;

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || data.length === 0) return;
    const svgX = ((event.clientX - rect.left) / rect.width) * WIDTH;
    const ratio = (svgX - PAD.left) / INNER_WIDTH;
    const index = Math.round(ratio * (data.length - 1));
    setActiveIndex(Math.min(data.length - 1, Math.max(0, index)));
  };

  const active = activeIndex === null ? null : data[activeIndex];

  return (
    <div className={`relative ${colorClass}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full touch-none select-none"
        role="img"
        aria-label={`${metricLabel} per day`}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerMove}
        onPointerLeave={() => setActiveIndex(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
          const value = max * fraction;
          return (
            <g key={fraction}>
              <line
                x1={PAD.left}
                x2={WIDTH - PAD.right}
                y1={y(value)}
                y2={y(value)}
                className="stroke-border"
                strokeDasharray={fraction === 0 ? undefined : "3 5"}
              />
              <text
                x={PAD.left - 8}
                y={y(value) + 3}
                textAnchor="end"
                className="fill-muted-foreground text-[10px]"
              >
                {numberFormatter.format(value)}
              </text>
            </g>
          );
        })}

        <g key={metricLabel} className="animate-in fade-in duration-500">
          <path d={area} fill={`url(#${gradientId})`} />
          <path
            d={line}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>

        {data.map((point, index) =>
          index % labelStep === 0 || index === data.length - 1 ? (
            <text
              key={point.label}
              x={x(index)}
              y={HEIGHT - 8}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {point.label}
            </text>
          ) : null,
        )}

        {active && activeIndex !== null && (
          <g>
            <line
              x1={x(activeIndex)}
              x2={x(activeIndex)}
              y1={PAD.top}
              y2={baseline}
              className="stroke-muted-foreground/40"
            />
            <circle
              cx={x(activeIndex)}
              cy={y(active.value)}
              r="5"
              fill="currentColor"
              className="stroke-background"
              strokeWidth="2"
            />
          </g>
        )}
      </svg>

      {active && activeIndex !== null && (
        <div
          className="bg-popover text-popover-foreground pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-md border px-3 py-2 text-xs shadow-md"
          style={{ left: `${(x(activeIndex) / WIDTH) * 100}%` }}
        >
          <p className="text-muted-foreground">{active.label}</p>
          <p className="text-foreground mt-0.5 text-sm font-semibold">
            {numberFormatter.format(active.value)}{" "}
            <span className="text-muted-foreground font-normal">{metricLabel}</span>
          </p>
        </div>
      )}
    </div>
  );
}
