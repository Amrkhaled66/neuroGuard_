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
      {items.length === 0 ? (
        <div className="rounded-2xl bg-surface-muted/40 px-4 py-5 text-sm text-fontColor">
          No clinical overview available for this patient.
        </div>
      ) : (
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
      )}
    </SectionCard>
  );
}
