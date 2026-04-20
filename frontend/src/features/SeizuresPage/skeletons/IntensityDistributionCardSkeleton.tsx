import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function IntensityDistributionCardSkeleton() {
  return (
    <div className="app-surface rounded-3xl p-6">
      <Skeleton height={28} width={230} />

      <div className="mt-8 flex justify-center">
        <Skeleton height={256} width={256} borderRadius="50%" />
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="flex justify-center">
              <Skeleton height={12} width={36} />
            </div>
            <div className="flex items-center justify-center gap-2">
              <Skeleton height={36} width={32} />
              <Skeleton height={16} width={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
