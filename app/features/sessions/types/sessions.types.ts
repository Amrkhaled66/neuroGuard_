export type SessionStatus = 'processing' | 'analyzed' | 'failed' | string;

export type PatientSessionListItemResponse = {
  id: number;
  patientId: number;
  filePath: string | null;
  duration: number;
  status: SessionStatus;
  note: string | null;
  channelCount: number;
  createdAt: string | null;
  updatedAt: string | null;
  seizureCount: number;
};

export type PatientSessionEventResponse = {
  id: number;
  startTimeSeconds: number;
  endTimeSeconds: number;
  durationSeconds: number;
  onsetSide: string | null;
  onsetRegion: string | null;
};

export type PatientSessionDetailsResponse = {
  session: {
    id: number;
    duration: number;
    status: SessionStatus;
    note: string | null;
    channelCount: number;
    createdAt: string | null;
    updatedAt: string | null;
    seizureCount: number;
  };
  events: PatientSessionEventResponse[];
};

export type SessionDateFilter = 30 | 90 | 'all';

export type SessionCardItem = {
  id: number;
  reviewedDateLabel: string;
  durationLabel: string;
  eventCountLabel: string;
  notePreview: string | null;
  statusLabel: string;
  createdAt: string | null;
};

export type SessionEventItem = {
  id: number;
  recordingStartLabel: string;
  eventDurationLabel: string;
  onsetSummary: string | null;
  startPercent: number;
  endPercent: number;
};

export type SessionMetricItem = {
  label: string;
  value: string;
};

export type SessionDurationMixItem = {
  label: string;
  count: number;
  color: string;
};

export type SessionEventDurationChartItem = {
  label: string;
  value: number;
};

export type SessionRecordingSpreadItem = {
  id: number;
  startPercent: number;
  widthPercent: number;
  startLabel: string;
};

export type SessionDetailsViewModel = {
  id: number;
  reviewedDateLabel: string;
  durationLabel: string;
  statusLabel: string;
  eventCountLabel: string;
  hasDetectedEvents: boolean;
  detectionTitle: string;
  detectionDescription: string;
  note: string | null;
  channelCountLabel: string;
  metrics: SessionMetricItem[];
  durationMix: SessionDurationMixItem[];
  recordingSpread: SessionRecordingSpreadItem[];
  events: SessionEventItem[];
};
