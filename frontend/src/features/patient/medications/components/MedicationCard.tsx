import Button from "@/shared/ui/Button";
import type {
  MedicationLogItem,
  PatientMedication,
} from "@/features/doctor/patients/medications";
import { formatCalendarDateTime } from "@/shared/utils/date";

type MedicationCardProps = {
  medication: PatientMedication;
  onLog: (status: MedicationLogItem["status"]) => Promise<void>;
  isSubmitting: boolean;
};

export default function MedicationCard({
  medication,
  onLog,
  isSubmitting,
}: MedicationCardProps) {
  const descriptor =
    [medication.dosage, medication.scheduledTime].filter(Boolean).join(" | ") ||
    "No dosage instructions available";

  return (
    <article className="app-surface rounded-[2rem] p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="app-text-primary text-2xl font-bold">
            {medication.name ?? `Medication #${medication.medicationId}`}
          </p>
          <p className="app-text-secondary mt-2 text-sm">{descriptor}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
            medication.status === "active"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-200 text-slate-700"
          }`}
        >
          {medication.status}
        </span>
      </div>

      <p className="app-text-secondary mt-4 text-sm leading-6">
        {medication.instruction ||
          "Open your doctor notification if you need a clarification on how to take this medication."}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Adherence", value: `${medication.adherence?.adherenceRate ?? 0}%` },
          { label: "Taken", value: `${medication.adherence?.takenCount ?? 0}` },
          { label: "Missed", value: `${medication.adherence?.missedCount ?? 0}` },
          { label: "Scheduled", value: `${medication.adherence?.scheduledCount ?? 0}` },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl bg-[var(--surface-muted)]/70 p-4">
            <p className="app-text-secondary text-xs font-semibold tracking-[0.14em] uppercase">
              {item.label}
            </p>
            <p className="app-text-primary mt-2 text-xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          variant="primary"
          className="px-4 py-2.5"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          onClick={() => void onLog("taken")}
        >
          Mark as Taken
        </Button>
        <Button
          variant="warning"
          className="px-4 py-2.5"
          disabled={isSubmitting}
          onClick={() => void onLog("missed")}
        >
          Mark as Missed
        </Button>
      </div>

      <div className="mt-6">
        <p className="app-text-secondary text-xs font-semibold tracking-[0.14em] uppercase">
          Recent Check-ins
        </p>
        <div className="mt-3 space-y-3">
          {medication.recentLogs?.length ? (
            medication.recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] px-4 py-3"
              >
                <span className="app-text-primary text-sm font-medium capitalize">
                  {log.status}
                </span>
                <span className="app-text-secondary text-sm">
                  {formatCalendarDateTime(log.takenAt, "Pending")}
                </span>
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-[var(--surface-muted)]/55 px-4 py-3 text-sm app-text-secondary">
              No medication check-ins yet.
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
