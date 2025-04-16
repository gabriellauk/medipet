import { AppShell, Container } from '@mantine/core';
import { Hero } from './components/hero/Hero.tsx';
import classes from './SplashPage.module.css';
import Logo from '../../components/ui/logo/Logo.tsx';

function SplashPage() {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header className={classes.header} style={{ width: '100%' }}>
        <Container
          size="md"
          h="100%"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Logo />
        </Container>
      </AppShell.Header>
      <Hero />
    </AppShell>
  );
}

export default SplashPage;
