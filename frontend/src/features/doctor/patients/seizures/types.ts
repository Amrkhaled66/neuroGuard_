import type { ReactNode } from "react";

export type SummaryCardItem = {
  title: string;
  value: string;
  subtitle: string;
};

export type PatternCardItem = {
  title: string;
  subtitle: string;
  icon: ReactNode;
};

export type IntensityDistribution = {
  high: number;
  med: number;
  low: number;
};

export type SeizureSummary = {
  totalSeizures: number;
  avgDurationSeconds: number;
  sessionsWithSeizures: number;
  maxDailySeizures: number;
  analyzedSessions: number;
  processingSessions: number;
  failedSessions: number;
};

export type SeizureTrendPoint = {
  date: string;
  seizureCount: number;
};

export type BusiestSessionPattern = {
  sessionId: number;
  fileName: string;
  seizureCount: number;
  sessionDate: string | null;
} | null;

export type LongestEventPattern = {
  eventId: number;
  durationSeconds: number;
  sessionId: number;
  fileName: string;
  sessionDate: string | null;
} | null;

export type SeizureEventRow = {
  eventId: number;
  sessionId: number;
  sessionDate: string | null;
  fileName: string;
  startTimeSeconds: number;
  endTimeSeconds: number;
  durationSeconds: number;
};

export type SeizureAnalyticsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type SeizureAnalyticsResponse = {
  summary: SeizureSummary;
  trend: SeizureTrendPoint[];
  patterns: {
    busiestSession: BusiestSessionPattern;
    longestEvent: LongestEventPattern;
  };
  durationDistribution: IntensityDistribution;
  recentEvents: SeizureEventRow[];
  pagination: SeizureAnalyticsPagination;
};

export function formatDurationFromSeconds(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatOffsetSeconds(totalSeconds: number) {
  return `${Math.max(0, Math.round(totalSeconds))}s`;
}

export function formatDateTime(value: string | null) {
  if (!value) {
    return "Unknown";
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

export function formatTrendLabel(value: string) {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(parsedDate);
}
