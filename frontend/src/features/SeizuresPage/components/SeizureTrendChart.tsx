import { SeizureTrendChartSkeleton } from "../skeletons";
import {
  formatTrendLabel,
  type SeizureTrendPoint,
} from "../types";

type SeizureTrendChartProps = {
  data: SeizureTrendPoint[];
  isLoading?: boolean;
};

export default function SeizureTrendChart({
  data,
  isLoading = false,
}: SeizureTrendChartProps) {
  if (isLoading) return <SeizureTrendChartSkeleton />;

  const chartWidth = 800;
  const chartHeight = 240;
  const maxValue = Math.max(...data.map((item) => item.seizureCount), 1);
  const xStep = data.length > 1 ? chartWidth / (data.length - 1) : chartWidth;
  const yScale = chartHeight - 30;

  const path = data
    .map((point, index) => {
      const x = index * xStep;
      const y =
        chartHeight - (point.seizureCount / maxValue) * yScale - 10;

      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  const trendLabels =
    data.length <= 4
      ? data
      : [data[0], data[Math.floor(data.length / 3)], data[Math.floor((data.length * 2) / 3)], data[data.length - 1]];

  return (
    <div className="app-surface rounded-3xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="app-text-primary text-3xl font-bold">
            90-Day Seizure Frequency
          </h3>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Longitudinal trend of neurological events
          </p>
        </div>
      </div>

      <div className="mt-8 h-[260px] rounded-2xl bg-[var(--surface-muted)]/40 p-4">
        <svg viewBox="0 0 800 240" className="h-full w-full">
          {data.length > 0 ? (
            <path
              d={path}
              fill="none"
              stroke="var(--brand-primary)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          ) : null}
        </svg>

        <div className="mt-3 flex justify-between text-[11px] font-semibold tracking-[0.14em] text-[var(--text-tertiary)] uppercase">
          {trendLabels.map((label) => (
            <span key={label.date}>{formatTrendLabel(label.date)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
