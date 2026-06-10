export type MedicationLogStatus = 'scheduled' | 'taken' | 'missed';
export type PatientMedicationStatus = 'active' | 'discontinued';
export type MedicationRange = 7 | 30;

export type MedicationLog = {
  id: number;
  status: MedicationLogStatus;
  takenAt: string | null;
};

export type MedicationAdherence = {
  takenCount: number;
  missedCount: number;
  scheduledCount: number;
  adherenceRate: number;
};

export type PatientMedication = {
  id: number;
  patientId: number;
  medicationId: number;
  dosage: string | null;
  frequency: string | null;
  instruction: string | null;
  scheduledTime: string | null;
  startDate: string | null;
  endDate: string | null;
  status: PatientMedicationStatus;
  name: string;
  form: string | null;
  logs: MedicationLog[];
  recentLogs: MedicationLog[];
  adherence: MedicationAdherence;
};

export type MedicationAdherenceResponse = {
  summary: {
    totalMedications: number;
    activeMedications: number;
    takenCount: number;
    missedCount: number;
    scheduledCount: number;
    adherenceRate: number;
  };
  trend: {
    date: string;
    taken: number;
    missed: number;
  }[];
  items: PatientMedication[];
};

export type TodayMedicationSummary = {
  takenCount: number;
  totalCount: number;
  remainingCount: number;
  missedCount: number;
  completionRatio: number;
};

export type NextDoseSummary = {
  id: number;
  name: string;
  dosage: string;
  instruction: string;
  scheduledLabel: string;
  isTaken: boolean;
  canMarkTaken: boolean;
};

export type TodayScheduleItem = {
  id: number;
  medicationId: number;
  name: string;
  dosage: string;
  instruction: string;
  scheduledTime: string;
  status: MedicationLogStatus;
  isOverdue: boolean;
  canMarkTaken: boolean;
  canMarkMissed: boolean;
};

export type ActiveMedicationCardItem = {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  instruction: string;
  scheduledTimeLabel: string | null;
  startDateLabel: string | null;
  endDateLabel: string | null;
  status: PatientMedicationStatus;
  adherence: MedicationAdherence;
  recentLogs: MedicationLog[];
};

export type MedicationDashboard = {
  selectedRange: MedicationRange;
  adherenceSummary: MedicationAdherenceResponse['summary'];
  todaySummary: TodayMedicationSummary;
  nextDose: NextDoseSummary | null;
  todaySchedule: TodayScheduleItem[];
  activeMedications: ActiveMedicationCardItem[];
};
