import { Text, View } from 'react-native';

type Props = {
  note: string | null;
  channelCountLabel: string;
};

export function SessionExtraInfoCard({ note, channelCountLabel }: Props) {
  return (
    <View className="rounded-[24px] border border-border-subtle bg-surface-raised p-5 shadow-card">
      <Text className="text-lg font-bold text-brand-secondary">Extra Context</Text>

      <View className="mt-4 rounded-[18px] bg-app-background-soft p-4">
        <Text className="text-xs font-bold uppercase tracking-[1px] text-text-muted">
          Recording Channels
        </Text>
        <Text className="mt-2 text-base font-bold text-text-primary">{channelCountLabel}</Text>
      </View>

      {note ? (
        <View className="mt-4 rounded-[18px] bg-app-background-soft p-4">
          <Text className="text-xs font-bold uppercase tracking-[1px] text-text-muted">Note</Text>
          <Text className="mt-2 text-sm leading-7 text-text-secondary">{note}</Text>
        </View>
      ) : null}
    </View>
  );
}
