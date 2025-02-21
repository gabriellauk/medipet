import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import AuthRedirect from './components/AuthRedirect.tsx';
import SplashPage from './pages/SplashPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import LoggedInLayout from './LoggedInLayout.tsx';
import TestMessage from './components/TestMessage.tsx';
import TestProtectedMessage from './components/TestProtectedMessage.tsx';
import CreateAnimal from './pages/CreateAnimal.tsx';
import ApiContextProvider from './contexts/ApiContextProvider.tsx';

function App() {
  return (
    <BrowserRouter>
      <MantineProvider>
        <ApiContextProvider>
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
        </ApiContextProvider>
      </MantineProvider>
    </BrowserRouter>
  );
}

export default App;
