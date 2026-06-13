import { Pressable, Text, View } from 'react-native';
import { AlertListItem } from '@/features/alerts/components/AlertListItem';
import type { AlertListItem as AlertListItemType } from '@/features/alerts/types/alerts.types';

type Props = {
  items: AlertListItemType[];
  hasNextPage: boolean;
  isLoadingMore: boolean;
  onOpenAlert: (alert: AlertListItemType) => void | Promise<void>;
  onLoadMore: () => void | Promise<void>;
};

export function AlertsList({
  items,
  hasNextPage,
  isLoadingMore,
  onOpenAlert,
  onLoadMore,
}: Props) {
  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-bold text-brand-secondary">Recent Alerts</Text>
        <Text className="text-sm text-text-muted">{items.length} shown</Text>
      </View>

      {items.length === 0 ? (
        <View className="rounded-[24px] border border-border-subtle bg-surface-raised p-6 shadow-card">
          <Text className="text-lg font-bold text-brand-secondary">No alerts right now</Text>
          <Text className="mt-2 text-sm leading-6 text-text-secondary">
            Doctor and system updates will appear here when they are available.
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {items.map((item) => (
            <AlertListItem key={item.id} alert={item} onPress={onOpenAlert} />
          ))}
        </View>
      )}

      {hasNextPage ? (
        <Pressable
          onPress={() => void onLoadMore()}
          className="min-h-[52px] items-center justify-center rounded-[18px] bg-app-background-soft">
          <Text className="text-sm font-bold text-brand-secondary">
            {isLoadingMore ? 'Loading...' : 'Load More'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
