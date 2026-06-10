import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import type { NextDoseSummary } from '@/features/medication/types/medication.types';

type Props = {
  dose: NextDoseSummary | null;
  onMarkTaken: (medId: number) => void;
  isSubmitting?: boolean;
};

export function NextDoseCard({ dose, onMarkTaken, isSubmitting = false }: Props) {
  if (!dose) {
    return (
      <View className="rounded-[24px] border border-border-subtle border-l-4 border-l-brand-primary bg-surface-raised p-5 shadow-card">
        <Text className="text-xs font-bold uppercase tracking-[1.2px] text-brand-secondary">
          Next Dose
        </Text>
        <Text className="mt-3 text-lg font-semibold text-text-primary">
          No upcoming dose scheduled
        </Text>
        <Text className="mt-2 text-sm text-text-secondary">
          Your next assigned dose will appear here once a medication schedule is available.
        </Text>
      </View>
    );
  }

  const isDisabled = dose.isTaken || !dose.canMarkTaken || isSubmitting;

  return (
    <View className="rounded-[24px] border border-border-subtle border-l-4 border-l-brand-primary bg-surface-raised p-5 shadow-card">
      <Text className="text-xs font-bold uppercase tracking-[1.2px] text-brand-secondary">
        Next Dose
      </Text>
      <Text className="mt-3 text-[26px] font-bold leading-8 text-text-primary">
        {dose.name} {dose.dosage}
      </Text>
      <Text className="mt-2 text-base font-semibold text-text-primary">{dose.scheduledLabel}</Text>
      <Text className="mt-1 text-sm text-text-secondary">{dose.instruction}</Text>

      <Pressable
        disabled={isDisabled}
        onPress={() => onMarkTaken(dose.id)}
        className={`mt-5 min-h-[52px] flex-row items-center justify-center rounded-[18px] ${
          isDisabled ? 'bg-brand-primary-soft' : 'bg-brand-primary'
        }`}>
        {isSubmitting ? <ActivityIndicator size="small" color="#0e3b31" /> : null}
        <Text
          className={`ml-2 text-base font-bold ${
            isDisabled ? 'text-brand-secondary' : 'text-white'
          }`}>
          {dose.isTaken ? 'Taken' : dose.canMarkTaken ? 'Mark as Taken' : 'Scheduled Ahead'}
        </Text>
      </Pressable>
    </View>
  );
}
