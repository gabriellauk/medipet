import { Alert, UnstyledButton } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useAnimals } from '../contexts/AnimalsContext';
import { AnimalTypeId } from '../types/AnimalTypes';

export default function DemoDisclaimer() {
  const { animal } = useAnimals();
  const loginUrl = import.meta.env.VITE_REACT_APP_BASE_API_URL + '/login';

  return (
    <Alert
      variant="filled"
      color="blue"
      title="You're viewing a demo account."
      icon={<IconInfoCircle />}
    >
      <form action={loginUrl} method="POST">
        This account has been auto-populated with sample data for a fictional{' '}
        {AnimalTypeId[animal!.animalTypeId].toLowerCase()} named {animal!.name}{' '}
        to give you a feel for how MediPet works. To set up a real account,
        start by{' '}
        <UnstyledButton
          type="submit"
          fz="sm"
          style={{ display: 'inline', textDecoration: 'underline' }}
        >
          signing in with your Google account.
        </UnstyledButton>
      </form>
    </Alert>
  );
}
