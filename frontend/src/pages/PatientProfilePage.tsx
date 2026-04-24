import {
  AlertsCard,
  ClinicalOverviewCard,
  demoData,
  KeyStatsCard,
  MedicationsCard,
  RiskAssessmentCard,
  SeizureTrendCard,
} from "@features/PatientProfilePage";

export default function PatientProfilePage() {
  const isLoading = false;

  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <ClinicalOverviewCard
        items={demoData.clinicalOverview}
        isLoading={isLoading}
      />
      {/* <SeizureTrendCard trend={demoData.trend} isLoading={isLoading} /> */}
      <MedicationsCard items={demoData.medications} isLoading={isLoading} />
      <RiskAssessmentCard risk={demoData.risk} isLoading={isLoading} />
      <AlertsCard alerts={demoData.alerts} isLoading={isLoading} />
      <KeyStatsCard stats={demoData.stats} isLoading={isLoading} />
    </section>
  );
}
