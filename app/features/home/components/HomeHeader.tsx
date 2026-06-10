import { Pressable, Text, View } from 'react-native';

type Props = {
  greeting: string;
  subtitle: string;
  initials: string;
};

export function HomeHeader({ greeting, subtitle, initials }: Props) {
  return (
    <View className="flex-row items-start justify-between gap-4">
      <View className="flex-1">
        <Text className="text-[28px] font-bold leading-8 text-brand-secondary">{greeting}</Text>
        <Text className="mt-2 text-base leading-6 text-text-secondary">{subtitle}</Text>
      </View>

      <Pressable className="size-12 items-center justify-center rounded-full bg-brand-primary-soft">
        <Text className="text-sm font-bold text-brand-secondary">{initials}</Text>
      </Pressable>
    </View>
  );
}
