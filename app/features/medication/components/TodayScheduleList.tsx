import { Text, View } from 'react-native';
import { MedicationDoseItem } from '@/features/medication/components/MedicationDoseItem';
import type { TodayScheduleItem } from '@/features/medication/types/medication.types';

type Props = {
  items: TodayScheduleItem[];
  onMarkTaken: (medId: number) => void;
  onMarkMissed: (medId: number) => void;
  isSubmitting?: boolean;
  activeMutationId?: number | null;
};

export function TodayScheduleList({
  items,
  onMarkTaken,
  onMarkMissed,
  isSubmitting = false,
  activeMutationId = null,
}: Props) {
  return (
    <View className="rounded-[24px] border border-border-subtle bg-surface-raised p-5 shadow-card">
      <Text className="text-lg font-bold text-brand-secondary">Today Schedule</Text>

      {items.length === 0 ? (
        <Text className="mt-4 text-sm leading-6 text-text-secondary">
          No scheduled doses for today.
        </Text>
      ) : (
        <View className="mt-4 gap-3">
          {items.map((item) => (
            <MedicationDoseItem
              key={item.id}
              item={item}
              onMarkTaken={onMarkTaken}
              onMarkMissed={onMarkMissed}
              isSubmitting={isSubmitting && activeMutationId === item.id}
            />
          ))}
        </View>
      )}
    </View>
  );
}
