import { Text, View } from 'react-native';

type Props = {
  unreadCount: number;
  totalCount: number;
};

export function AlertsSummaryCard({ unreadCount, totalCount }: Props) {
  const title =
    unreadCount > 0
      ? `You have ${unreadCount} unread alert${unreadCount === 1 ? '' : 's'}`
      : 'You are up to date';

  const subtitle =
    totalCount > 0
      ? 'Open any alert to read the full update and keep track of recent care messages.'
      : 'Doctor and system updates will appear here when they are available.';

  return (
    <View className="rounded-[24px] border border-border-subtle bg-surface-raised p-5 shadow-card">
      <Text className="text-sm font-bold uppercase tracking-[1px] text-text-muted">
        At A Glance
      </Text>
      <Text className="mt-3 text-2xl font-bold leading-9 text-brand-secondary">{title}</Text>
      <Text className="mt-2 text-sm leading-6 text-text-secondary">{subtitle}</Text>

      <View className="mt-5 flex-row gap-3">
        <View className="flex-1 rounded-[18px] bg-app-background-soft p-4">
          <Text className="text-xs font-bold uppercase tracking-[1px] text-text-muted">
            Unread
          </Text>
          <Text className="mt-2 text-2xl font-bold text-text-primary">{unreadCount}</Text>
        </View>
        <View className="flex-1 rounded-[18px] bg-app-background-soft p-4">
          <Text className="text-xs font-bold uppercase tracking-[1px] text-text-muted">
            Total Alerts
          </Text>
          <Text className="mt-2 text-2xl font-bold text-text-primary">{totalCount}</Text>
        </View>
      </View>
    </View>
  );
}
