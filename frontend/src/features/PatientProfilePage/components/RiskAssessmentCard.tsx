import type { ProfileOverviewData } from "../types";
import { RiskAssessmentCardSkeleton } from "../skeletons";
import SectionCard from "./SectionCard";
import SectionHeader from "./SectionHeader";

type RiskAssessmentCardProps = {
  risk: ProfileOverviewData["risk"];
  isLoading?: boolean;
};

type ProgressRingProps = {
  value: number;
  label: string;
};

function ProgressRing({ value, label }: ProgressRingProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div
      className="relative flex size-36 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(var(--color-status-warning) ${safeValue * 3.6}deg, #e8ecea 0deg)`,
      }}
    >
      <div className="flex size-27 flex-col items-center justify-center rounded-full bg-white">
        <span className="font-headline text-status-warning text-3xl font-extrabold">
          {safeValue}%
        </span>
        <span className="text-status-warning text-[9px] font-extrabold tracking-[0.14em] text-nowrap uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}

export default function RiskAssessmentCard({
  risk,
  isLoading = false,
}: RiskAssessmentCardProps) {
  if (isLoading) return <RiskAssessmentCardSkeleton />;

  return (
    <SectionCard>
      <SectionHeader title="Risk Assessment" />

      <div className="flex flex-col items-center justify-center gap-4 pt-2">
        <ProgressRing value={risk.score} label={risk.label} />

        <div className="text-center">
          <p className="text-foreground text-sm font-semibold">
            {risk.description}
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
