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
import { ActiveMedicationCard } from '@/features/medication/components/ActiveMedicationCard';
import type { ActiveMedicationCardItem } from '@/features/medication/types/medication.types';

type Props = {
  medication: ActiveMedicationCardItem | null;
  onClose: () => void;
};

export function MedicationDetailsSheet({ medication, onClose }: Props) {
  const [isVisible, setIsVisible] = useState(Boolean(medication));
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(480)).current;

  useEffect(() => {
    if (medication) {
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
  }, [medication, overlayOpacity, translateY]);

  const title = useMemo(() => medication?.name ?? 'Medication details', [medication]);

  if (!isVisible) {
    return null;
  }

  return (
    <Modal transparent visible onRequestClose={onClose} animationType="none">
      <View className="flex-1 justify-end">
        <Animated.View
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-[#14211c]/35">
          <Pressable className="flex-1" onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={{ transform: [{ translateY }] }}
          className="max-h-[84%] rounded-t-[30px] bg-app-background px-5 pb-7 pt-4 shadow-card">
          <View className="items-center">
            <View className="h-1.5 w-12 rounded-full bg-border-subtle" />
          </View>

          <View className="mt-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-brand-secondary">{title}</Text>
            <Pressable onPress={onClose} className="rounded-full bg-app-background-soft px-3 py-2">
              <Text className="text-sm font-bold text-text-secondary">Close</Text>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerClassName="gap-4 py-4">
            {medication ? <ActiveMedicationCard medication={medication} /> : null}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}
