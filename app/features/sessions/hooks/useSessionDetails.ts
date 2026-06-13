import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/useAuth';
import { sessionsQueryKeys } from '@/features/sessions/hooks/useSessionsList';
import { getPatientSessionDetails } from '@/features/sessions/services/sessions.service';
import type {
  PatientSessionDetailsResponse,
  SessionDetailsViewModel,
} from '@/features/sessions/types/sessions.types';

function formatReviewedDate(value: string | null) {
  if (!value) {
    return 'Unknown review date';
  }

  const date = new Date(value);
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return `${monthNames[date.getMonth()] ?? 'January'} ${date.getDate()}, ${date.getFullYear()}`;
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

function formatOffset(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}:${`${minutes}`.padStart(2, '0')}:${`${seconds}`.padStart(2, '0')}`;
  }

  return `${minutes}:${`${seconds}`.padStart(2, '0')}`;
}

function formatEventDuration(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.round(totalSeconds));

  if (safeSeconds < 60) {
    return `${safeSeconds} sec`;
  }

  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  if (seconds === 0) {
    return `${minutes} min`;
  }

  return `${minutes} min ${seconds} sec`;
}

function toPercent(value: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, (value / total) * 100));
}

function mapSessionDetails(payload: PatientSessionDetailsResponse): SessionDetailsViewModel {
  const { session, events } = payload;
  const hasDetectedEvents = session.seizureCount > 0;
  const firstDetectedStart =
    events.length === 0 ? null : Math.min(...events.map((event) => event.startTimeSeconds));
  const sessionDurationSeconds = Math.max(1, Math.round(session.duration * 60));

  return {
    id: session.id,
    reviewedDateLabel: formatReviewedDate(session.createdAt),
    durationLabel: formatDuration(session.duration),
    statusLabel: 'Reviewed',
    eventCountLabel: hasDetectedEvents
      ? `${session.seizureCount} detected event${session.seizureCount === 1 ? '' : 's'}`
      : 'No detected events',
    hasDetectedEvents,
    detectionTitle: hasDetectedEvents
      ? `${session.seizureCount} seizure event${session.seizureCount === 1 ? '' : 's'} detected`
      : 'No seizure events detected',
    detectionDescription: hasDetectedEvents
      ? 'Detected events are shown below in the order they appeared during the recording.'
      : 'This reviewed recording did not include detected seizure activity.',
    note: session.note,
    channelCountLabel: `${session.channelCount} channel${session.channelCount === 1 ? '' : 's'}`,
    metrics: [
      { label: 'Duration', value: formatDuration(session.duration) },
      { label: 'Detected', value: String(session.seizureCount) },
      {
        label: 'First Event',
        value: firstDetectedStart === null ? 'None' : formatOffset(firstDetectedStart),
      },
    ],
    durationMix: [
      {
        label: 'Under 1 min',
        count: events.filter((event) => event.durationSeconds < 60).length,
        color: '#006044',
      },
      {
        label: '1-3 min',
        count: events.filter(
          (event) => event.durationSeconds >= 60 && event.durationSeconds <= 180,
        ).length,
        color: '#7bdab2',
      },
      {
        label: 'Over 3 min',
        count: events.filter((event) => event.durationSeconds > 180).length,
        color: 'rgba(123, 218, 178, 0.4)',
      },
    ],
    recordingSpread: events.map((event) => ({
      id: event.id,
      startPercent: toPercent(event.startTimeSeconds, sessionDurationSeconds),
      widthPercent: Math.max(2, toPercent(event.durationSeconds, sessionDurationSeconds)),
      startLabel: formatOffset(event.startTimeSeconds),
    })),
    events: events.map((event) => ({
      id: event.id,
      recordingStartLabel: formatOffset(event.startTimeSeconds),
      eventDurationLabel: formatEventDuration(event.durationSeconds),
      onsetSummary:
        event.onsetSide || event.onsetRegion
          ? [event.onsetSide, event.onsetRegion].filter(Boolean).join(' • ')
          : null,
      startPercent: toPercent(event.startTimeSeconds, sessionDurationSeconds),
      endPercent: toPercent(event.endTimeSeconds, sessionDurationSeconds),
    })),
  };
}

type UseSessionDetailsResult = {
  details: SessionDetailsViewModel | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetchAll: () => Promise<void>;
};

export function useSessionDetails(sessionId: number): UseSessionDetailsResult {
  const { session } = useAuth();
  const patientId = Number(session?.user.id ?? 0);
  const hasPatientId = Number.isFinite(patientId) && patientId > 0;
  const hasSessionId = Number.isFinite(sessionId) && sessionId > 0;

  const detailsQuery = useQuery({
    queryKey: sessionsQueryKeys.details(patientId, sessionId),
    queryFn: () => getPatientSessionDetails(patientId, sessionId),
    enabled: hasPatientId && hasSessionId,
  });

  const details = useMemo(() => {
    if (!detailsQuery.data) {
      return null;
    }

    return mapSessionDetails(detailsQuery.data);
  }, [detailsQuery.data]);

  return {
    details,
    isLoading:
      detailsQuery.isLoading || ((!hasPatientId || !hasSessionId) && !detailsQuery.data),
    isError: !hasPatientId || !hasSessionId || detailsQuery.isError,
    error:
      !hasPatientId || !hasSessionId
        ? new Error('Session details are unavailable.')
        : detailsQuery.error ?? null,
    refetchAll: async () => {
      await detailsQuery.refetch();
    },
  };
}
