import type { ClinicalItem } from "../types";
import { ClinicalOverviewCardSkeleton } from "../skeletons";
import SectionCard from "./SectionCard";
import SectionHeader from "./SectionHeader";

type ClinicalOverviewCardProps = {
  items: ClinicalItem[];
  isLoading?: boolean;
};

export default function ClinicalOverviewCard({
  items,
  isLoading = false,
}: ClinicalOverviewCardProps) {
  if (isLoading) return <ClinicalOverviewCardSkeleton />;

  return (
    <SectionCard>
      <SectionHeader title="Clinical Overview" />
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.label} className="flex gap-3 text-sm">
            <span className="bg-brand-primary mt-2 size-1.5 shrink-0 rounded-full" />
            <p className="text-fontColor">
              <span className="text-foreground font-black">{item.label}:</span>{" "}
              {item.value}
            </p>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
