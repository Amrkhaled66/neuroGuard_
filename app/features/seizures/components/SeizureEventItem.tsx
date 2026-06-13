import { Text, View } from 'react-native';
import type { RecentSeizureEventItem } from '@/features/seizures/types/seizures.types';

type Props = {
  event: RecentSeizureEventItem;
};

export function SeizureEventItem({ event }: Props) {
  return (
    <View className="rounded-[18px] border border-border-subtle bg-app-background-soft p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-base font-bold text-text-primary">{event.sessionDateLabel}</Text>
          <Text className="mt-1 text-sm text-text-secondary">{event.fileName}</Text>
        </View>
        <Text className="text-sm font-semibold text-brand-secondary">{event.durationLabel}</Text>
      </View>

      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-sm text-text-secondary">Recording start</Text>
        <Text className="text-sm font-semibold text-text-primary">{event.recordingStartLabel}</Text>
      </View>
    </View>
  );
}
