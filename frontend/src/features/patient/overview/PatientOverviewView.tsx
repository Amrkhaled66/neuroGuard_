import SeizureLineChart from "@/shared/ui/SeizureLineChart";
import { formatCalendarDate } from "@/shared/utils/date";
import { usePatientOverview } from "./patientPortalQueries";
import OverviewAdherenceCard from "./components/OverviewAdherenceCard";
import OverviewAlertsCard from "./components/OverviewAlertsCard";
import OverviewHero from "./components/OverviewHero";
import OverviewInsightCard from "./components/OverviewInsightCard";
import OverviewStatsGrid from "./components/OverviewStatsGrid";

export default function PatientOverviewView() {
  const overviewQuery = usePatientOverview();
  const overview = overviewQuery.data;

  if (overviewQuery.error) {
    return (
      <section className="app-surface rounded-3xl p-6 text-red-600">
        {overviewQuery.error instanceof Error
          ? overviewQuery.error.message
          : "Failed to load your dashboard."}
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <OverviewHero
        fullName={overview?.patient.fullName}
        medicalId={overview?.patient.medicalId}
        physician={overview?.patient.physician}
        status={overview?.patient.status}
        age={overview?.patient.age}
        monitoringTime={overview?.monitoringSummary.totalMonitoringTime}
        lastSessionDate={overview?.stats.lastSessionDate}
        formatDate={formatCalendarDate}
      />

      <OverviewStatsGrid
        totalSeizures={overview?.stats.totalSeizures}
        activeMedications={overview?.stats.activeMedications}
        unreadNotifications={overview?.stats.unreadNotifications}
        analyzedSessions={overview?.monitoringSummary.analyzedSessions}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <SeizureLineChart
          data={overview?.seizureTrend ?? []}
          title="Seizure Activity"
          subtitle="Last 7 days of detected events"
          isLoading={overviewQuery.isLoading}
          height={220}
          className="app-surface rounded-[2rem] p-6"
          titleClassName="app-text-primary text-2xl font-bold"
        />

        <OverviewAdherenceCard
          adherenceRate={overview?.medicationAdherence.adherenceRate}
          takenCount={overview?.medicationAdherence.takenCount}
          missedCount={overview?.medicationAdherence.missedCount}
          scheduledCount={overview?.medicationAdherence.scheduledCount}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
        <OverviewAlertsCard alerts={overview?.recentAlerts ?? []} />
        <OverviewInsightCard
          title={overview?.latestSeizureInsight.title}
          description={overview?.latestSeizureInsight.description}
          sessionCount={overview?.monitoringSummary.sessionCount}
          latestSessionStatus={overview?.monitoringSummary.latestSessionStatus}
        />
      </div>
    </section>
  );
}
