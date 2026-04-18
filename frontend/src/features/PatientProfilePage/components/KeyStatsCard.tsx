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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className=" rounded-2xl px-4 py-5 text-center"
          >
            <p className="font-headline text-nowrap text-brand-primary text-4xl font-extrabold">
              {stat.value}
            </p>
            <p className="text-fontColor  mt-2 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
