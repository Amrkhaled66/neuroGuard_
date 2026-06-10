import { Text, View } from 'react-native';

export function MedicationHeader() {
  return (
    <View className="gap-2">
      <Text className="text-[28px] font-bold text-brand-secondary">Medication</Text>
      <Text className="text-base leading-6 text-text-secondary">
        Track your daily treatment plan
      </Text>
    </View>
  );
}
