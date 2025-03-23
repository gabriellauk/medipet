import { Card, Group, Text } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';

export default function MedicationCard({
  medicationId,
  name,
  isRecurring,
  startDate,
  frequencyUnit,
  animalId,
  deleteMedication,
  onEditClick,
}: {
  medicationId: number;
  name: string;
  isRecurring: boolean;
  startDate: string;
  frequencyUnit: string;
  animalId: number;
  deleteMedication: (animalId: number, appointmentId: number) => void;
  onEditClick: () => void;
}) {
  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder mb="lg">
      <Group justify="space-between" mt="xs" mb="xs">
        <Text fw={500}>{startDate}</Text>
        <Group>
          <IconPencil onClick={onEditClick} style={{ cursor: 'pointer' }} />
          <IconTrash
            onClick={() => deleteMedication(animalId, medicationId)}
            style={{ cursor: 'pointer' }}
          />
        </Group>
      </Group>
      <Text size="sm" c="dimmed">
        {name}, {isRecurring}, {frequencyUnit}
      </Text>
    </Card>
  );
}
