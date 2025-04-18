import { Blockquote, Button, Group, Text } from '@mantine/core';
import { useAnimals } from '../../../contexts/AnimalsContext';
import { IconCalendar } from '@tabler/icons-react';

export default function Appointment() {
  const { animal } = useAnimals();

  // const appointment = null;

  const appointment = {
    id: 1,
    description: 'Yearly check-up/booster',
    date: '2025-04-01',
  };

  return (
    <Blockquote
      color="blue"
      cite={appointment?.description || null}
      icon={null}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      p="lg"
    >
      <Group>
        <IconCalendar />
        <Text size="md">
          <b>{animal!.name}'s next appointment</b>
        </Text>
      </Group>
      <br />
      {appointment ? (
        '14th April 2025 at 10am'
      ) : (
        <>
          No upcoming appointments.
          <p></p>
          <Button>Record appointment</Button>
        </>
      )}
    </Blockquote>
  );
}
