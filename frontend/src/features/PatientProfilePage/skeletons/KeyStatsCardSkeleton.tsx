import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SectionCard from "../components/SectionCard";

export default function KeyStatsCardSkeleton() {
  return (
    <SectionCard>
      <div className="mb-4">
        <Skeleton height={24} width={200} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-brand-primary-softest/50 rounded-2xl px-4 py-5 text-center"
          >
            <Skeleton height={40} width={60} />
            <div className="mt-2">
              <Skeleton height={14} width={80} />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
