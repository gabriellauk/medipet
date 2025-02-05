
import { Routes, Route, Navigate } from 'react-router-dom';
import CreateAnimal from './pages/CreateAnimal.tsx';
import ApiProvider from './contexts/ApiProvider';

import { AppShell, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Welcome from './components/Welcome.tsx';
import NavMenu from './components/NavMenu.tsx';
import TestMessage from './components/TestMessage.tsx';
import TestProtectedMessage from './components/TestProtectedMessage.tsx';
import Header from './components/Header.tsx';



function MainContent() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >


    
    <ApiProvider>
      <AppShell.Header>
      <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Header />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
 <NavMenu />

      </AppShell.Navbar>

      <AppShell.Main>
      <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/test" element={<TestMessage />} />
            <Route path="/test-protected" element={<TestProtectedMessage />} />
            <Route path="/add-a-pet" element={<CreateAnimal />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </AppShell.Main>
    
        </ApiProvider>
        </AppShell>
  );
}

export default MainContent;
