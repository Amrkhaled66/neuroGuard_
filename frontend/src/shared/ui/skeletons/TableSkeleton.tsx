import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const columnWidths = ["30%", "9%", "14%", "14%", "16%", "12%", "14%"];

export default function TableSkeleton() {
  return (
    <div className="app-surface overflow-hidden rounded-2xl sm:rounded-[28px]">
      <div className="app-surface-soft app-border flex min-w-[820px] items-center border-b px-5 py-6">
        {columnWidths.map((width, index) => (
          <div key={index} className="px-2" style={{ width }}>
            <Skeleton height={12} width="70%" />
          </div>
        ))}
      </div>

      <div className="min-w-[820px]">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="app-border flex items-center border-b px-5 py-4 last:border-b-0"
          >
            <div className="flex w-[30%] items-center gap-3 px-2 sm:gap-4">
              <Skeleton circle width={40} height={40} />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton height={16} width="55%" />
                <Skeleton height={12} width="75%" />
              </div>
            </div>

            <div className="w-[9%] px-2">
              <Skeleton height={16} width="45%" />
            </div>

            <div className="w-[14%] px-2">
              <Skeleton height={16} width="70%" />
            </div>

            <div className="w-[14%] px-2">
              <Skeleton height={16} width="65%" />
            </div>

            <div className="w-[16%] px-2">
              <Skeleton height={16} width="80%" />
            </div>

            <div className="w-[12%] px-2">
              <Skeleton height={34} width="85%" borderRadius={999} />
            </div>

            <div className="w-[14%] px-2">
              <Skeleton height={40} width="90%" borderRadius={16} />
            </div>
          </div>
        ))}
      </div>

      <div className="app-border flex min-w-[820px] items-center justify-between border-t px-5 py-5">
        <Skeleton height={14} width={150} />
        <div className="flex items-center gap-2">
          <Skeleton circle width={40} height={40} />
          <Skeleton circle width={40} height={40} />
          <Skeleton circle width={40} height={40} />
        </div>
      </div>
    </div>
  );
}
