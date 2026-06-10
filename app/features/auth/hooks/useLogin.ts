import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { loginPatient } from '@/features/auth/api/auth.api';
import { useAuth } from '@/features/auth/context/useAuth';
import type { PatientLoginPayload } from '@/features/auth/types/auth.types';

export const authQueryKeys = {
  all: ['auth'] as const,
  patientLogin: ['auth', 'patient', 'login'] as const,
};

export function useLogin() {
  const router = useRouter();
  const { login } = useAuth();

  return useMutation({
    mutationKey: authQueryKeys.patientLogin,
    mutationFn: (payload: PatientLoginPayload) => loginPatient(payload),
    onSuccess: async (session) => {
      await login(session);
      router.replace('/(tabs)');
    },
  });
}
