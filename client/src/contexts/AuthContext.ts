import { createContext, useContext } from 'react';

export type User = {
  firstName: string;
  lastName: string;
};

type AuthContextType = {
  authenticationStateIsLoading: boolean;
  isAuthenticated: boolean;
  userInfo: User | null;
  logout: (e: React.FormEvent<HTMLFormElement>) => void;
};

export const AuthContext = createContext<AuthContextType>({
  authenticationStateIsLoading: true,
  isAuthenticated: false,
  userInfo: null,
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}
