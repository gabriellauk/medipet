import { Card, Group, Text } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';

export default function ObservationCard({
  symptomId,
  date,
  description,
  animalId,
  deleteObservation,
}: {
  symptomId: number;
  date: string;
  description: string;
  animalId: number;
  deleteObservation: (animalId: number, symptomId: number) => void;
}) {
  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder mb="lg">
      <Group justify="space-between" mt="xs" mb="xs">
        <Text fw={500}>{date}</Text>
        <Group>
          <IconPencil />
          <IconTrash onClick={() => deleteObservation(animalId, symptomId)} />
        </Group>
      </Group>
      <Text size="sm" c="dimmed">
        {description}
      </Text>
    </Card>
  );
}
