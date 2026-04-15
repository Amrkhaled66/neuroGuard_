import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CriticalPatientsSkeleton = () => {
  return (
    <div className="app-surface h-fit space-y-5 rounded-xl p-5 sm:p-6 lg:col-span-2 lg:space-y-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-x-2">
        <Skeleton height={24} width={180} />
      </div>

      {/* List */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-2xl px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5"
          >
            {/* Left side */}
            <div className="flex w-full items-center space-x-4 sm:w-auto">
              {/* Avatar */}
              <Skeleton circle width={40} height={40} />

              {/* Text */}
              <div className="space-y-2">
                <Skeleton height={14} width={120} />
                <Skeleton height={12} width={160} />
              </div>
            </div>

            {/* Button */}
            <div className="w-full sm:w-auto">
              <Skeleton height={44} width="100%" borderRadius={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CriticalPatientsSkeleton;
