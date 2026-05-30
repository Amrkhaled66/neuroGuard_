import type { ReactNode } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatTrendLabel } from "@/features/SeizuresPage/types";

export type SeizureLineChartPoint = {
  date: string;
  seizureCount: number;
};

type SeizureLineChartProps = {
  data: SeizureLineChartPoint[];
  title: string;
  subtitle: string;
  isLoading?: boolean;
  emptyText?: string;
  height?: number;
  strokeColor?: string;
  showAxes?: boolean;
  showTooltip?: boolean;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  chartSectionClassName?: string;
  plotContainerClassName?: string;
  skeleton?: ReactNode;
};

type TooltipPayloadItem = {
  value?: number | string;
};

type TooltipContentProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
};

function TrendTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="app-surface rounded-2xl border border-stroke px-3 py-2 shadow-lg">
      <p className="app-text-primary text-sm font-semibold">
        {label ? formatTrendLabel(label) : "Unknown"}
      </p>
      <p className="app-text-secondary text-xs">
        Seizures: {Number(payload[0]?.value ?? 0)}
      </p>
    </div>
  );
}

export default function SeizureLineChart({
  data,
  title,
  subtitle,
  isLoading = false,
  emptyText = "No seizure activity recorded in this range.",
  height,
  strokeColor = "var(--brand-primary)",
  showAxes = true,
  showTooltip = true,
  className = "app-surface rounded-3xl p-6",
  titleClassName = "app-text-primary text-3xl font-bold",
  subtitleClassName = "mt-1 text-sm text-[var(--text-secondary)]",
  chartSectionClassName = "mt-8",
  plotContainerClassName = "h-[260px] rounded-2xl bg-[var(--surface-muted)]/40 p-4",
  skeleton = null,
}: SeizureLineChartProps) {
  if (isLoading) {
    return skeleton;
  }

  const hasActivity =
    data.length > 0 && data.some((point) => point.seizureCount > 0);

  return (
    <div className={className}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className={titleClassName}>{title}</h3>
          <p className={subtitleClassName}>{subtitle}</p>
        </div>
      </div>

      <div className={chartSectionClassName}>
        <div
          className={plotContainerClassName}
          style={height ? { height } : undefined}
        >
          {!hasActivity ? (
            <div className="flex h-full items-center justify-center rounded-2xl text-sm app-text-secondary">
              {emptyText}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 12, right: 12, left: 0, bottom: 8 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="var(--color-stroke)"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatTrendLabel}
                  hide={!showAxes}
                  minTickGap={24}
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "var(--text-tertiary)",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                />
                <YAxis
                  allowDecimals={false}
                  hide={!showAxes}
                  tickLine={false}
                  axisLine={false}
                  width={32}
                  tick={{
                    fill: "var(--text-tertiary)",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                />
                {showTooltip ? <Tooltip content={<TrendTooltip />} /> : null}
                <Line
                  type="monotone"
                  dataKey="seizureCount"
                  stroke={strokeColor}
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    strokeWidth: 2,
                    fill: "var(--surface-primary)",
                  }}
                  activeDot={{
                    r: 6,
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
