import { useState, useEffect } from 'react';
import { useApi } from './contexts/ApiProvider.tsx';
import MainContent from './MainContent.tsx';
import SplashPage from './pages/SplashPage.tsx';

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

  return <>{userIsLoggedIn ? <MainContent /> : <SplashPage />}</>;
}
