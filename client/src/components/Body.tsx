import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Sidebar from './Sidebar.tsx';

export default function Body({ sidebar, children } : {sidebar: boolean, children: React.ReactNode}) {
  return (
    <Container>
      <Stack direction="horizontal" className="Body">
        {sidebar && <Sidebar />}
        <Container className="Content">
          {children}
        </Container>
      </Stack>
    </Container>
  );
}