import { Blockquote, Button, Group, Text } from '@mantine/core';
import { useAnimals } from '../../../contexts/AnimalsContext';
import { IconCalendar } from '@tabler/icons-react';
import { Appointment } from '../../../types/AppointmentTypes';
import { formatLongDate } from '../../../utils/dateUtils';

export default function UpcomingAppointment({
  appointment,
  error,
  onAddApppointment,
}: {
  appointment: Appointment | null;
  error: string | null;
  onAddApppointment: () => void;
}) {
  const { animal } = useAnimals();

  const formattedDate = appointment?.date
    ? formatLongDate(appointment.date)
    : null;

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
          <Button onClick={onAddApppointment}>Record appointment</Button>
        </>
      )}
    </Blockquote>
  );
}
