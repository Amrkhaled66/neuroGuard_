export type SessionStatus = "analyzed" | "processing" | "failed";

export type PatientSession = {
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

export type SessionHistory = {
  id: number;
  date: string;
  duration: number;
  channels: number;
  seizures: number;
  status: SessionStatus;
  filePath: string | null;
  note: string | null;
};

export const sessionStatusMap: Record<
  SessionStatus,
  {
    label: string;
    textClass: string;
    bgClass: string;
  }
> = {
  analyzed: {
    label: "Analyzed",
    textClass: "text-emerald-700",
    bgClass: "bg-emerald-100",
  },
  processing: {
    label: "Processing",
    textClass: "text-amber-700",
    bgClass: "bg-amber-100",
  },
  failed: {
    label: "Failed",
    textClass: "text-red-700",
    bgClass: "bg-red-100",
  },
};

export function formatSessionDate(value: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}

export function formatSessionDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}
