import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const RealTimeInsightsSkeleton = () => {
  return (
    <div className="h-fit rounded-3xl bg-brand-secondary p-5 text-brand-primary-soft sm:p-6 lg:p-8">
      <div className="space-y-4 border-b border-b-green-200 pb-5 sm:space-y-6 sm:pb-6">
        <Skeleton
          height={16}
          width={140}
          baseColor="rgba(255,255,255,0.12)"
          highlightColor="rgba(255,255,255,0.22)"
        />

        <div className="space-y-2">
          <Skeleton
            height={12}
            width={90}
            baseColor="rgba(255,255,255,0.10)"
            highlightColor="rgba(255,255,255,0.18)"
          />
          <Skeleton
            height={40}
            width={70}
            baseColor="rgba(255,255,255,0.12)"
            highlightColor="rgba(255,255,255,0.22)"
          />
        </div>
      </div>

      <div className="mt-5 sm:mt-6">
        <div className="space-y-2">
          <Skeleton
            height={12}
            width={120}
            baseColor="rgba(255,255,255,0.10)"
            highlightColor="rgba(255,255,255,0.18)"
          />
          <Skeleton
            height={40}
            width={110}
            baseColor="rgba(255,255,255,0.12)"
            highlightColor="rgba(255,255,255,0.22)"
          />
        </div>
      </div>
    </div>
  );
};

export default RealTimeInsightsSkeleton;
