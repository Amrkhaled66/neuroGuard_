import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { axiosPrivate, isAxiosUnauthorizedError } from '@/shared/lib/axios';
import { useAuth } from '@/features/auth/context/useAuth';

export function useAxiosInterceptor() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (isAxiosUnauthorizedError(error) && isAuthenticated) {
          await logout();
          router.replace('/login' as never);

          Alert.alert('Session Expired', 'Your session has expired. Please sign in again.');
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [isAuthenticated, logout, router]);
}
