import { LuTrendingDown } from "react-icons/lu";

import type { ProfileOverviewData, TrendPoint } from "../types";
import { SeizureTrendCardSkeleton } from "../skeletons";
import SectionCard from "./SectionCard";
import SectionHeader from "./SectionHeader";

type SeizureTrendCardProps = {
  trend: ProfileOverviewData["trend"];
  isLoading?: boolean;
};

type MiniAreaChartProps = {
  points: TrendPoint[];
};

function MiniAreaChart({ points }: MiniAreaChartProps) {
  const width = 100;
  const height = 40;
  const maxY = Math.max(...points.map((point) => point.y), 1);
  const minY = Math.min(...points.map((point) => point.y), 0);

  const toX = (index: number) =>
    (index / Math.max(points.length - 1, 1)) * width;

  const toY = (value: number) =>
    height - ((value - minY) / Math.max(maxY - minY, 1)) * height;

  const linePath = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${toX(index)} ${toY(point.y)}`,
    )
    .join(" ");

  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="bg-brand-primary-softest/60 h-28 w-full overflow-hidden rounded-2xl p-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-brand-primary)"
              stopOpacity="0.25"
            />
            <stop
              offset="100%"
              stopColor="var(--color-brand-primary)"
              stopOpacity="0.02"
            />
          </linearGradient>
        </defs>

        <path d={areaPath} fill="url(#trendFill)" />
        <path
          d={linePath}
          fill="none"
          stroke="var(--color-brand-primary)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function SeizureTrendCard({
  trend,
  isLoading = false,
}: SeizureTrendCardProps) {
  if (isLoading) return <SeizureTrendCardSkeleton />;

  return (
    <SectionCard>
      <SectionHeader
        title="Seizure Trends (30 Days)"
        action={
          <div className="bg-status-success-soft text-status-success inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold">
            <LuTrendingDown className="size-3.5" />
            {trend.percent}% Decrease
          </div>
        }
      />

      <div className="space-y-3">
        <MiniAreaChart points={trend.points} />
        <div className="text-fontColor flex items-center justify-between text-xs">
          <span>30 days</span>
          <span>
            Last Seizure:{" "}
            <span className="text-foreground font-medium">
              {trend.lastSeizure}
            </span>
          </span>
        </div>
      </div>
    </SectionCard>
  );
}
