import { Card, Group, Text } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { formatDate } from '../../utils/dateUtils';
import { Appointment } from '../../types/AppointmentTypes';

export default function AppointmentCard({
  appointment,
  animalId,
  deleteAppointment,
  onEditClick,
}: {
  appointment: Appointment;
  animalId: number;
  deleteAppointment: (animalId: number, appointmentId: number) => void;
  onEditClick: () => void;
}) {
  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder mb="lg">
      <Group justify="space-between" mt="xs" mb="xs">
        <Text fw={500}>{formatDate(appointment.date)}</Text>
        <Group>
          <IconPencil onClick={onEditClick} style={{ cursor: 'pointer' }} />
          <IconTrash
            onClick={() => deleteAppointment(animalId, appointment.id)}
            style={{ cursor: 'pointer' }}
          />
        </Group>
      </Group>
      <Text size="sm" c="dimmed">
        {appointment.description}
        {appointment.notes && (
          <>
            <br />
            {appointment.notes}
          </>
        )}
      </Text>
    </Card>
  );
}
