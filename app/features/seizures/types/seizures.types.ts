export type SeizureRange = 30 | 90 | 180;

export type SeizureAnalyticsResponse = {
  summary: {
    totalSeizures: number;
    avgDurationSeconds: number;
    sessionsWithSeizures: number;
    maxDailySeizures: number;
    analyzedSessions: number;
    processingSessions: number;
    failedSessions: number;
  };
  trend: {
    date: string;
    seizureCount: number;
  }[];
  patterns: {
    busiestSession: {
      sessionId: number;
      fileName: string;
      seizureCount: number;
      sessionDate: string | null;
    } | null;
    longestEvent: {
      eventId: number;
      durationSeconds: number;
      sessionId: number;
      fileName: string;
      sessionDate: string | null;
    } | null;
  };
  durationDistribution: {
    high: number;
    med: number;
    low: number;
  };
  recentEvents: {
    eventId: number;
    sessionId: number;
    sessionDate: string | null;
    fileName: string;
    startTimeSeconds: number;
    endTimeSeconds: number;
    durationSeconds: number;
  }[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type SeizureSummaryCardData = {
  totalSeizures: number;
  sessionsWithSeizures: number;
  avgDurationLabel: string;
  maxDailySeizures: number;
};

export type SeizureTrendPoint = {
  date: string;
  seizureCount: number;
  dateLabel: string;
};

export type SeizurePatternInsight = {
  title: string;
  value: string;
  subtitle: string;
};

export type DurationDistributionItem = {
  label: string;
  count: number;
};

export type RecentSeizureEventItem = {
  id: number;
  sessionId: number;
  sessionDateLabel: string;
  recordingStartLabel: string;
  durationLabel: string;
  fileName: string;
};

export type SessionAnalysisStatus = {
  processingSessions: number;
  failedSessions: number;
  analyzedSessions: number;
};

export type SeizureDashboard = {
  selectedRange: SeizureRange;
  summary: SeizureSummaryCardData;
  trend: SeizureTrendPoint[];
  trendMessage: string;
  patternInsights: SeizurePatternInsight[];
  durationDistribution: DurationDistributionItem[];
  recentEvents: RecentSeizureEventItem[];
  sessionStatus: SessionAnalysisStatus;
  hasAnyEvents: boolean;
  pagination: SeizureAnalyticsResponse['pagination'];
};
