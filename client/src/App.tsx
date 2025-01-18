import Container from 'react-bootstrap/Container';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage.tsx';
import TestPage from './pages/TestPage.tsx';
import TestProtectedPage from './pages/TestProtectedPage.tsx';
import CreateAnimal from './pages/CreateAnimal.tsx';
import ApiProvider from './contexts/ApiProvider';

function App() {
  return (
    <Container fluid className="App">
      <BrowserRouter>
        <ApiProvider>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/test-protected" element={<TestProtectedPage />} />
            <Route path="/add-a-pet" element={<CreateAnimal />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ApiProvider>
      </BrowserRouter>
    </Container>
  );
}

export default App
