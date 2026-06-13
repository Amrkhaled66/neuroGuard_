import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/useAuth';
import { getPatientSessions } from '@/features/sessions/services/sessions.service';
import type {
  PatientSessionListItemResponse,
  SessionCardItem,
  SessionDateFilter,
} from '@/features/sessions/types/sessions.types';

export const sessionsQueryKeys = {
  list: (patientId: number) => ['patient', patientId, 'sessions'] as const,
  details: (patientId: number, sessionId: number) =>
    ['patient', patientId, 'sessions', sessionId] as const,
};

function formatReviewedDate(value: string | null) {
  if (!value) {
    return 'Unknown review date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function formatDuration(minutes: number) {
  const safeMinutes = Math.max(0, Math.round(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const remainingMinutes = safeMinutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

function toPreview(note: string | null) {
  if (!note) {
    return null;
  }

  const normalized = note.replace(/\s+/g, ' ').trim();
  if (normalized.length <= 88) {
    return normalized;
  }

  return `${normalized.slice(0, 85).trimEnd()}...`;
}

function isWithinFilter(createdAt: string | null, filter: SessionDateFilter) {
  if (filter === 'all') {
    return true;
  }

  if (!createdAt) {
    return false;
  }

  const created = new Date(createdAt);
  const now = new Date();
  const threshold = new Date(now);
  threshold.setHours(0, 0, 0, 0);
  threshold.setDate(threshold.getDate() - (filter - 1));

  return created >= threshold;
}

function mapCardItems(
  items: PatientSessionListItemResponse[],
  filter: SessionDateFilter,
): SessionCardItem[] {
  return items
    .filter((item) => item.status === 'analyzed')
    .filter((item) => isWithinFilter(item.createdAt, filter))
    .sort((left, right) => {
      const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : 0;
      const rightTime = right.createdAt ? new Date(right.createdAt).getTime() : 0;
      return rightTime - leftTime;
    })
    .map((item) => ({
      id: item.id,
      reviewedDateLabel: formatReviewedDate(item.createdAt),
      durationLabel: formatDuration(item.duration),
      eventCountLabel:
        item.seizureCount === 0
          ? 'No detected events'
          : `${item.seizureCount} detected event${item.seizureCount === 1 ? '' : 's'}`,
      notePreview: toPreview(item.note),
      statusLabel: 'Reviewed',
      createdAt: item.createdAt,
    }));
}

type UseSessionsListResult = {
  items: SessionCardItem[];
  totalAnalyzedCount: number;
  selectedFilter: SessionDateFilter;
  setSelectedFilter: (filter: SessionDateFilter) => void;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetchAll: () => Promise<void>;
};

export function useSessionsList(): UseSessionsListResult {
  const { session } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<SessionDateFilter>(30);
  const patientId = Number(session?.user.id ?? 0);
  const hasPatientId = Number.isFinite(patientId) && patientId > 0;

  const sessionsQuery = useQuery({
    queryKey: sessionsQueryKeys.list(patientId),
    queryFn: () => getPatientSessions(patientId),
    enabled: hasPatientId,
  });

  const items = useMemo(
    () => mapCardItems(sessionsQuery.data ?? [], selectedFilter),
    [sessionsQuery.data, selectedFilter],
  );

  const totalAnalyzedCount = useMemo(
    () => (sessionsQuery.data ?? []).filter((item) => item.status === 'analyzed').length,
    [sessionsQuery.data],
  );

  return {
    items,
    totalAnalyzedCount,
    selectedFilter,
    setSelectedFilter,
    isLoading: sessionsQuery.isLoading || (!hasPatientId && !sessionsQuery.data),
    isError: !hasPatientId || sessionsQuery.isError,
    error: !hasPatientId
      ? new Error('Patient session is unavailable.')
      : sessionsQuery.error ?? null,
    refetchAll: async () => {
      await sessionsQuery.refetch();
    },
  };
}
