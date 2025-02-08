import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider.tsx';
import { Title, ThemeIcon } from '@mantine/core';
import { IconPawFilled } from '@tabler/icons-react';

export default function Header() {
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

  const fullUrlToLoginEndpoint =
    import.meta.env.VITE_REACT_APP_BASE_API_URL + '/login';
  const fullUrlToLogoutEndpoint =
    import.meta.env.VITE_REACT_APP_BASE_API_URL + '/logout';

  return (
    <>
      <Title order={1}>
        <ThemeIcon>
          <IconPawFilled></IconPawFilled>
        </ThemeIcon>{' '}
        MediPet
      </Title>
      {userIsLoggedIn ? (
        <form action={fullUrlToLogoutEndpoint} method="POST">
          <button type="submit">Logout</button>
        </form>
      ) : (
        <form action={fullUrlToLoginEndpoint} method="POST">
          <button type="submit">Login with Google</button>
        </form>
      )}
    </>
  );
}
