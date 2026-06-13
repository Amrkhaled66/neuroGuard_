import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import type { TodayScheduleItem } from '@/features/medication/types/medication.types';

type Props = {
  item: TodayScheduleItem;
  onMarkTaken: (medId: number) => void;
  onMarkMissed: (medId: number) => void;
  isSubmitting?: boolean;
};

const statusTextStyles = {
  taken: 'text-brand-secondary',
  scheduled: 'text-text-secondary',
  missed: 'text-brand-secondary',
} as const;

export function MedicationDoseItem({
  item,
  onMarkTaken,
  onMarkMissed,
  isSubmitting = false,
}: Props) {
  const isDisabled = isSubmitting || (!item.canMarkTaken && !item.canMarkMissed);

  return (
    <View className="rounded-[20px] border border-border-subtle bg-app-background-soft p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <Text className="text-sm font-semibold text-brand-secondary">
            {item.scheduledTime}
            {item.isOverdue ? ' • Due now' : ''}
          </Text>
          <Text className="text-base font-bold text-text-primary">
            {item.name} {item.dosage}
          </Text>
          <Text className="text-sm leading-5 text-text-secondary">{item.instruction}</Text>
        </View>

        <View
          className={`rounded-full px-3 py-1 ${
            item.status === 'taken'
              ? 'bg-brand-primary-soft'
              : item.status === 'missed'
                ? 'bg-brand-primary-softest'
                : 'bg-surface-soft'
          }`}>
          <Text className={`text-xs font-bold capitalize ${statusTextStyles[item.status]}`}>
            {item.status}
          </Text>
        </View>
      </View>

      {item.status === 'scheduled' ? (
        item.canMarkTaken ? (
          <View className="mt-4 flex-row gap-3">
            <Pressable
              disabled={isDisabled}
              onPress={() => onMarkTaken(item.id)}
              className={`min-h-[44px] flex-1 flex-row items-center justify-center rounded-[16px] ${
                isDisabled ? 'bg-brand-primary-soft' : 'bg-brand-primary'
              }`}>
              {isSubmitting ? <ActivityIndicator size="small" color="#0e3b31" /> : null}
              <Text
                className={`ml-2 text-sm font-bold ${
                  isDisabled ? 'text-brand-secondary' : 'text-white'
                }`}>
                Mark as Taken
              </Text>
            </Pressable>

            <Pressable
              disabled={isDisabled}
              onPress={() => onMarkMissed(item.id)}
              className="min-h-[44px] flex-1 items-center justify-center rounded-[16px] border border-border-subtle bg-surface-raised">
              <Text className="text-sm font-bold text-text-secondary">Mark as Missed</Text>
            </Pressable>
          </View>
        ) : (
          <Text className="mt-4 text-sm text-text-secondary">
            This dose will become available at its scheduled time.
          </Text>
        )
      ) : null}
    </View>
  );
}
