import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SeizuresPlaceholderScreen() {
  return (
    <SafeAreaView className="flex-1 bg-app-background">
      <View className="flex-1 px-5 py-7">
        <View className="rounded-[24px] border border-border-subtle bg-surface-raised p-6 shadow-card">
          <Text className="text-[26px] font-bold text-brand-secondary">Seizures</Text>
          <Text className="mt-3 text-base leading-6 text-text-secondary">
            Recent seizure trends and analyzed events will be added here next.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
