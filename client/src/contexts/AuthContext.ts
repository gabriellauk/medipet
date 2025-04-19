import { createContext, useContext } from 'react';
import { AuthContextType } from '../types/AuthTypes';

export const AuthContext = createContext<AuthContextType>({
  authenticationStateIsLoading: true,
  isAuthenticated: false,
  userInfo: null,
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}
