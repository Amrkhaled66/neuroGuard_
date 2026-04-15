import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const QuickActionsSkeleton = () => {
  return (
    <div className="app-surface-soft space-y-4 rounded-3xl p-5 sm:p-6">
      {/* Title */}
      <Skeleton height={18} width={140} />

      {/* Buttons grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="app-surface flex min-h-24 flex-col items-center justify-center space-y-2 rounded-2xl px-4 py-4"
          >
            {/* Icon */}
            <Skeleton circle width={32} height={32} />

            {/* Label */}
            <Skeleton height={12} width={60} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsSkeleton;
