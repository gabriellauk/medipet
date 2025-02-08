import { AppShell, Container, ThemeIcon, Title } from '@mantine/core';
import { Hero } from '../components/Hero/Hero.tsx';
import { IconPawFilled } from '@tabler/icons-react';
import classes from './SplashPage.module.css';

function SplashPage() {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header className={classes.header} style={{ width: '100%' }}>
        <Container
          size="md"
          h="100%"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Title order={1}>
            <ThemeIcon>
              <IconPawFilled></IconPawFilled>
            </ThemeIcon>{' '}
            MediPet
          </Title>
        </Container>
      </AppShell.Header>

      <Hero />
    </AppShell>
  );
}

export default SplashPage;
