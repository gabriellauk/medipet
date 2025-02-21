import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiContext';

export function useGetUser() {
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [isCheckingLoginStatus, setIsLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    const checkUserStatus = async () => {
      const response = await api.get('/user');
      setUserIsLoggedIn(response.status === 200);
      setIsLoading(false);
    };

    checkUserStatus();
  });

  return { userIsLoggedIn, isLoading: isCheckingLoginStatus };
}
