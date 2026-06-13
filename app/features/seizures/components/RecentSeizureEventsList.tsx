import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SeizureEventItem } from '@/features/seizures/components/SeizureEventItem';
import type { RecentSeizureEventItem } from '@/features/seizures/types/seizures.types';

type Props = {
  events: RecentSeizureEventItem[];
  hasNextPage: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
};

export function RecentSeizureEventsList({
  events,
  hasNextPage,
  isLoadingMore,
  onLoadMore,
}: Props) {
  return (
    <View className="rounded-[24px] border border-border-subtle bg-surface-raised p-5 shadow-card">
      <Text className="text-lg font-bold text-brand-secondary">Recent Detected Events</Text>

      {events.length === 0 ? (
        <Text className="mt-4 text-sm leading-6 text-text-secondary">
          No detected seizure events are available for this time range.
        </Text>
      ) : (
        <View className="mt-4 gap-3">
          {events.map((event) => (
            <SeizureEventItem key={event.id} event={event} />
          ))}
        </View>
      )}

      {hasNextPage ? (
        <Pressable
          onPress={onLoadMore}
          disabled={isLoadingMore}
          className="mt-4 min-h-[48px] flex-row items-center justify-center rounded-[16px] bg-brand-primary-soft">
          {isLoadingMore ? <ActivityIndicator size="small" color="#0e3b31" /> : null}
          <Text className="ml-2 text-sm font-bold text-brand-secondary">Load More</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
