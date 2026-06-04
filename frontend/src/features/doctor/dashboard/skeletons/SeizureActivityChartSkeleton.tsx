import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SeizureActivityChartSkeleton = () => {
  return (
    <div className="app-surface space-y-5 rounded-xl p-5 sm:p-6 lg:col-span-2 lg:space-y-6 lg:p-8">
      {/* Title */}
      <div className="space-y-2">
        <Skeleton height={24} width={220} />
        <Skeleton height={14} width={180} />
      </div>

      {/* Chart area */}
      <div className="min-h-64 border-t border-t-stroke pt-4 sm:min-h-72 lg:min-h-80">
        <Skeleton height={220} />
      </div>
    </div>
  );
};

export default SeizureActivityChartSkeleton;
