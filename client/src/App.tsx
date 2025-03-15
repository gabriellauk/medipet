import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import AuthRedirect from './components/AuthRedirect.tsx';
import SplashPage from './pages/SplashPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import LoggedInLayout from './LoggedInLayout.tsx';
import ComingSoon from './components/ComingSoon.tsx';
import ApiContextProvider from './contexts/ApiContextProvider.tsx';
import AuthContextProvider from './contexts/AuthContextProvider.tsx';
import { CreateAnimal } from './pages/CreateAnimal.tsx';
import AnimalsContextProvider from './contexts/AnimalsContextProvider.tsx';
import ObservationDiary from './pages/ObservationDiary.tsx';

function App() {
  return (
    <BrowserRouter>
      <MantineProvider>
        <ApiContextProvider>
          <AuthContextProvider>
            <AnimalsContextProvider>
              <Routes>
                <Route path="/" element={<AuthRedirect />} />
                <Route path="/login" element={<SplashPage />} />
                <Route path="/complete-signup" element={<CreateAnimal />} />
                <Route path="*" element={<Navigate to="/" />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<LoggedInLayout />}>
                    <Route
                      path="/dashboard"
                      element={<ComingSoon title="Dashboard" />}
                    />
                    <Route
                      path="/weight-tracker"
                      element={<ComingSoon title="Weight Tracker" />}
                    />
                    <Route
                      path="/medication-schedule"
                      element={<ComingSoon title="Medication Schedule" />}
                    />
                    <Route
                      path="/appointments-calendar"
                      element={<ComingSoon title="Appointments Calendar" />}
                    />
                    <Route
                      path="/observation-diary"
                      element={<ObservationDiary />}
                    />
                  </Route>
                </Route>
              </Routes>
            </AnimalsContextProvider>
          </AuthContextProvider>
        </ApiContextProvider>
      </MantineProvider>
    </BrowserRouter>
  );
}

export default App;
