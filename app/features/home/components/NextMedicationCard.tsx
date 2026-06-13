import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import type { HomeMedicationSummary } from '@/features/home/types/home.types';

type Props = {
  medication: HomeMedicationSummary | null;
  onMarkTaken: () => void;
  isSubmitting?: boolean;
};

export function NextMedicationCard({ medication, onMarkTaken, isSubmitting = false }: Props) {
  if (!medication) {
    return (
      <View className="rounded-[24px] border border-border-subtle border-l-4 border-l-brand-primary bg-surface-raised p-5 shadow-card">
        <Text className="text-xs font-bold uppercase tracking-[1.2px] text-brand-secondary">
          Next Medication
        </Text>
        <Text className="mt-3 text-lg font-semibold text-text-primary">
          No upcoming medication scheduled
        </Text>
        <Text className="mt-2 text-sm text-text-secondary">
          Your next assigned dose will appear here once a medication schedule is available.
        </Text>
      </View>
    );
  }

  return (
    <View className="rounded-[24px] border border-border-subtle border-l-4 border-l-brand-primary bg-surface-raised p-5 shadow-card">
      <Text className="text-xs font-bold uppercase tracking-[1.2px] text-brand-secondary">
        Next Medication
      </Text>
      <Text className="mt-3 text-[26px] font-bold leading-8 text-text-primary">
        {medication.name} {medication.dosage}
      </Text>
      <Text className="mt-2 text-base font-semibold text-text-primary">
        {medication.scheduledLabel}
      </Text>
      <Text className="mt-1 text-sm text-text-secondary">{medication.instruction}</Text>

      <Pressable
        disabled={medication.isTaken || !medication.canMarkTaken || isSubmitting}
        onPress={onMarkTaken}
        className={`mt-5 min-h-[52px] flex-row items-center justify-center rounded-[18px] ${
          medication.isTaken || !medication.canMarkTaken || isSubmitting
            ? 'bg-brand-primary-soft'
            : 'bg-brand-primary'
          }`}>
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#0e3b31" />
        ) : null}
        <Text className={`ml-2 text-base font-bold ${medication.isTaken || !medication.canMarkTaken || isSubmitting ? 'text-brand-secondary' : 'text-white'}`}>
          {medication.isTaken
            ? 'Taken'
            : medication.canMarkTaken
              ? 'Mark as Taken'
              : 'Scheduled Ahead'}
        </Text>
      </Pressable>
    </View>
  );
}
