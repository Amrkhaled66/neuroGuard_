import { createContext, useContext, useState, type ReactNode } from "react";
import {
  setToken,
  clearToken,
  getToken,
  setUser,
  clearUser,
  getUser,
} from "@shared/utils/authStorage";
import type { IUser } from "@shared/interfaces/IUser";
type AuthData = {
  user: IUser | null;
  token: string | null;
};

type AuthContextType = {
  authData: AuthData;
  login: (user: IUser, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (user: IUser) => void;
};

const AuthContext = createContext<AuthContextType>({
  authData: { user: null, token: null },
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  updateUser: () => {},
});

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [authData, setAuthData] = useState<AuthData>(() => {
    const token = getToken();
    const user = getUser();
    return {
      user,
      token,
    };
  });
  const updateUser = (user: IUser) => {
    setAuthData((prev) => ({ ...prev, user }));
    setUser(user);
  };

  const login = (user: IUser, token: string) => {
    setAuthData({ user, token });
    setToken(token);
    setUser(user);
  };
  const logout = () => {
    setAuthData({ user: null, token: null });
    clearToken();
    clearUser();
  };
  const isAuthenticated = !!authData.token;

  const contextValue = {
    authData,
    login,
    logout,
    isAuthenticated,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export { useAuth };
