import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAnimals } from '../contexts/AnimalsContext';
import { Loader } from '@mantine/core';

export default function ProtectedRoute() {
  const { authenticationStateIsLoading, isAuthenticated } = useAuth();
  const { animals, animalsLoading } = useAnimals();

  if (authenticationStateIsLoading || animalsLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && (!animals || animals.length < 1)) {
    return <Navigate to="/complete-signup" replace />;
  }

  return <Outlet />;
}
