import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import type { AlertListItem } from '@/features/alerts/types/alerts.types';

type Props = {
  alert: AlertListItem | null;
  onClose: () => void;
};

function formatDetailDate(value: string | null) {
  if (!value) {
    return 'Unknown time';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export function AlertDetailSheet({ alert, onClose }: Props) {
  const [isVisible, setIsVisible] = useState(Boolean(alert));
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(480)).current;

  useEffect(() => {
    if (alert) {
      setIsVisible(true);
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 480,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setIsVisible(false);
      }
    });
  }, [alert, overlayOpacity, translateY]);

  const title = useMemo(() => alert?.title ?? 'Alert details', [alert]);

  if (!isVisible) {
    return null;
  }

  return (
    <Modal transparent visible onRequestClose={onClose} animationType="none">
      <View className="flex-1 justify-end">
        <Animated.View style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-[#14211c]/35">
          <Pressable className="flex-1" onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={{ transform: [{ translateY }] }}
          className="max-h-[78%] rounded-t-[30px] bg-app-background px-5 pb-7 pt-4 shadow-card">
          <View className="items-center">
            <View className="h-1.5 w-12 rounded-full bg-border-subtle" />
          </View>

          <View className="mt-4 flex-row items-center justify-between gap-3">
            <Text className="flex-1 text-lg font-bold text-brand-secondary">{title}</Text>
            <Pressable onPress={onClose} className="rounded-full bg-app-background-soft px-3 py-2">
              <Text className="text-sm font-bold text-text-secondary">Close</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-4 py-4">
            <View className="rounded-[18px] bg-app-background-soft p-4">
              <Text className="text-xs font-bold uppercase tracking-[1px] text-text-muted">
                Received
              </Text>
              <Text className="mt-2 text-sm text-text-primary">
                {formatDetailDate(alert?.createdAt ?? null)}
              </Text>
            </View>

            <View className="rounded-[20px] border border-border-subtle bg-surface-raised p-4">
              <Text className="text-base font-bold text-text-primary">{alert?.title}</Text>
              <Text className="mt-3 text-sm leading-7 text-text-secondary">
                {alert?.message}
              </Text>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}
