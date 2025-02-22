import { useEffect, useState } from 'react';
import { useApi } from './ApiContext';
import { AuthContext, AuthState } from './AuthContext';

export default function AuthContextProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [state, setState] = useState<AuthState>({
    authenticated: false,
    user: null,
    loading: true,
  });

  const api = useApi();

  const logout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await api.post('/logout');
    if (response.status === 200) {
      setState({ authenticated: false, user: null, loading: false });
    }
  };

  // Check if user is logged in on mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      const response = await api.get('/user');
      if (response.status === 200) {
        setState({
          authenticated: true,
          user: {
            firstName: response.body.firstName,
            lastName: response.body.lastName,
          },
          loading: false,
        });
      } else {
        setState({
          authenticated: false,
          user: null,
          loading: false,
        });
      }
    };

    checkLoginStatus();
  });

  return (
    <AuthContext.Provider value={{ state, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
