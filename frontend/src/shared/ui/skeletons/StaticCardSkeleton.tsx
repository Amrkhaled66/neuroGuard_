import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function StaticCardSkeleton() {
  return (
    <div className="app-surface rounded-3xl p-6">
      {/* Icon skeleton */}
      <div className="mb-4">
        <Skeleton height={48} width={48} borderRadius={16} />
      </div>

      {/* Value */}
      <Skeleton height={28} width={60} />

      {/* Label */}
      <div className="mt-2">
        <Skeleton height={12} width={100} />
      </div>
    </div>
  );
}
