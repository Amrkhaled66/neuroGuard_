import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SectionCard from "../components/SectionCard";

export default function RiskAssessmentCardSkeleton() {
  return (
    <SectionCard>
      <div className="mb-4">
        <Skeleton height={24} width={200} />
      </div>

      <div className="flex flex-col items-center justify-center gap-4 pt-2">
        <div className="bg-surface-muted/40 relative flex size-36 items-center justify-center rounded-full">
          <div className="flex size-[108px] flex-col items-center justify-center rounded-full bg-white">
            <Skeleton height={36} width={80} />
            <div className="mt-2 w-full">
              <Skeleton height={12} width={80} />
            </div>
          </div>
        </div>

        <div className="w-full text-center">
          <Skeleton height={16} width="80%" />
        </div>
      </div>
    </SectionCard>
  );
}
