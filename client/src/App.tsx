import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';
import ROUTES from './routes';
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
          <Route path={ROUTES.ROOT} element={<AuthRedirect />} />
          <Route path={ROUTES.LOGIN} element={<SplashPage />} />
          <Route path={ROUTES.COMPLETE_SIGNUP} element={<CreateAnimal />} />
          <Route
            path={ROUTES.NOT_FOUND}
            element={<Navigate to={ROUTES.ROOT} />}
          />
          <Route element={<ProtectedRoute />}>
            <Route element={<LoggedInLayout />}>
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.WEIGHT_TRACKER} element={<WeightTracker />} />
              <Route
                path={ROUTES.MEDICATION_SCHEDULE}
                element={<MedicationSchedule />}
              />
              <Route
                path={ROUTES.APPOINTMENTS_CALENDAR}
                element={<AppointmentsCalendar />}
              />
              <Route
                path={ROUTES.OBSERVATION_DIARY}
                element={<ObservationDiary />}
              />
            </Route>
          </Route>
        </Routes>
      </Providers>
    </BrowserRouter>
  );
}

export default App;
