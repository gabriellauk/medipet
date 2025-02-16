import { Outlet } from 'react-router-dom';
import { AppShell, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import NavMenu from './components/NavMenu.tsx';
import Header from './components/Header.tsx';

function LoggedInLayout() {
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
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Header />
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <NavMenu />
        </AppShell.Navbar>

        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
    </AppShell>
  );
}

export default LoggedInLayout;
