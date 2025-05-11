import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';
import AuthRedirect from './features/auth/AuthRedirect.tsx';
import SplashPage from './features/landing-page/SplashPage.tsx';
import ProtectedRoute from './features/auth/ProtectedRoute.tsx';
import LoggedInLayout from './components/layout/LoggedInLayout.tsx';
import { CreateAnimal } from './features/animal/CreateAnimal.tsx';
import ObservationDiary from './features/observations/ObservationDiary.tsx';
import AppointmentsCalendar from './features/appointments/AppointmentsCalendar.tsx';
import WeightTracker from './features/weights/WeightTracker.tsx';
import MedicationSchedule from './features/medication/MedicationSchedule.tsx';
import Dashboard from './features/dashboard/Dashboard.tsx';
import Providers from './contexts/Providers.tsx';

function App() {
  return (
    <BrowserRouter>
      <Providers>
        <Routes>
          <Route path="/" element={<AuthRedirect />} />
          <Route path="/login" element={<SplashPage />} />
          <Route path="/complete-signup" element={<CreateAnimal />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<LoggedInLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/weight-tracker" element={<WeightTracker />} />
              <Route
                path="/medication-schedule"
                element={<MedicationSchedule />}
              />
              <Route
                path="/appointments-calendar"
                element={<AppointmentsCalendar />}
              />
              <Route path="/observation-diary" element={<ObservationDiary />} />
            </Route>
          </Route>
        </Routes>
      </Providers>
    </BrowserRouter>
  );
}

export default App;
