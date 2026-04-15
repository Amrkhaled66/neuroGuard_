import { motion } from "framer-motion";
import SeizureActivityChartSkeleton from "../skeletons/SeizureActivityChartSkeleton";
const SeizureActivityChart = () => {
  const days = 7;
  const isLoading = false;

  if (isLoading) {
    return <SeizureActivityChartSkeleton />;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="app-surface app-text-primary space-y-5 rounded-xl p-5 sm:p-6 lg:col-span-2 lg:space-y-6 lg:p-8"
    >
      <div className="space-y-1">
        <p className="font-bold font-headline text-xl sm:text-2xl">
          Seizure Activity
        </p>
        <p className="app-text-secondary text-sm">
          Temporal distribution (Last {days} Days)
        </p>
      </div>
      <div className="min-h-64 border-t border-t-stroke sm:min-h-72 lg:min-h-80"></div>
    </motion.div>
  );
};

export default SeizureActivityChart;
