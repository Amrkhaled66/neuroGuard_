import { axiosPrivate } from '@/shared/lib/axios';

export type PatientOverviewResponse = {
  patient: {
    id: number;
    fullName: string;
    medicalId: string;
    age: number;
    status: 'stable' | 'monitoring' | 'critical';
    physician: string;
  };
  stats: {
    totalSeizures: number;
    activeMedications: number;
    unreadNotifications: number;
    lastSessionDate: string | null;
  };
  seizureTrend: {
    date: string;
    seizureCount: number;
  }[];
  medicationAdherence: {
    takenCount: number;
    missedCount: number;
    scheduledCount: number;
    adherenceRate: number;
  };
  todayProgress: {
    takenCount: number;
    totalCount: number;
    remainingCount: number;
    completionRatio: number;
  };
  recentAlerts: {
    id: number;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string | null;
  }[];
  latestSeizureInsight: {
    title: string;
    description: string;
  };
  nextMedication: {
    id: number;
    name: string;
    dosage?: string | null;
    instruction?: string | null;
    scheduledTime?: string | null;
    nextDoseAt?: string | null;
    nextDoseLabel?: string | null;
    isTakenToday?: boolean;
  } | null;
  monitoringSummary: {
    sessionCount: number;
    analyzedSessions: number;
    totalMonitoringTime: string;
    latestSessionStatus: string | null;
  };
};

export type PatientSessionResponse = {
  id: number;
  patientId: number;
  filePath: string | null;
  duration: number;
  status: string;
  note: string | null;
  channelCount: number;
  createdAt: string | null;
  updatedAt: string | null;
  seizureCount: number;
};

export function getPatientOverview() {
  return axiosPrivate.get<PatientOverviewResponse, PatientOverviewResponse>(
    '/patients/me/overview',
  );
}

export function getPatientSessions(patientId: number) {
  return axiosPrivate.get<PatientSessionResponse[], PatientSessionResponse[]>(
    `/sessions/patient/${patientId}`,
  );
}

export function createMedicationLog(patientId: number, medId: number) {
  return axiosPrivate.post(
    `/patients/${patientId}/medications/${medId}/logs`,
    {
      status: 'taken',
      takenAt: new Date().toISOString(),
    },
  );
}
