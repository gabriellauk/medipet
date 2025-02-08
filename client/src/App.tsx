import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import SplashPage from './pages/SplashPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <MantineProvider>
        <SplashPage />
      </MantineProvider>
    </BrowserRouter>
  );
}

export default App;
