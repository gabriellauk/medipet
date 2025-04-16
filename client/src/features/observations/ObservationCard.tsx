import { Card, Group, Text } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';

export default function ObservationCard({
  observationId,
  date,
  description,
  animalId,
  deleteObservation,
  onEditClick,
}: {
  observationId: number;
  date: string;
  description: string;
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
            onClick={() => deleteObservation(animalId, observationId)}
            style={{ cursor: 'pointer' }}
          />
        </Group>
      </Group>
      <Text size="sm" c="dimmed">
        {description}
      </Text>
    </Card>
  );
}
