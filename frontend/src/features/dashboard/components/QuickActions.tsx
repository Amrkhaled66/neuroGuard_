import { FaUserPlus } from "react-icons/fa6";
import QuickActionsSkeleton from "../skeletons/QuickActionsSkeleton";
const QuickActions = () => {
  const isLoading = false;

  if (isLoading) {
    return <QuickActionsSkeleton />;
  }

  return (
    <div className="space-y-4 rounded-3xl app-surface  p-5 sm:p-6">
      <h2 className="text-base font-bold sm:text-lg">Quick Actions</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button className="animate app-surface group flex min-h-24 cursor-pointer flex-col items-center justify-center space-y-2 rounded-2xl px-4 py-4 text-center drop-shadow-md transition-colors hover:bg-brand-primary-softest/25">
          <FaUserPlus className="text-3xl text-brand-primary" />
          <p className="text-sm font-bold">Admit</p>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
