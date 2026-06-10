import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import { NavigationTheme } from '@/constants/theme';
import { useAxiosInterceptor } from '@/features/auth/hooks/useAxiosInterceptor';
import { AppProviders } from '@/providers/AppProviders';

export const unstable_settings = {
  initialRouteName: 'index',
};

function RootNavigator() {
  useAxiosInterceptor();

  return (
    <ThemeProvider value={NavigationTheme}>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: true }} />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
