import { axiosPrivate } from "@/shared/lib/axios";

export type PatientOverviewResponse = {
  patient: {
    id: number;
    fullName: string;
    medicalId: string;
    age: number;
    status: "stable" | "monitoring" | "critical";
    physician: string;
  };
  stats: {
    totalSeizures: number;
    activeMedications: number;
    unreadNotifications: number;
    lastSessionDate: string | null;
  };
  seizureTrend: Array<{
    date: string;
    seizureCount: number;
  }>;
  medicationAdherence: {
    takenCount: number;
    missedCount: number;
    scheduledCount: number;
    adherenceRate: number;
  };
  recentAlerts: Array<{
    id: number;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string | null;
  }>;
  latestSeizureInsight: {
    title: string;
    description: string;
  };
  nextMedication: {
    id: number;
    name: string;
    dosage?: string | null;
    instruction?: string | null;
  } | null;
  monitoringSummary: {
    sessionCount: number;
    analyzedSessions: number;
    totalMonitoringTime: string;
    latestSessionStatus: string | null;
  };
};

export function getPatientOverview() {
  return axiosPrivate.get<PatientOverviewResponse, PatientOverviewResponse>(
    "/patients/me/overview",
  );
}
