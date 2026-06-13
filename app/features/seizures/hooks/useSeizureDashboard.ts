import { useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/useAuth';
import { getPatientSeizureAnalytics } from '@/features/seizures/services/seizures.service';
import type {
  DurationDistributionItem,
  RecentSeizureEventItem,
  SeizureAnalyticsResponse,
  SeizureDashboard,
  SeizurePatternInsight,
  SeizureRange,
  SeizureTrendPoint,
} from '@/features/seizures/types/seizures.types';

const EVENTS_PAGE_SIZE = 10;

export const seizureQueryKeys = {
  analytics: (patientId: number, days: SeizureRange) =>
    ['patient', patientId, 'seizures', 'analytics', days] as const,
};

function formatDurationLabel(totalSeconds: number) {
  if (totalSeconds <= 0) {
    return '0 sec';
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} hr`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} min`);
  }

  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds} sec`);
  }

  return parts.join(' ');
}

function formatRecordingTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}:${`${minutes}`.padStart(2, '0')}:${`${seconds}`.padStart(2, '0')}`;
  }

  return `${minutes}:${`${seconds}`.padStart(2, '0')}`;
}

function formatSessionDateLabel(value: string | null) {
  if (!value) {
    return 'Unknown session date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function formatTrendDateLabel(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

function buildTrendMessage(trend: SeizureAnalyticsResponse['trend']) {
  const totalEvents = trend.reduce((sum, item) => sum + item.seizureCount, 0);

  if (totalEvents === 0) {
    return 'No detected seizure activity in this time range.';
  }

  const activeDays = trend.filter((item) => item.seizureCount > 0).length;

  if (activeDays <= 2) {
    return 'Most detected events were concentrated on a few days.';
  }

  return 'Detected events were spread across multiple days in this period.';
}

function mapPatternInsights(payload: SeizureAnalyticsResponse): SeizurePatternInsight[] {
  const insights: SeizurePatternInsight[] = [];

  if (payload.patterns.busiestSession) {
    insights.push({
      title: 'Busiest Session',
      value: `${payload.patterns.busiestSession.seizureCount} detected`,
      subtitle: formatSessionDateLabel(payload.patterns.busiestSession.sessionDate),
    });
  }

  if (payload.patterns.longestEvent) {
    insights.push({
      title: 'Longest Event',
      value: formatDurationLabel(payload.patterns.longestEvent.durationSeconds),
      subtitle: formatSessionDateLabel(payload.patterns.longestEvent.sessionDate),
    });
  }

  return insights;
}

function mapDurationDistribution(
  distribution: SeizureAnalyticsResponse['durationDistribution'],
): DurationDistributionItem[] {
  return [
    { label: 'Under 1 min', count: distribution.low },
    { label: '1–3 min', count: distribution.med },
    { label: 'Over 3 min', count: distribution.high },
  ];
}

function mapRecentEvents(pages: SeizureAnalyticsResponse[]): RecentSeizureEventItem[] {
  return pages.flatMap((page) =>
    page.recentEvents.map((event) => ({
      id: event.eventId,
      sessionId: event.sessionId,
      sessionDateLabel: formatSessionDateLabel(event.sessionDate),
      recordingStartLabel: formatRecordingTime(event.startTimeSeconds),
      durationLabel: formatDurationLabel(event.durationSeconds),
      fileName: event.fileName,
    })),
  );
}

function mapDashboard(
  pages: SeizureAnalyticsResponse[],
  selectedRange: SeizureRange,
): SeizureDashboard {
  const firstPage = pages[0];
  const trend: SeizureTrendPoint[] = firstPage.trend.map((item) => ({
    date: item.date,
    seizureCount: item.seizureCount,
    dateLabel: formatTrendDateLabel(item.date),
  }));

  return {
    selectedRange,
    summary: {
      totalSeizures: firstPage.summary.totalSeizures,
      sessionsWithSeizures: firstPage.summary.sessionsWithSeizures,
      avgDurationLabel: formatDurationLabel(firstPage.summary.avgDurationSeconds),
      maxDailySeizures: firstPage.summary.maxDailySeizures,
    },
    trend,
    trendMessage: buildTrendMessage(firstPage.trend),
    patternInsights: mapPatternInsights(firstPage),
    durationDistribution: mapDurationDistribution(firstPage.durationDistribution),
    recentEvents: mapRecentEvents(pages),
    sessionStatus: {
      processingSessions: firstPage.summary.processingSessions,
      failedSessions: firstPage.summary.failedSessions,
      analyzedSessions: firstPage.summary.analyzedSessions,
    },
    hasAnyEvents: firstPage.summary.totalSeizures > 0,
    pagination: firstPage.pagination,
  };
}

export function useSeizureDashboard() {
  const { session } = useAuth();
  const [selectedRange, setSelectedRange] = useState<SeizureRange>(90);
  const patientId = Number(session?.user.id ?? 0);
  const hasPatientId = Number.isFinite(patientId) && patientId > 0;

  const analyticsQuery = useInfiniteQuery({
    queryKey: seizureQueryKeys.analytics(patientId, selectedRange),
    queryFn: ({ pageParam = 1 }) =>
      getPatientSeizureAnalytics(patientId, selectedRange, pageParam, EVENTS_PAGE_SIZE),
    enabled: hasPatientId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page >= lastPage.pagination.totalPages) {
        return undefined;
      }

      return lastPage.pagination.page + 1;
    },
  });

  const dashboard = useMemo(() => {
    if (!analyticsQuery.data?.pages.length) {
      return null;
    }

    return mapDashboard(analyticsQuery.data.pages, selectedRange);
  }, [analyticsQuery.data, selectedRange]);

  return {
    dashboard,
    selectedRange,
    setSelectedRange,
    isLoading: analyticsQuery.isLoading || (!hasPatientId && !analyticsQuery.data),
    isError: !hasPatientId || analyticsQuery.isError,
    error: !hasPatientId
      ? new Error('Patient session is unavailable.')
      : analyticsQuery.error ?? null,
    isLoadingMore: analyticsQuery.isFetchingNextPage,
    hasNextPage: analyticsQuery.hasNextPage ?? false,
    loadMore: async () => {
      if (!analyticsQuery.hasNextPage || analyticsQuery.isFetchingNextPage) {
        return;
      }

      await analyticsQuery.fetchNextPage();
    },
    refetchAll: async () => {
      await analyticsQuery.refetch();
    },
  };
}
