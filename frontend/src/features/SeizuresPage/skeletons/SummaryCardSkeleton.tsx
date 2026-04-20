import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SummaryCardSkeleton() {
  return (
    <div className="app-surface h-fit rounded-3xl p-4">
      <Skeleton height={12} width={90} />
      <div className="mt-3 space-y-2">
        <Skeleton height={40} width={72} />
        <Skeleton height={14} width={96} />
      </div>
    </div>
  );
}
