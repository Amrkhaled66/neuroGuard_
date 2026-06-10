import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/useAuth';
import {
  createMedicationLog,
  getPatientMedicationAdherence,
} from '@/features/medication/services/medication.service';
import type {
  ActiveMedicationCardItem,
  MedicationAdherenceResponse,
  MedicationDashboard,
  MedicationLog,
  MedicationLogStatus,
  MedicationRange,
  NextDoseSummary,
  PatientMedication,
  TodayMedicationSummary,
  TodayScheduleItem,
} from '@/features/medication/types/medication.types';

export const medicationQueryKeys = {
  medications: (patientId: number) => ['patient', patientId, 'medications'] as const,
  adherence: (patientId: number, days: MedicationRange) =>
    ['patient', patientId, 'medications', 'adherence', days] as const,
};

type ScheduleDraft = TodayScheduleItem & {
  sortMinutes: number;
};

function getLocalDateKey(value: Date | string) {
  const date = typeof value === 'string' ? new Date(value) : value;
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseMinutes(scheduledTime: string) {
  const [hourPart, minutePart] = scheduledTime.split(':');
  const hours = Number(hourPart);
  const minutes = Number(minutePart);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
}

function formatTimeLabel(scheduledTime: string) {
  const minutes = parseMinutes(scheduledTime);

  if (minutes === null) {
    return scheduledTime;
  }

  const date = new Date();
  date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function formatDateLabel(value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function getTodayLogs(logs: MedicationLog[], todayKey: string) {
  return logs.filter((log) => log.takenAt && getLocalDateKey(log.takenAt) === todayKey);
}

function getTodayStatus(logs: MedicationLog[], todayKey: string): MedicationLogStatus {
  const todayLogs = getTodayLogs(logs, todayKey);

  if (todayLogs.some((log) => log.status === 'taken')) {
    return 'taken';
  }

  if (todayLogs.some((log) => log.status === 'missed')) {
    return 'missed';
  }

  return 'scheduled';
}

function mapTodaySummary(items: PatientMedication[], todayKey: string): TodayMedicationSummary {
  const schedulableItems = items.filter(
    (item) => item.status === 'active' && Boolean(item.scheduledTime),
  );

  const totalCount = schedulableItems.length;
  const takenCount = schedulableItems.filter(
    (item) => getTodayStatus(item.logs, todayKey) === 'taken',
  ).length;
  const missedCount = schedulableItems.filter(
    (item) => getTodayStatus(item.logs, todayKey) === 'missed',
  ).length;
  const remainingCount = totalCount - takenCount - missedCount;

  return {
    takenCount,
    totalCount,
    remainingCount,
    missedCount,
    completionRatio: totalCount === 0 ? 0 : takenCount / totalCount,
  };
}

function mapTodaySchedule(items: PatientMedication[], now: Date, todayKey: string) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return items
    .filter((item) => item.status === 'active' && Boolean(item.scheduledTime))
    .map<ScheduleDraft>((item) => {
      const scheduledTime = item.scheduledTime!;
      const minutes = parseMinutes(scheduledTime) ?? 0;
      const status = getTodayStatus(item.logs, todayKey);

      return {
        id: item.id,
        medicationId: item.medicationId,
        name: item.name,
        dosage: item.dosage ?? '',
        instruction: item.instruction ?? 'No instructions provided',
        scheduledTime: formatTimeLabel(scheduledTime),
        status,
        isOverdue: status === 'scheduled' && minutes < currentMinutes,
        canMarkTaken: status === 'scheduled',
        canMarkMissed: status === 'scheduled',
        sortMinutes: minutes,
      };
    })
    .sort((left, right) => left.sortMinutes - right.sortMinutes)
    .map(({ sortMinutes: _sortMinutes, ...item }) => item);
}

function mapNextDose(schedule: TodayScheduleItem[]): NextDoseSummary | null {
  const nextToday = schedule.find((item) => item.status === 'scheduled' && !item.isOverdue);
  const overdue = schedule.find((item) => item.status === 'scheduled');
  const candidate = nextToday ?? overdue;

  if (!candidate) {
    const tomorrowSchedule = schedule[0];

    if (!tomorrowSchedule) {
      return null;
    }

    return {
      id: tomorrowSchedule.id,
      name: tomorrowSchedule.name,
      dosage: tomorrowSchedule.dosage,
      instruction: tomorrowSchedule.instruction,
      scheduledLabel: `Tomorrow, ${tomorrowSchedule.scheduledTime}`,
      isTaken: false,
      canMarkTaken: false,
    };
  }

  return {
    id: candidate.id,
    name: candidate.name,
    dosage: candidate.dosage,
    instruction: candidate.instruction,
    scheduledLabel: `Today, ${candidate.scheduledTime}`,
    isTaken: false,
    canMarkTaken: true,
  };
}

function mapActiveMedications(items: PatientMedication[]): ActiveMedicationCardItem[] {
  return items
    .filter((item) => item.status === 'active')
    .map((item) => ({
      id: item.id,
      name: item.name,
      dosage: item.dosage ?? 'No dosage',
      frequency: item.frequency ?? 'No frequency provided',
      instruction: item.instruction ?? 'No instructions provided',
      scheduledTimeLabel: item.scheduledTime ? formatTimeLabel(item.scheduledTime) : null,
      startDateLabel: formatDateLabel(item.startDate),
      endDateLabel: formatDateLabel(item.endDate),
      status: item.status,
      adherence: item.adherence,
      recentLogs: item.recentLogs.slice(0, 3),
    }));
}

function mapDashboard(
  payload: MedicationAdherenceResponse,
  selectedRange: MedicationRange,
): MedicationDashboard {
  const now = new Date();
  const todayKey = getLocalDateKey(now);
  const todaySchedule = mapTodaySchedule(payload.items, now, todayKey);

  return {
    selectedRange,
    adherenceSummary: payload.summary,
    todaySummary: mapTodaySummary(payload.items, todayKey),
    nextDose: mapNextDose(todaySchedule),
    todaySchedule,
    activeMedications: mapActiveMedications(payload.items),
  };
}

export function useMedicationDashboard() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const [selectedRange, setSelectedRange] = useState<MedicationRange>(7);
  const patientId = Number(session?.user.id ?? 0);
  const hasPatientId = Number.isFinite(patientId) && patientId > 0;

  const adherenceQuery = useQuery({
    queryKey: medicationQueryKeys.adherence(patientId, selectedRange),
    queryFn: () => getPatientMedicationAdherence(patientId, selectedRange),
    enabled: hasPatientId,
  });

  const logMutation = useMutation({
    mutationFn: ({
      medId,
      status,
    }: {
      medId: number;
      status: Extract<MedicationLogStatus, 'taken' | 'missed'>;
    }) => createMedicationLog(patientId, medId, status),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: medicationQueryKeys.adherence(patientId, selectedRange),
        }),
        queryClient.invalidateQueries({
          queryKey: medicationQueryKeys.medications(patientId),
        }),
      ]);
    },
  });

  const dashboard = useMemo(() => {
    if (!adherenceQuery.data) {
      return null;
    }

    return mapDashboard(adherenceQuery.data, selectedRange);
  }, [adherenceQuery.data, selectedRange]);

  async function markDose(medId: number, status: Extract<MedicationLogStatus, 'taken' | 'missed'>) {
    await logMutation.mutateAsync({ medId, status });
  }

  async function refetchAll() {
    await adherenceQuery.refetch();
  }

  return {
    dashboard,
    selectedRange,
    setSelectedRange,
    isLoading: adherenceQuery.isLoading || (!hasPatientId && !adherenceQuery.data),
    isError: !hasPatientId || adherenceQuery.isError,
    error: !hasPatientId
      ? new Error('Patient session is unavailable.')
      : adherenceQuery.error ?? null,
    isSubmitting: logMutation.isPending,
    activeMutationId: logMutation.variables?.medId ?? null,
    markDoseTaken: (medId: number) => markDose(medId, 'taken'),
    markDoseMissed: (medId: number) => markDose(medId, 'missed'),
    refetchAll,
  };
}
