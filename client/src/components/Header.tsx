import { useAuth } from '../contexts/AuthContext.ts';
import Logo from './Logo.tsx';

export default function Header() {
  const { logout } = useAuth();

  return (
    <>
      <Logo />
      <form onSubmit={logout}>
        <button type="submit">Logout</button>
      </form>
    </>
  );
}
