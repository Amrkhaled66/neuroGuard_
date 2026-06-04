import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SectionCard from "../components/SectionCard";

export default function MedicationsCardSkeleton() {
  return (
    <SectionCard>
      <div className="mb-4">
        <Skeleton height={24} width={200} />
      </div>

      <div className="border-stroke/50 overflow-hidden rounded-2xl border">
        <div className="border-stroke/50 bg-surface-muted/40 grid grid-cols-[1fr_auto] gap-3 border-b px-4 py-3">
          <span className="text-fontColor text-[11px] font-bold tracking-[0.12em] uppercase">
            Header
          </span>
          <span className="text-fontColor text-[11px] font-bold tracking-[0.12em] uppercase">
            Status
          </span>
        </div>

        <div className="divide-stroke/50 divide-y">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_auto] gap-3 px-4 py-3"
            >
              <Skeleton height={16} width="70%" />
              <Skeleton height={20} width={60} />
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
