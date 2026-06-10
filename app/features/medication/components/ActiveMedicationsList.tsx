import { Text, View } from 'react-native';
import { ActiveMedicationCard } from '@/features/medication/components/ActiveMedicationCard';
import type { ActiveMedicationCardItem } from '@/features/medication/types/medication.types';

type Props = {
  medications: ActiveMedicationCardItem[];
};

export function ActiveMedicationsList({ medications }: Props) {
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
        medications.map((medication) => (
          <ActiveMedicationCard key={medication.id} medication={medication} />
        ))
      )}
    </View>
  );
}
