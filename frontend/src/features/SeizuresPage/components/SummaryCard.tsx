import type { SummaryCardItem } from "../types";
import { SummaryCardSkeleton } from "../skeletons";

type SummaryCardProps = SummaryCardItem & {
  isLoading?: boolean;
};

export default function SummaryCard({
  title,
  value,
  subtitle,
  isLoading = false,
}: SummaryCardProps) {
  if (isLoading) return <SummaryCardSkeleton />;

  return (
    <div className="app-surface h-fit rounded-3xl p-4">
      <p className="text-[11px] text-nowrap font-semibold tracking-[0.18em] text-(--text-tertiary) uppercase">
        {title}
      </p>
      <div className="mt-3">
        <h3 className="app-text-primary text-4xl leading-none font-bold">
          {value}
        </h3>
        <p className="mt-2 text-sm text-fontColor">{subtitle}</p>
      </div>
    </div>
  );
}
