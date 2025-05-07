import { Card, Group, Text } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { formatDate } from '../../utils/dateUtils';
import { Observation } from '../../types/ObservationTypes';

export default function ObservationCard({
  observation,
  animalId,
  deleteObservation,
  onEditClick,
}: {
  observation: Observation;
  animalId: number;
  deleteObservation: (animalId: number, symptomId: number) => void;
  onEditClick: () => void;
}) {
  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder mb="lg">
      <Group justify="space-between" mt="xs" mb="xs">
        <Text fw={500}>{formatDate(observation.date)}</Text>
        <Group>
          <IconPencil onClick={onEditClick} style={{ cursor: 'pointer' }} />
          <IconTrash
            onClick={() => deleteObservation(animalId, observation.id)}
            style={{ cursor: 'pointer' }}
          />
        </Group>
      </Group>
      <Text size="sm" c="dimmed">
        {observation.description}
      </Text>
    </Card>
  );
}
