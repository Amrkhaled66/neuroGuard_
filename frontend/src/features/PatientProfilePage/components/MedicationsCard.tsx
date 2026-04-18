import { LuCircleCheckBig } from "react-icons/lu";

import type { MedicationItem } from "../types";
import { MedicationsCardSkeleton } from "../skeletons";
import SectionCard from "./SectionCard";
import SectionHeader from "./SectionHeader";

type MedicationsCardProps = {
  items: MedicationItem[];
  isLoading?: boolean;
};

export default function MedicationsCard({
  items,
  isLoading = false,
}: MedicationsCardProps) {
  if (isLoading) return <MedicationsCardSkeleton />;

  return (
    <SectionCard>
      <SectionHeader title="Current Medications" />

      <div className="border-stroke/50 overflow-hidden rounded-2xl border">
        <div className="border-stroke/50 bg-surface-muted/40 grid grid-cols-[1fr_auto] gap-3 border-b px-4 py-3">
          <span className="text-fontColor text-[11px] font-bold tracking-[0.12em] uppercase">
            Header
          </span>
          <span className="text-fontColor text-[11px] font-bold tracking-[0.12em] uppercase">
            Status
          </span>
        </div>

        <div className="divide-stroke/50 divide-y">
          {items.map((item) => (
            <div
              key={`${item.name}-${item.dosage}`}
              className="grid grid-cols-[1fr_auto] gap-3 px-4 py-3"
            >
              <p className="text-foreground text-sm">
                {item.name}{" "}
                <span className="text-fontColor">({item.dosage})</span>
              </p>

              <div className="text-foreground inline-flex items-center gap-2 text-sm font-medium">
                <span className="bg-status-success-soft text-status-success inline-flex size-5 items-center justify-center rounded-full">
                  <LuCircleCheckBig className="size-3.5" />
                </span>
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
