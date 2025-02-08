import { useState, useEffect } from 'react';
import { useApi } from './contexts/ApiProvider.tsx';
import SplashPage from './pages/SplashPage.tsx';
import { CreateAnimal2 } from './pages/CreateAnimal2.tsx';

export default function EntryPoint() {
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(null);
  const api = useApi();

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const response = await api.get('/user');
      setUserIsLoggedIn(response.body.isLoggedIn);
    } catch (error) {
      console.error('Error checking user status:', error);
    }
  };

  return <>{userIsLoggedIn ? <CreateAnimal2 /> : <SplashPage />}</>;
}
