import { useOutletContext } from "react-router-dom";
import {
  AlertsCard,
  ClinicalOverviewCard,
  KeyStatsCard,
  MedicationsCard,
  RiskAssessmentCard,
} from "@features/PatientProfilePage";
import type { PatientLayoutOutletContext } from "@/layouts/PatientLayout/PatientLayout";

export default function PatientProfilePage() {
  const { profile, isLoading, errorMessage } =
    useOutletContext<PatientLayoutOutletContext>();

  if (errorMessage && !isLoading) {
    return (
      <section className="app-surface rounded-3xl p-6 text-red-600">
        {errorMessage}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <ClinicalOverviewCard
        items={profile?.clinicalOverview ?? []}
        isLoading={isLoading}
      />
      <MedicationsCard items={profile?.medications ?? []} isLoading={isLoading} />
      <RiskAssessmentCard
        risk={
          profile?.risk ?? {
            score: 0,
            label: "No Risk",
            description: "No profile data available.",
          }
        }
        isLoading={isLoading}
      />
      <AlertsCard alerts={profile?.alerts ?? []} isLoading={isLoading} />
      <KeyStatsCard stats={profile?.stats ?? []} isLoading={isLoading} />
    </section>
  );
}
