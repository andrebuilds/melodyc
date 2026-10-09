export const ANALYTICS_RANGES = [7, 28, 90] as const;

export type AnalyticsRange = (typeof ANALYTICS_RANGES)[number];

export function parseAnalyticsRange(value: unknown): AnalyticsRange {
  const parsed = Number(Array.isArray(value) ? value[0] : value);
  return ANALYTICS_RANGES.find((range) => range === parsed) ?? 28;
}
