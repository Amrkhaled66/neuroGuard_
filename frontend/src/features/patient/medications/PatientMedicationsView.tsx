import { useMemo, useState } from "react";
import { useAuth } from "@/features/auth/context/useAuth";
import {
  useCreateMedicationLog,
  usePatientMedicationAdherence,
} from "@/features/doctor/patients/medications";
import { Alert } from "@/shared/utils/alert";
import MedicationAdherenceChart from "./components/MedicationAdherenceChart";
import MedicationCard from "./components/MedicationCard";

async function handleMedicationAction(
  action: () => Promise<unknown>,
  message: string,
) {
  try {
    await action();
    Alert({
      title: "Medication updated",
      text: message,
      icon: "success",
      confirmButtonText: "OK",
    });
  } catch (error) {
    Alert({
      title: "Unable to save check-in",
      text:
        error instanceof Error
          ? error.message
          : "Something went wrong while updating your medication log.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}

export default function PatientMedicationsView() {
  const { authData } = useAuth();
  const patientId = Number(authData.user?.id ?? 0);
  const [days, setDays] = useState<7 | 30>(7);

  const adherenceQuery = usePatientMedicationAdherence(patientId, days);
  const createLogMutation = useCreateMedicationLog();

  const activeMedications = useMemo(
    () =>
      (adherenceQuery.data?.items ?? []).filter(
        (medication) => medication.status === "active",
      ),
    [adherenceQuery.data?.items],
  );

  if (!patientId) {
    return (
      <section className="app-surface rounded-3xl p-6 text-red-600">
        Session invalid. Please sign in again.
      </section>
    );
  }

  if (adherenceQuery.error) {
    return (
      <section className="app-surface rounded-3xl p-6 text-red-600">
        {adherenceQuery.error instanceof Error
          ? adherenceQuery.error.message
          : "Failed to load medication adherence."}
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="app-text-secondary text-xs font-semibold tracking-[0.16em] uppercase">
            Medication Check-ins
          </p>
          <h2 className="app-text-primary mt-2 text-3xl font-bold">
            Stay on top of your treatment plan
          </h2>
          <p className="app-text-secondary mt-2 text-sm">
            Review active medications and log taken or missed doses.
          </p>
        </div>

        <div className="flex gap-2 rounded-full bg-[var(--surface-muted)]/75 p-1">
          {[7, 30].map((value) => (
            <button
              key={value}
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                days === value
                  ? "bg-white text-[var(--brand-primary)] shadow-sm"
                  : "app-text-secondary"
              }`}
              onClick={() => setDays(value as 7 | 30)}
            >
              {value} days
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Active Medications",
            value: adherenceQuery.data?.summary.activeMedications ?? "--",
          },
          {
            label: "Adherence Rate",
            value: `${adherenceQuery.data?.summary.adherenceRate ?? 0}%`,
          },
          {
            label: "Taken Logs",
            value: adherenceQuery.data?.summary.takenCount ?? "--",
          },
          {
            label: "Missed Logs",
            value: adherenceQuery.data?.summary.missedCount ?? "--",
          },
        ].map((item) => (
          <article key={item.label} className="app-surface rounded-3xl p-5">
            <p className="app-text-secondary text-xs font-semibold tracking-[0.14em] uppercase">
              {item.label}
            </p>
            <p className="app-text-primary mt-3 text-3xl font-bold">{item.value}</p>
          </article>
        ))}
      </div>

      <MedicationAdherenceChart
        adherenceRate={adherenceQuery.data?.summary.adherenceRate ?? 0}
        trend={adherenceQuery.data?.trend ?? []}
      />

      <div className="space-y-6">
        {activeMedications.length ? (
          activeMedications.map((medication) => (
            <MedicationCard
              key={medication.id}
              medication={medication}
              isSubmitting={
                createLogMutation.isPending &&
                createLogMutation.variables?.medId === medication.id
              }
              onLog={async (status) =>
                handleMedicationAction(
                  () =>
                    createLogMutation.mutateAsync({
                      patientId,
                      medId: medication.id,
                      status,
                    }),
                  status === "taken"
                    ? "Your medication was marked as taken."
                    : "Your medication was marked as missed.",
                )
              }
            />
          ))
        ) : (
          <article className="app-surface rounded-[2rem] p-6 text-sm app-text-secondary">
            No active medications are assigned yet.
          </article>
        )}
      </div>
    </section>
  );
}
