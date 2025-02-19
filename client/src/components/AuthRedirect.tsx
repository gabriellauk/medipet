import { Navigate } from 'react-router-dom';
import { useGetUser } from '../hooks/useGetUser';

export default function AuthRedirect() {
  const { userIsLoggedIn, isLoading } = useGetUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (userIsLoggedIn) {
    return <Navigate to="/test" replace />;
  }

  return <Navigate to="/login" replace />;
}
