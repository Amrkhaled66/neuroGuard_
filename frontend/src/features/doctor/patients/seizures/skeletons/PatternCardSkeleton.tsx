import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function PatternCardSkeleton() {
  return (
    <div className="app-surface-soft flex items-start gap-3 rounded-2xl p-4">
      <Skeleton height={40} width={40} borderRadius={12} />
      <div className="flex-1 space-y-2">
        <Skeleton height={16} width="60%" />
        <Skeleton height={12} width="80%" />
      </div>
    </div>
  );
}
