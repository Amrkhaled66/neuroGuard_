import { createContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { normalizeStoredAuthSession } from '@/features/auth/api/auth.api';
import { clearStoredSession, getStoredSession, storeSession } from '@/features/auth/services/auth-storage.service';
import type { AuthSession, AuthUser } from '@/features/auth/types/auth.types';

type AuthContextValue = {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (session: AuthSession) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: AuthUser) => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateSession() {
      try {
        const storedSession = await getStoredSession();
        const normalizedSession = storedSession
          ? normalizeStoredAuthSession(storedSession)
          : null;

        if (isMounted) {
          setSession(normalizedSession);
        }

        if (
          normalizedSession &&
          JSON.stringify(normalizedSession) !== JSON.stringify(storedSession)
        ) {
          await storeSession(normalizedSession);
        }
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    }

    void hydrateSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session?.token && session?.user),
      isHydrated,
      login: async (nextSession) => {
        setSession(nextSession);
        await storeSession(nextSession);
      },
      logout: async () => {
        setSession(null);
        await clearStoredSession();
      },
      updateUser: async (user) => {
        setSession((currentSession) => {
          if (!currentSession) {
            return currentSession;
          }

          const nextSession = {
            ...currentSession,
            user,
          };

          void storeSession(nextSession);
          return nextSession;
        });
      },
    }),
    [isHydrated, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
