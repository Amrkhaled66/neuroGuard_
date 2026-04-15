import { motion } from "framer-motion";
import RealTimeInsightsSkeleton from "../skeletons/RealTimeInsightsSkeleton";
const RealTimeInsights = () => {
  const isLoading = true;

  if (isLoading) {
    return <RealTimeInsightsSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="animate h-fit cursor-pointer rounded-3xl bg-brand-secondary p-5 text-brand-primary-soft transition-transform duration-300 md:hover:-translate-y-2 sm:p-6 lg:p-8"
    >
      <motion.div
        className="space-y-4 border-b border-b-green-200 pb-5 sm:space-y-6 sm:pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-sm uppercase tracking-[0.2em] sm:text-base">
          Real-Time Insights
        </h2>
        <div className="space-y-2">
          <p className="text-xs text-green-50 sm:text-sm">Daily Frequency</p>
          <motion.p
            className="font-bold text-3xl sm:text-4xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            08
          </motion.p>
        </div>
      </motion.div>
      <motion.div
        className="mt-5 sm:mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="space-y-2">
          <p className="text-xs text-green-50 sm:text-sm">
            Last Detection Time
          </p>
          <motion.p
            className="font-bold text-3xl sm:text-4xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            14:00 PM
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};
export default RealTimeInsights;
