import { Text, View } from 'react-native';
import type { SessionEventItem } from '@/features/sessions/types/sessions.types';

type Props = {
  title: string;
  events: SessionEventItem[];
};

export function SessionEventTimeline({ title, events }: Props) {
  return (
    <View className="rounded-[24px] border border-border-subtle bg-surface-raised p-5 shadow-card">
      <Text className="text-lg font-bold text-brand-secondary">{title}</Text>

      {events.length === 0 ? (
        <Text className="mt-4 text-sm leading-6 text-text-secondary">
          No event timeline is needed because this session did not include detected seizure activity.
        </Text>
      ) : (
        <View className="mt-5 gap-0">
          {events.map((event, index) => (
            <View key={event.id} className="flex-row gap-4">
              <View className="items-center">
                <View className="h-3 w-3 rounded-full bg-brand-primary" />
                {index < events.length - 1 ? (
                  <View className="min-h-[92px] w-[2px] bg-brand-primary-soft/70" />
                ) : null}
              </View>

              <View className="flex-1 pb-5">
                <View className="rounded-[18px] bg-app-background-soft p-4">
                  <View className="flex-row items-start justify-between gap-3">
                    <View>
                      <Text className="text-xs font-bold uppercase tracking-[1px] text-text-muted">
                        Event {index + 1}
                      </Text>
                      <Text className="mt-2 text-base font-bold text-text-primary">
                        {event.recordingStartLabel}
                      </Text>
                    </View>

                    <View className="rounded-full bg-white/80 px-3 py-1.5">
                      <Text className="text-xs font-bold text-brand-secondary">
                        {event.eventDurationLabel}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-4">
                    <View className="h-2 overflow-hidden rounded-full bg-white/70">
                      <View
                        className="absolute h-2 rounded-full bg-brand-primary-soft"
                        style={{
                          left: `${event.startPercent}%`,
                          width: `${Math.max(event.endPercent - event.startPercent, 2)}%`,
                        }}
                      />
                    </View>
                  </View>

                  {event.onsetSummary ? (
                    <Text className="mt-3 text-sm text-text-secondary">{event.onsetSummary}</Text>
                  ) : null}
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
