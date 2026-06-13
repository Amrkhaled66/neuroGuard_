import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import type { AlertListItem as AlertListItemType } from '@/features/alerts/types/alerts.types';

type Props = {
  alert: AlertListItemType;
  onPress: (alert: AlertListItemType) => void;
};

export function AlertListItem({ alert, onPress }: Props) {
  return (
    <Pressable
      onPress={() => onPress(alert)}
      className={`rounded-[20px] border p-4 shadow-card ${
        alert.isRead
          ? 'border-border-subtle bg-surface-raised'
          : 'border-brand-primary/15 bg-brand-primary-soft/35'
      }`}>
      <View className="flex-row items-start gap-3">
        <View className="pt-1">
          {alert.isRead ? (
            <Ionicons name="mail-open-outline" size={18} color="#5f756b" />
          ) : (
            <View className="h-3 w-3 rounded-full bg-brand-primary" />
          )}
        </View>

        <View className="flex-1 gap-2">
          <View className="flex-row items-start justify-between gap-3">
            <Text
              numberOfLines={2}
              className={`flex-1 text-base font-bold leading-6 ${
                alert.isRead ? 'text-text-primary' : 'text-brand-secondary'
              }`}>
              {alert.title}
            </Text>
            <Text className="pt-0.5 text-xs text-text-muted">{alert.timestampLabel}</Text>
          </View>

          <Text numberOfLines={2} className="text-sm leading-6 text-text-secondary">
            {alert.preview}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
