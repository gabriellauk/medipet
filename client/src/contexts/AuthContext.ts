import { createContext, useContext } from 'react';

type User = {
  firstName: string;
  lastName: string;
};

export type AuthState = {
  loading: boolean;
  authenticated: boolean;
  user: User | null;
};

type AuthContextType = {
  state: AuthState;
  logout: (e: React.FormEvent<HTMLFormElement>) => void;
};

export const AuthContext = createContext<AuthContextType>({
  state: {
    loading: true,
    authenticated: false,
    user: null,
  },
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}
