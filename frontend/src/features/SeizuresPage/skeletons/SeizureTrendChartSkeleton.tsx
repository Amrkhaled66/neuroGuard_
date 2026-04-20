import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SeizureTrendChartSkeleton() {
  return (
    <div className="app-surface rounded-3xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton height={28} width={260} />
          <Skeleton height={14} width={220} />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton height={28} width={46} borderRadius={999} />
          <Skeleton height={28} width={46} borderRadius={999} />
          <Skeleton height={28} width={46} borderRadius={999} />
        </div>
      </div>

      <div className="mt-8 space-y-3 rounded-2xl bg-[var(--surface-muted)]/40 p-4">
        <Skeleton height={260} />
        <div className="flex justify-between">
          <Skeleton height={12} width={70} />
          <Skeleton height={12} width={70} />
          <Skeleton height={12} width={70} />
          <Skeleton height={12} width={70} />
        </div>
      </div>
    </div>
  );
}
