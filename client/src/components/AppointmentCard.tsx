import { Card, Group, Text } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';

export default function AppointmentCard({
  appointmentId,
  date,
  description,
  notes,
  animalId,
  deleteObservation,
  onEditClick,
}: {
  appointmentId: number;
  date: string;
  description: string;
  notes: string | null;
  animalId: number;
  deleteObservation: (animalId: number, symptomId: number) => void;
  onEditClick: () => void;
}) {
  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder mb="lg">
      <Group justify="space-between" mt="xs" mb="xs">
        <Text fw={500}>{date}</Text>
        <Group>
          <IconPencil onClick={onEditClick} style={{ cursor: 'pointer' }} />
          <IconTrash
            onClick={() => deleteObservation(animalId, appointmentId)}
            style={{ cursor: 'pointer' }}
          />
        </Group>
      </Group>
      <Text size="sm" c="dimmed">
        {description}, {notes}
      </Text>
    </Card>
  );
}
