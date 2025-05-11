import { IconCheck } from '@tabler/icons-react';
import {
  Button,
  Container,
  Group,
  Image,
  List,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import image from '../../assets/image.jpg';
import classes from './Hero.module.css';

const loginUrl = import.meta.env.VITE_REACT_APP_BASE_API_URL + '/login';
const loginDemoUrl =
  import.meta.env.VITE_REACT_APP_BASE_API_URL + '/login-demo';

export function Hero() {
  return (
    <Container size="md">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            A <span className={classes.highlight}>health record</span> for your
            pet
          </Title>
          <Text c="dimmed" mt="md">
            MediPet gives you a place to store your pet's medical history and
            helps you keep on top of appointments and treatments.
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconCheck size={12} stroke={1.5} />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>Appointments</b> – Store notes on past visits to the vet and
              view details of upcoming ones.
            </List.Item>
            <List.Item>
              <b>Medication</b> – Keep a record of your pet's regular and
              one-off medication.
            </List.Item>
            <List.Item>
              <b>Observations</b> – Monitor changes to behaviour or symptoms
              over time and identify patterns.
            </List.Item>
          </List>

          <Group mt={30}>
            <form action={loginUrl} method="POST">
              <Button
                radius="xl"
                size="md"
                className={classes.control}
                type="submit"
              >
                Sign in with Google
              </Button>
            </form>
            <form action={loginDemoUrl} method="POST">
              <Button
                variant="default"
                radius="xl"
                size="md"
                className={classes.control}
                type="submit"
              >
                View demo
              </Button>
            </form>
          </Group>
        </div>
        <Image src={image} className={classes.image} />
      </div>
    </Container>
  );
}
