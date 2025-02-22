import { Title, ThemeIcon } from '@mantine/core';
import { IconPawFilled } from '@tabler/icons-react';
import { useAuth } from '../contexts/AuthContext.ts';

export default function Header() {
  const { state, logout } = useAuth();

  const fullUrlToLoginEndpoint =
    import.meta.env.VITE_REACT_APP_BASE_API_URL + '/login';

  return (
    <>
      <Title order={1}>
        <ThemeIcon>
          <IconPawFilled></IconPawFilled>
        </ThemeIcon>{' '}
        MediPet
      </Title>
      {state.authenticated ? (
        <form onSubmit={logout}>
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
