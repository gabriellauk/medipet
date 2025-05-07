import { Card, Group, Text } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { formatDate } from '../../utils/dateUtils';
import { Weight } from '../../types/WeightTypes';

export default function WeightCard({
  weight,
  animalId,
  deleteWeight,
  onEditClick,
}: {
  weight: Weight;
  animalId: number;
  deleteWeight: (animalId: number, weightId: number) => void;
  onEditClick: () => void;
}) {
  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder mb="lg">
      <Group justify="space-between" mt="xs" mb="xs">
        <Text fw={500}>{formatDate(weight.date)}</Text>
        <Group>
          <IconPencil onClick={onEditClick} style={{ cursor: 'pointer' }} />
          <IconTrash
            onClick={() => deleteWeight(animalId, weight.id)}
            style={{ cursor: 'pointer' }}
          />
        </Group>
      </Group>
      <Text size="sm" c="dimmed">
        {weight.weight / 1000} kg
      </Text>
    </Card>
  );
}
