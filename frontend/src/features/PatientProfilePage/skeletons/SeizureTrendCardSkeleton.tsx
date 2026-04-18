import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SectionCard from "../components/SectionCard";

export default function SeizureTrendCardSkeleton() {
  return (
    <SectionCard>
      <div className="mb-4">
        <Skeleton height={24} width={200} />
      </div>
      <Skeleton width="100%" height={112} />
      <div className="mt-4 flex items-center gap-2">
        <div className="size-6 rounded-full">
          <Skeleton height={24} width={24} borderRadius="50%" />
        </div>
        <Skeleton height={16} width={150} />
      </div>
    </SectionCard>
  );
}
