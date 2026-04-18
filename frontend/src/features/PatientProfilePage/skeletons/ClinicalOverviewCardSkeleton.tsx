import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SectionCard from "../components/SectionCard";

export default function ClinicalOverviewCardSkeleton() {
  return (
    <SectionCard>
      <div className="mb-4">
        <Skeleton height={24} width={200} />
      </div>
      <ul className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <li key={index} className="flex gap-3 text-sm">
            <span className="bg-brand-primary mt-2 size-1.5 shrink-0 rounded-full" />
            <div className="flex-1">
              <Skeleton height={16} width="80%" />
              <div className="mt-2">
                <Skeleton height={14} width="60%" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
