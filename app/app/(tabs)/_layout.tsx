import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect } from 'expo-router';
import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from 'expo-router/unstable-native-tabs';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/features/auth/context/useAuth';

const tabTheme = {
  tintColor: Colors.light.tint,
  nativeLabelStyle: {
    color: Colors.light.tabIconDefault,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  nativeTitlePositionAdjustment: {
    horizontal: 0,
    vertical: 0,
  },
  indicatorColor: Colors.light.tint,
  backgroundColor: Colors.light.card,
};

const tabs = [
  {
    name: 'index',
    title: 'Home',
    defaultIcon: 'home-outline',
    selectedIcon: 'home',
  },
  {
    name: 'medication',
    title: 'Medication',
    defaultIcon: 'medkit-outline',
    selectedIcon: 'medkit',
  },
  {
    name: 'sessions',
    title: 'Sessions',
    defaultIcon: 'pulse-outline',
    selectedIcon: 'pulse',
  },
  {
    name: 'seizures',
    title: 'Seizures',
    defaultIcon: 'analytics-outline',
    selectedIcon: 'analytics',
  },
  {
    name: 'alerts',
    title: 'Alerts',
    defaultIcon: 'notifications-outline',
    selectedIcon: 'notifications',
  },
] as const;

export default function TabLayout() {
  const { isAuthenticated, isHydrated } = useAuth();

  if (!isHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href={'/login' as never} />;
  }

  return (
    <NativeTabs
      tintColor={tabTheme.tintColor}
      labelStyle={tabTheme.nativeLabelStyle}
      titlePositionAdjustment={tabTheme.nativeTitlePositionAdjustment}
      indicatorColor={tabTheme.indicatorColor}
      backgroundColor={tabTheme.backgroundColor}>
      {tabs.map((tab) => (
        <NativeTabs.Trigger key={tab.name} name={tab.name}>
          <Icon
            src={{
              default: <VectorIcon family={Ionicons} name={tab.defaultIcon} />,
              selected: <VectorIcon family={Ionicons} name={tab.selectedIcon} />,
            }}
          />
          <Label>{tab.title}</Label>
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
