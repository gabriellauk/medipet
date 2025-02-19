import { Title, ThemeIcon } from '@mantine/core';
import { IconPawFilled } from '@tabler/icons-react';
import { useGetUser } from '../hooks/useGetUser.tsx';

export default function Header() {
  const { userIsLoggedIn } = useGetUser();

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
