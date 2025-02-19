import { Navigate, Outlet } from 'react-router-dom';
import { useGetUser } from '../hooks/useGetUser';

export default function ProtectedRoute() {
  const { userIsLoggedIn, isLoading } = useGetUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userIsLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
