import { Text, View } from 'react-native';
import type {
  ActiveMedicationCardItem,
  MedicationLog,
} from '@/features/medication/types/medication.types';

type Props = {
  medication: ActiveMedicationCardItem;
};

function formatLogDate(value: string | null) {
  if (!value) {
    return 'No timestamp';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function renderRecentLog(log: MedicationLog) {
  return (
    <View key={log.id} className="flex-row items-center justify-between gap-3">
      <Text className="text-sm capitalize text-text-secondary">{log.status}</Text>
      <Text className="text-xs text-text-muted">{formatLogDate(log.takenAt)}</Text>
    </View>
  );
}

export function ActiveMedicationCard({ medication }: Props) {
  return (
    <View className="rounded-[24px] border border-border-subtle bg-surface-raised p-5 shadow-card">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-xl font-bold text-text-primary">{medication.name}</Text>
          <Text className="mt-1 text-sm font-semibold text-brand-secondary">
            {medication.dosage}
          </Text>
        </View>
        <View className="rounded-full bg-brand-primary-soft px-3 py-1">
          <Text className="text-xs font-bold capitalize text-brand-secondary">
            {medication.status}
          </Text>
        </View>
      </View>

      <View className="mt-4 gap-2">
        <Text className="text-sm text-text-secondary">{medication.frequency}</Text>
        <Text className="text-sm leading-6 text-text-secondary">{medication.instruction}</Text>
      </View>

      <View className="mt-4 flex-row flex-wrap gap-2">
        {medication.scheduledTimeLabel ? (
          <View className="rounded-full bg-app-background-soft px-3 py-2">
            <Text className="text-xs font-semibold text-text-secondary">
              Scheduled {medication.scheduledTimeLabel}
            </Text>
          </View>
        ) : null}
        {medication.startDateLabel ? (
          <View className="rounded-full bg-app-background-soft px-3 py-2">
            <Text className="text-xs font-semibold text-text-secondary">
              Starts {medication.startDateLabel}
            </Text>
          </View>
        ) : null}
        {medication.endDateLabel ? (
          <View className="rounded-full bg-app-background-soft px-3 py-2">
            <Text className="text-xs font-semibold text-text-secondary">
              Ends {medication.endDateLabel}
            </Text>
          </View>
        ) : null}
      </View>

      <View className="mt-5 flex-row gap-3">
        <View className="flex-1 rounded-[18px] bg-app-background-soft p-4">
          <Text className="text-xs font-bold uppercase tracking-[1px] text-text-muted">
            Adherence
          </Text>
          <Text className="mt-2 text-2xl font-bold text-text-primary">
            {medication.adherence.adherenceRate}%
          </Text>
        </View>

        <View className="flex-1 rounded-[18px] bg-app-background-soft p-4">
          <Text className="text-xs font-bold uppercase tracking-[1px] text-text-muted">
            Logs
          </Text>
          <Text className="mt-2 text-sm text-text-secondary">
            {medication.adherence.takenCount} taken • {medication.adherence.missedCount} missed
          </Text>
        </View>
      </View>

      <View className="mt-5 rounded-[18px] bg-app-background-soft p-4">
        <Text className="text-sm font-bold text-brand-secondary">Recent check-ins</Text>
        {medication.recentLogs.length ? (
          <View className="mt-3 gap-2">{medication.recentLogs.map(renderRecentLog)}</View>
        ) : (
          <Text className="mt-3 text-sm text-text-secondary">No recent check-ins yet.</Text>
        )}
      </View>
    </View>
  );
}
