import { Card, Group, Text } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { formatDate } from '../../utils/dateUtils';

export default function AppointmentCard({
  appointmentId,
  date,
  description,
  notes,
  animalId,
  deleteAppointment,
  onEditClick,
}: {
  appointmentId: number;
  date: string;
  description: string;
  notes: string | null;
  animalId: number;
  deleteAppointment: (animalId: number, appointmentId: number) => void;
  onEditClick: () => void;
}) {
  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder mb="lg">
      <Group justify="space-between" mt="xs" mb="xs">
        <Text fw={500}>{formatDate(date)}</Text>
        <Group>
          <IconPencil onClick={onEditClick} style={{ cursor: 'pointer' }} />
          <IconTrash
            onClick={() => deleteAppointment(animalId, appointmentId)}
            style={{ cursor: 'pointer' }}
          />
        </Group>
      </Group>
      <Text size="sm" c="dimmed">
        {description}
        {notes && (
          <>
            <br />
            {notes}
          </>
        )}
      </Text>
    </Card>
  );
}
