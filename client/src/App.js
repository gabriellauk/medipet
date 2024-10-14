import Container from 'react-bootstrap/Container';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';
import ApiProvider from './contexts/ApiProvider';

export default function App() {

  return (
    <Container fluid className="App">
      <BrowserRouter>
        <ApiProvider>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ApiProvider>
      </BrowserRouter>
    </Container>
  );
}