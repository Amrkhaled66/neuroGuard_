import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthSession } from '@/features/auth/types/auth.types';

const AUTH_SESSION_STORAGE_KEY = 'auth_session';

export async function getStoredSession() {
  const rawSession = await AsyncStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as AuthSession;
  } catch {
    await AsyncStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return null;
  }
}

export async function storeSession(session: AuthSession) {
  await AsyncStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export async function clearStoredSession() {
  await AsyncStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

export async function getAccessToken() {
  const session = await getStoredSession();
  return session?.token ?? null;
}
