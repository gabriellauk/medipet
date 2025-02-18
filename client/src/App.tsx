import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import ApiProvider from './contexts/ApiProvider.tsx';
import AuthRedirect from './components/AuthRedirect.tsx';
import SplashPage from './pages/SplashPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import LoggedInLayout from './LoggedInLayout.tsx';
import TestMessage from './components/TestMessage.tsx';
import TestProtectedMessage from './components/TestProtectedMessage.tsx';
import CreateAnimal from './pages/CreateAnimal.tsx';

function App() {
  return (
    <BrowserRouter>
      <MantineProvider>
        <ApiProvider>
          <Routes>
            <Route path="/" element={<AuthRedirect />} />
            <Route path="/login" element={<SplashPage />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<LoggedInLayout />}>
                <Route path="/test" element={<TestMessage />} />
                <Route
                  path="/test-protected"
                  element={<TestProtectedMessage />}
                />
                <Route path="/add-a-pet" element={<CreateAnimal />} />
              </Route>
            </Route>
          </Routes>
        </ApiProvider>
      </MantineProvider>
    </BrowserRouter>
  );
}

export default App;
