import { useState } from "react";
import SeizureActivityChart from "@/features/dashboard/components/SeizureActivityChart";
import RealTimeInsights from "@/features/dashboard/components/RealTimeInsights";
import QuickActions from "@/features/dashboard/components/QuickActions";
import CriticalPatients from "@/features/dashboard/components/CriticalPatients";
import { useDoctorDashboard } from "@/features/dashboard";
import AddPatientModal from "@/features/patients/components/AddPatientModal";

export function DashboardPage() {
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const dashboardQuery = useDoctorDashboard({ days: 7 });
  const dashboardData = dashboardQuery.data;

  return (
    <>
      <div className="space-y-6 lg:space-y-8">
        <div className="grid grid-cols-1 gap-6 md:gap-8 xl:grid-cols-3 xl:gap-10">
          <SeizureActivityChart
            days={7}
            data={dashboardData?.trend ?? []}
            isLoading={dashboardQuery.isLoading}
          />
          <div className="flex flex-col gap-6 md:gap-8">
            <RealTimeInsights
              dailyFrequency={dashboardData?.summary.dailyFrequency ?? 0}
              lastDetectionTime={dashboardData?.summary.lastDetectionTime ?? null}
              isLoading={dashboardQuery.isLoading}
            />
            <QuickActions onAdmitPatient={() => setIsAddPatientOpen(true)} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:gap-8 xl:grid-cols-3 xl:gap-10">
          <CriticalPatients
            items={dashboardData?.criticalPatients ?? []}
            isLoading={dashboardQuery.isLoading}
          />
        </div>
      </div>
      <AddPatientModal
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
      />
    </>
  );
}
