import { createContext } from "react";
import type { IUser } from "@shared/interfaces/IUser";

export type AuthData = {
  user: IUser | null;
  token: string | null;
};

export type AuthContextType = {
  authData: AuthData;
  login: (user: IUser, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (user: IUser) => void;
};

export const AuthContext = createContext<AuthContextType>({
  authData: { user: null, token: null },
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  updateUser: () => {},
});
