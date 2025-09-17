import { Outlet } from 'react-router-dom';
import { AppShell, Burger, Container, Group, Space } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import NavMenu from './nav/NavMenu.tsx';
import classes from './LoggedInLayout.module.css';
import Logo from '../ui/logo/Logo.tsx';
import { useAuth } from '../../contexts/AuthContext.ts';
import DemoDisclaimer from '../DemoDisclaimer.tsx';

function LoggedInLayout() {
  const [opened, { toggle }] = useDisclosure();
  const { userInfo } = useAuth();

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
      <AppShell.Header className={classes.header}>
        <Group h="100%" px="md">
          <Logo />
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
            ml="auto"
          />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavMenu onLinkClick={toggle} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Container my="md">
          {userInfo?.isDemoAccount && (
            <>
              <DemoDisclaimer />
              <Space h="lg" />
            </>
          )}
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default LoggedInLayout;
