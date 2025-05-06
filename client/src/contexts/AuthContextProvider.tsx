import { useEffect, useState } from 'react';
import { useApi } from './ApiContext';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/AuthTypes';

export default function AuthContextProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authenticationStateIsLoading, setAuthenticationStateIsLoading] =
    useState(true);

  const api = useApi();
  const navigate = useNavigate();

  const logout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await api.post('/logout');
    if (response.status === 200) {
      setIsAuthenticated(false);
      setUserInfo(null);
      setAuthenticationStateIsLoading(false);
      navigate('/login');
    }
  };

  // Check if user is logged in on mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      const response = await api.get<User>('/user');
      if (response.status === 200) {
        setIsAuthenticated(true);
        setUserInfo({
          firstName: response.body.firstName,
          lastName: response.body.lastName,
          isDemoAccount: response.body.isDemoAccount,
        });
        setAuthenticationStateIsLoading(false);
      } else {
        setIsAuthenticated(false);
        setUserInfo(null);
        setAuthenticationStateIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userInfo,
        authenticationStateIsLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
