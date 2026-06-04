import type { PatientStatus } from "@/shared/interfaces/PatientStatus";
import { formatTrendLabel } from "@/features/doctor/patients/seizures";

export type DoctorDashboardTrendPoint = {
  date: string;
  seizureCount: number;
};

export type DoctorDashboardCriticalPatient = {
  id: number;
  name: string;
  medicalId: string;
  status: PatientStatus;
  lastSessionDate: string | null;
  seizureCountInRange: number;
};

export type DoctorDashboardResponse = {
  summary: {
    totalPatients: number;
    activeSessions: number;
    eegFiles: number;
    criticalAlerts: number;
    dailyFrequency: number;
    lastDetectionTime: string | null;
    criticalPatientsCount: number;
  };
  trend: DoctorDashboardTrendPoint[];
  criticalPatients: DoctorDashboardCriticalPatient[];
};

export function formatDashboardDateTime(value: string | null) {
  if (!value) {
    return "No detections";
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}

export function formatDashboardLastSession(value: string | null) {
  if (!value) {
    return "No sessions yet";
  }

  return formatDashboardDateTime(value);
}

export { formatTrendLabel };
