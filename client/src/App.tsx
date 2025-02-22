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
import AuthContextProvider from './contexts/AuthContextProvider.tsx';
import { CreateAnimal2 } from './pages/CreateAnimal2.tsx';
import AnimalsContextProvider from './contexts/AnimalsContextProvider.tsx';

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
                <Route path="/complete-signup" element={<CreateAnimal2 />} />
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
            </AnimalsContextProvider>
          </AuthContextProvider>
        </ApiContextProvider>
      </MantineProvider>
    </BrowserRouter>
  );
}

export default App;
