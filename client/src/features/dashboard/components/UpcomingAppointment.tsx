import { Blockquote, Button, Group, Text } from '@mantine/core';
import { useAnimals } from '../../../contexts/AnimalsContext';
import { IconCalendar } from '@tabler/icons-react';
import { Appointment } from '../../../types/AppointmentTypes';
import { useNavigate } from 'react-router-dom';

export default function UpcomingAppointment({
  appointment,
  error,
}: {
  appointment: Appointment | null;
  error: string | null;
}) {
  const { animal } = useAnimals();
  const navigate = useNavigate();

  let formattedDate = null;
  if (appointment?.date) {
    const date = new Date(appointment?.date || '');
    formattedDate = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

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
      {error ? (
        error
      ) : appointment ? (
        <>{formattedDate}</>
      ) : (
        <>
          No upcoming appointments.
          <p></p>
          <Button onClick={() => navigate('/appointments-calendar')}>
            Record appointment
          </Button>
        </>
      )}
    </Blockquote>
  );
}
