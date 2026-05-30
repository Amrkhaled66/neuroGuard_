import { motion } from "framer-motion";
import SeizureLineChart from "@/shared/ui/SeizureLineChart";
import SeizureActivityChartSkeleton from "../skeletons/SeizureActivityChartSkeleton";
import type { DoctorDashboardTrendPoint } from "../types";

type SeizureActivityChartProps = {
  days: number;
  data: DoctorDashboardTrendPoint[];
  isLoading?: boolean;
};

const SeizureActivityChart = ({
  days,
  data,
  isLoading = false,
}: SeizureActivityChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="lg:col-span-2"
    >
      <SeizureLineChart
        data={data}
        title="Seizure Activity"
        subtitle={`Temporal distribution (Last ${days} Days)`}
        isLoading={isLoading}
        skeleton={<SeizureActivityChartSkeleton />}
        className="app-surface app-text-primary space-y-5 rounded-xl p-5 sm:p-6 lg:space-y-6 lg:p-8"
        titleClassName="font-headline text-xl font-bold sm:text-2xl"
        subtitleClassName="app-text-secondary text-sm"
        chartSectionClassName="min-h-64 rounded-2xl border-t border-t-stroke pt-4 sm:min-h-72 lg:min-h-80"
        plotContainerClassName="h-64 rounded-2xl bg-[var(--surface-muted)]/40 p-4 sm:h-72 lg:h-80"
      />
    </motion.div>
  );
};

export default SeizureActivityChart;
