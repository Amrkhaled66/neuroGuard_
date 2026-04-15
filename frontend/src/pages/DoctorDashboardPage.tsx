import SeizureActivityChart from "@/features/dashboard/components/SeizureActivityChart";
import RealTimeInsights from "@/features/dashboard/components/RealTimeInsights";
import QuickActions from "@/features/dashboard/components/QuickActions";
import CriticalPatients from "@/features/dashboard/components/CriticalPatients";
export function DashboardPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="grid grid-cols-1 gap-6 md:gap-8 xl:grid-cols-3 xl:gap-10">
        <SeizureActivityChart />
        <div className="flex flex-col gap-6 md:gap-8">
          <RealTimeInsights />
          <QuickActions />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:gap-8 xl:grid-cols-3 xl:gap-10">
        <CriticalPatients />
      </div>
    </div>
  );
}
