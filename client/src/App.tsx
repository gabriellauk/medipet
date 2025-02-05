import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import MainContent from './MainContent.tsx';
import '@mantine/core/styles.css';

function App() {
  return (
    <BrowserRouter>
      <MantineProvider>
        <MainContent />
      </MantineProvider>
    </BrowserRouter>
  );
}

export default App;
