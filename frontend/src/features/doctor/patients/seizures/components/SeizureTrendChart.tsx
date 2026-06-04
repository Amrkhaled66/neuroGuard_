import SeizureLineChart from "@/shared/ui/SeizureLineChart";
import { SeizureTrendChartSkeleton } from "../skeletons";
import { type SeizureTrendPoint } from "../types";

type SeizureTrendChartProps = {
  data: SeizureTrendPoint[];
  isLoading?: boolean;
};

export default function SeizureTrendChart({
  data,
  isLoading = false,
}: SeizureTrendChartProps) {
  return (
    <SeizureLineChart
      data={data}
      title="90-Day Seizure Frequency"
      subtitle="Longitudinal trend of neurological events"
      isLoading={isLoading}
      skeleton={<SeizureTrendChartSkeleton />}
      titleClassName="app-text-primary text-3xl font-bold"
      plotContainerClassName="h-[260px] rounded-2xl bg-[var(--surface-muted)]/40 p-4"
    />
  );
}
