import { Card, Group, Text } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { formatDate } from '../../utils/dateUtils';

export default function WeightCard({
  weightId,
  date,
  weight,
  animalId,
  deleteWeight,
  onEditClick,
}: {
  weightId: number;
  date: string;
  weight: number;
  animalId: number;
  deleteWeight: (animalId: number, weightId: number) => void;
  onEditClick: () => void;
}) {
  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder mb="lg">
      <Group justify="space-between" mt="xs" mb="xs">
        <Text fw={500}>{formatDate(date)}</Text>
        <Group>
          <IconPencil onClick={onEditClick} style={{ cursor: 'pointer' }} />
          <IconTrash
            onClick={() => deleteWeight(animalId, weightId)}
            style={{ cursor: 'pointer' }}
          />
        </Group>
      </Group>
      <Text size="sm" c="dimmed">
        {weight / 1000} kg
      </Text>
    </Card>
  );
}
