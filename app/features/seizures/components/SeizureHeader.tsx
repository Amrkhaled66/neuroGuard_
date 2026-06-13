import { Text, View } from 'react-native';

export function SeizureHeader() {
  return (
    <View className="gap-2">
      <Text className="text-[28px] font-bold text-brand-secondary">Seizures</Text>
      <Text className="text-base leading-6 text-text-secondary">
        Review recent detected seizure activity and trends
      </Text>
    </View>
  );
}
