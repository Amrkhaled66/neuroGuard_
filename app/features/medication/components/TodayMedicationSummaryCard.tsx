import { Text, View } from 'react-native';
import type { TodayMedicationSummary } from '@/features/medication/types/medication.types';

type Props = {
  summary: TodayMedicationSummary;
};

export function TodayMedicationSummaryCard({ summary }: Props) {
  const progressWidth = `${Math.max(0, Math.min(summary.completionRatio, 1)) * 100}%`;

  return (
    <View className="rounded-[24px] border border-border-subtle bg-surface-raised p-5 shadow-card">
      <Text className="text-xs font-bold uppercase tracking-[1.2px] text-brand-secondary">
        Today&apos;s Medication
      </Text>

      {summary.totalCount === 0 ? (
        <>
          <Text className="mt-3 text-lg font-semibold text-text-primary">
            No medication schedule for today
          </Text>
          <Text className="mt-2 text-sm leading-6 text-text-secondary">
            Your daily progress will appear here when scheduled doses are available.
          </Text>
        </>
      ) : (
        <>
          <Text className="mt-3 text-[26px] font-bold leading-8 text-text-primary">
            {summary.takenCount} of {summary.totalCount} taken
          </Text>
          <Text className="mt-2 text-sm text-text-secondary">
            {summary.remainingCount} remaining
            {summary.missedCount > 0 ? ` • ${summary.missedCount} missed` : ''}
          </Text>

          <View className="mt-5 h-3 overflow-hidden rounded-full bg-brand-primary-soft">
            <View
              className="h-full rounded-full bg-brand-primary"
              style={{ width: progressWidth }}
            />
          </View>
        </>
      )}
    </View>
  );
}
