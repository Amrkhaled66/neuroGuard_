import { BsArrowRight } from "react-icons/bs";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import type { IconType } from "react-icons";
import { IntensityDistributionCardSkeleton } from "../skeletons";

type IntensityKey = "high" | "med" | "low";

type IntensityResponse = Record<IntensityKey, number>;

type IntensityMetaItem = {
  key: IntensityKey;
  label: string;
  color: string;
  textColor: string;
  trendIcon: IconType;
};

const intensityMeta: IntensityMetaItem[] = [
  {
    key: "high",
    label: "High",
    color: "var(--brand-primary)",
    textColor: "text-status-danger",
    trendIcon: FiArrowUpRight,
  },
  {
    key: "med",
    label: "Med",
    color: "#F4A300",
    textColor: "text-status-warning",
    trendIcon: BsArrowRight,
  },
  {
    key: "low",
    label: "Low",
    color: "#BDEFD9",
    textColor: "text-status-success",
    trendIcon: FiArrowDownRight,
  },
];

function buildConicGradient(data: IntensityResponse) {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);

  let currentAngle = 0;

  const stops = intensityMeta.map((item) => {
    const value = data[item.key] ?? 0;
    const sliceAngle = total === 0 ? 0 : (value / total) * 360;
    const start = currentAngle;
    const end = currentAngle + sliceAngle;
    currentAngle = end;

    return `${item.color} ${start}deg ${end}deg`;
  });

  return `conic-gradient(${stops.join(", ")})`;
}

type IntensityDistributionCardProps = {
  data: IntensityResponse;
  isLoading?: boolean;
};

export default function IntensityDistributionCard({
  data,
  isLoading = false,
}: IntensityDistributionCardProps) {
  if (isLoading) return <IntensityDistributionCardSkeleton />;

  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  const chartBackground = buildConicGradient(data);

  return (
    <div className="app-surface rounded-3xl p-6">
      <h3 className="app-text-primary text-3xl font-bold">
        Duration Distribution
      </h3>

      <div className="mt-8 flex justify-center">
        <div className="relative h-64 w-64">
          <div
            className="h-full w-full rounded-full"
            style={{ background: chartBackground }}
          />

          <div className="absolute inset-6 flex flex-col items-center justify-center rounded-full bg-[var(--surface-raised)]">
            <span className="app-text-primary text-5xl leading-none font-bold">
              {total}
            </span>
            <span className="mt-3 text-sm font-semibold tracking-[0.2em] text-fontColor uppercase">
              Total
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        {intensityMeta.map((item) => {
          const TrendIcon = item.trendIcon;
          const value = data[item.key] ?? 0;

          return (
            <div key={item.key}>
              <p className="text-sm font-semibold tracking-[0.14em] text-fontColor uppercase">
                {item.label}
              </p>

              <div className="mt-3 flex items-center justify-center gap-1">
                <span className="app-text-primary text-4xl font-bold">
                  {value}
                </span>
                <TrendIcon className={`h-4 w-4 ${item.textColor}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
