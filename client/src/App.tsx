import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import EntryPoint from './EntryPoint.tsx';

function App() {
  return (
    <BrowserRouter>
      <MantineProvider>
        <EntryPoint />
      </MantineProvider>
    </BrowserRouter>
  );
}

export default App;
