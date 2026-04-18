import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SectionCard from "../components/SectionCard";

export default function AlertsCardSkeleton() {
  return (
    <SectionCard>
      <div className="mb-4">
        <Skeleton height={24} width={200} />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-surface-muted/40 flex items-start gap-3 rounded-2xl px-4 py-3"
          >
            <span className="bg-surface-muted/60 mt-0.5 inline-flex size-6 items-center justify-center rounded-full">
              <Skeleton height={16} width={16} borderRadius="50%" />
            </span>

            <div className="flex-1">
              <Skeleton height={14} width="90%" />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
