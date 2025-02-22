import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthRedirect() {
  const { state } = useAuth();

  if (state.loading) {
    return <div>Loading...</div>;
  }

  if (state.authenticated) {
    return <Navigate to="/test" replace />;
  }

  return <Navigate to="/login" replace />;
}
