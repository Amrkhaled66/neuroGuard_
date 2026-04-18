export type SessionStatus = "analyzed" | "processing" | "failed";

export type SessionHistory = {
  id: string;
  date: string;
  duration: string;
  channels: number;
  seizures: number;
  status: SessionStatus;
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

export const sessions: SessionHistory[] = [
  {
    id: "1",
    date: "2024-12-03",
    duration: "2h 15m",
    channels: 21,
    seizures: 2,
    status: "analyzed",
  },
  {
    id: "2",
    date: "2024-12-01",
    duration: "4h 30m",
    channels: 21,
    seizures: 0,
    status: "analyzed",
  },
  {
    id: "3",
    date: "2024-11-28",
    duration: "1h 45m",
    channels: 21,
    seizures: 1,
    status: "analyzed",
  },
  {
    id: "4",
    date: "2024-11-25",
    duration: "3h 00m",
    channels: 21,
    seizures: 0,
    status: "analyzed",
  },
  {
    id: "5",
    date: "2024-11-20",
    duration: "2h 30m",
    channels: 21,
    seizures: 3,
    status: "analyzed",
  },
];
