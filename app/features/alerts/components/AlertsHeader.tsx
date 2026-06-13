import { Text, View } from 'react-native';

export function AlertsHeader() {
  return (
    <View className="gap-2">
      <Text className="text-[28px] font-bold text-brand-secondary">Alerts</Text>
      <Text className="text-base leading-6 text-text-secondary">
        Updates from your doctor and care team.
      </Text>
    </View>
  );
}
