import { Text, View } from 'react-native';

export function SessionsHeader() {
  return (
    <View className="gap-2">
      <Text className="text-[28px] font-bold text-brand-secondary">Sessions</Text>
      <Text className="text-base leading-6 text-text-secondary">
        Reviewed EEG recordings from your recent uploads.
      </Text>
    </View>
  );
}
