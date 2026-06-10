export type HomeMedicationSummary = {
  id: number;
  name: string;
  dosage: string;
  scheduledLabel: string;
  instruction: string;
  isTaken: boolean;
  canMarkTaken: boolean;
};

export type HomeProgressSummary = {
  takenCount: number;
  totalCount: number;
  remainingCount: number;
  completionRatio: number;
};

export type HomeSessionSummary = {
  id: number;
  dateLabel: string;
  status: string;
  durationLabel: string;
  eventCount: number;
};

export type HomeUpdateSummary = {
  id: number;
  title: string;
  message: string;
};

export type HomeSummary = {
  greeting: string;
  subtitle: string;
  patientInitials: string;
  nextMedication: HomeMedicationSummary | null;
  todayProgress: HomeProgressSummary;
  latestSession: HomeSessionSummary | null;
  recentUpdate: HomeUpdateSummary | null;
};
