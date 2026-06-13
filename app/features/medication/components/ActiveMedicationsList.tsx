import { Pressable, Text, View } from 'react-native';
import type { ActiveMedicationCardItem } from '@/features/medication/types/medication.types';

type Props = {
  medications: ActiveMedicationCardItem[];
  onSelectMedication: (medication: ActiveMedicationCardItem) => void;
};

export function ActiveMedicationsList({ medications, onSelectMedication }: Props) {
  return (
    <View className="gap-4">
      <Text className="text-lg font-bold text-brand-secondary">Active Medications</Text>

      {medications.length === 0 ? (
        <View className="rounded-[24px] border border-border-subtle bg-surface-raised p-5 shadow-card">
          <Text className="text-sm leading-6 text-text-secondary">
            No active medications assigned.
          </Text>
        </View>
      ) : (
        <View className="rounded-[24px] border border-border-subtle bg-surface-raised p-3 shadow-card">
          {medications.map((medication, index) => (
            <Pressable
              key={medication.id}
              onPress={() => onSelectMedication(medication)}
              className={`flex-row items-center justify-between rounded-[18px] px-4 py-4 ${
                index !== medications.length - 1 ? 'border-b border-border-subtle' : ''
              }`}>
              <View className="flex-1">
                <Text className="text-base font-bold text-text-primary">{medication.name}</Text>
                <Text className="mt-1 text-sm text-text-secondary">
                  {medication.dosage}
                  {medication.scheduledTimeLabel ? ` • ${medication.scheduledTimeLabel}` : ''}
                </Text>
              </View>
              <Text className="text-lg font-bold text-brand-secondary">›</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
