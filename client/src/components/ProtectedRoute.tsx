import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute() {
  const { state } = useAuth();

  if (state.loading) {
    return <div>Loading...</div>;
  }

  if (!state.authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
