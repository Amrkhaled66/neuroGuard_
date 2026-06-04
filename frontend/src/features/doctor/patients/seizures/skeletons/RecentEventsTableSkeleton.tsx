import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TableSkeleton from "@/shared/ui/skeletons/TableSkeleton";

export default function RecentEventsTableSkeleton() {
  return (
    <div className="app-surface rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <Skeleton height={36} width={220} />
        <Skeleton height={18} width={80} />
      </div>

      <div className="mt-6">
        <TableSkeleton />
      </div>
    </div>
  );
}
