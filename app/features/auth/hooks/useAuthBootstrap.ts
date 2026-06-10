import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/features/auth/context/useAuth';

const MIN_SPLASH_DURATION_MS = 4000;

export function useAuthBootstrap() {
  const router = useRouter();
  const hasNavigatedRef = useRef(false);
  const { isAuthenticated, isHydrated } = useAuth();

  useEffect(() => {
    if (!isHydrated || hasNavigatedRef.current) {
      return;
    }

    hasNavigatedRef.current = true;

    const timeoutId = setTimeout(() => {
      router.replace((isAuthenticated ? '/(tabs)' : '/login') as never);
    }, MIN_SPLASH_DURATION_MS);

    return () => {
      clearTimeout(timeoutId);
      hasNavigatedRef.current = false;
    };
  }, [isAuthenticated, isHydrated, router]);

  return {
    isBootstrapping: !isHydrated,
  };
}
