import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';

export function useGetUser() {
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await api.get('/user');
        setUserIsLoggedIn(response.status === 200);
      } catch (error) {
        console.error('Could not get user:', error);
        setUserIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  return { userIsLoggedIn, isLoading };
}
