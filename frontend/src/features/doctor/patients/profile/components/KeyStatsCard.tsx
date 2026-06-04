import type { StatItem } from "../types";
import { KeyStatsCardSkeleton } from "../skeletons";
import SectionCard from "./SectionCard";
import SectionHeader from "./SectionHeader";

type KeyStatsCardProps = {
  stats: StatItem[];
  isLoading?: boolean;
};

export default function KeyStatsCard({
  stats,
  isLoading = false,
}: KeyStatsCardProps) {
  if (isLoading) return <KeyStatsCardSkeleton />;

  return (
    <SectionCard>
      <SectionHeader title="Key Clinical Stats" />
      {stats.length === 0 ? (
        <div className="bg-surface-muted/40 text-fontColor rounded-2xl px-4 py-5 text-sm">
          No clinical stats are available for this patient yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl px-4 py-5 text-center">
              <p className="font-headline text-brand-primary text-4xl font-extrabold text-nowrap">
                {stat.value}
              </p>
              <p className="text-fontColor mt-2 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
