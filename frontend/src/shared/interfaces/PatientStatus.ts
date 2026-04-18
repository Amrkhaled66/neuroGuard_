export type PatientStatus = "monitoring" | "critical" | "stable";

export const patientStatuses: PatientStatus[] = [
  "stable",
  "monitoring",
  "critical",
];

const statusMap: Record<
  PatientStatus,
  { label: string; dotClass: string; textClass: string }
> = {
  stable: {
    label: "Stable",
    dotClass: "bg-green-700",
    textClass: "text-green-600",
  },
  monitoring: {
    label: "Monitoring",
    dotClass: "bg-amber-700",
    textClass: "text-amber-600",
  },
  critical: {
    label: "Critical",
    dotClass: "bg-red-700",
    textClass: "text-red-600",
  },
};

export default statusMap;
