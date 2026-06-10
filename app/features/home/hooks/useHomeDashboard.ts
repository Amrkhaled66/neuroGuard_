import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/useAuth';
import {
  createMedicationLog,
  getPatientOverview,
  getPatientSessions,
  type PatientOverviewResponse,
  type PatientSessionResponse,
} from '@/features/home/services/home.service';
import type { HomeSummary } from '@/features/home/types/home.types';

export const homeQueryKeys = {
  overview: ['patient', 'overview'] as const,
  sessions: (patientId: number) => ['patient', patientId, 'sessions'] as const,
};

function getGreeting(fullName: string) {
  const hour = new Date().getHours();
  const firstName = fullName.trim().split(/\s+/)[0] || 'Patient';

  if (hour < 12) {
    return `Good morning, ${firstName}`;
  }

  if (hour < 18) {
    return `Good afternoon, ${firstName}`;
  }

  return `Good evening, ${firstName}`;
}

function getInitials(fullName: string) {
  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (!parts.length) {
    return 'P';
  }

  return parts.map((part) => part.charAt(0).toUpperCase()).join('');
}

function formatSessionDate(value: string | null) {
  if (!value) {
    return 'No sessions uploaded yet';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function normalizeSessionStatus(status: string) {
  if (status === 'analyzed') {
    return 'Reviewed';
  }

  if (status === 'processing') {
    return 'Processing';
  }

  if (status === 'failed') {
    return 'Failed';
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDurationLabel(duration: number) {
  return `${duration} min`;
}

function mapSummary(
  overview: PatientOverviewResponse,
  latestSession: PatientSessionResponse | null,
): HomeSummary {
  return {
    greeting: getGreeting(overview.patient.fullName),
    subtitle: "Here's your health summary for today",
    patientInitials: getInitials(overview.patient.fullName),
    nextMedication: overview.nextMedication
      ? {
          id: overview.nextMedication.id,
          name: overview.nextMedication.name,
          dosage: overview.nextMedication.dosage ?? '',
          scheduledLabel:
            overview.nextMedication.nextDoseLabel ?? 'No upcoming medication scheduled',
          instruction: overview.nextMedication.instruction ?? 'No instructions provided',
          isTaken: Boolean(overview.nextMedication.isTakenToday),
          canMarkTaken: !(overview.nextMedication.nextDoseLabel?.startsWith('Tomorrow')),
        }
      : null,
    todayProgress: overview.todayProgress,
    latestSession: latestSession
      ? {
          id: latestSession.id,
          dateLabel: formatSessionDate(latestSession.createdAt),
          status: normalizeSessionStatus(latestSession.status),
          durationLabel: formatDurationLabel(latestSession.duration),
          eventCount: latestSession.seizureCount,
        }
      : null,
    recentUpdate: overview.recentAlerts[0]
      ? {
          id: overview.recentAlerts[0].id,
          title: overview.recentAlerts[0].title || 'Recent Update',
          message: overview.recentAlerts[0].message,
        }
      : null,
  };
}

export function useHomeDashboard() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const patientId = Number(session?.user.id ?? 0);

  const overviewQuery = useQuery({
    queryKey: homeQueryKeys.overview,
    queryFn: () => getPatientOverview(),
  });

  const sessionsQuery = useQuery({
    queryKey: homeQueryKeys.sessions(patientId),
    queryFn: () => getPatientSessions(patientId),
    enabled: !!patientId,
  });

  const markTakenMutation = useMutation({
    mutationFn: ({ medId }: { medId: number }) => createMedicationLog(patientId, medId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: homeQueryKeys.overview });
    },
  });

  const summary = useMemo(() => {
    if (!overviewQuery.data) {
      return null;
    }

    return mapSummary(overviewQuery.data, sessionsQuery.data?.[0] ?? null);
  }, [overviewQuery.data, sessionsQuery.data]);

  async function markMedicationTaken() {
    if (!summary?.nextMedication?.id || !summary.nextMedication.canMarkTaken) {
      return;
    }

    await markTakenMutation.mutateAsync({ medId: summary.nextMedication.id });
  }

  async function refetchAll() {
    await Promise.all([overviewQuery.refetch(), sessionsQuery.refetch()]);
  }

  return {
    summary,
    isLoading: overviewQuery.isLoading || sessionsQuery.isLoading,
    isError: overviewQuery.isError || sessionsQuery.isError,
    error: overviewQuery.error ?? sessionsQuery.error ?? null,
    isMarkingTaken: markTakenMutation.isPending,
    markMedicationTaken,
    refetchAll,
  };
}
