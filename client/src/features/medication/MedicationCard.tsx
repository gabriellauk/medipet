import { Card, Group, Text } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { Medication } from '../../types/MedicationTypes';
import { transformMedication } from '../../utils/medicationUtils';
import { formatDate } from '../../utils/dateUtils';

export default function MedicationCard({
  medication,
  animalId,
  deleteMedication,
  onEditClick,
}: {
  medication: Medication;
  animalId: number;
  deleteMedication: (animalId: number, medicationId: number) => void;
  onEditClick: () => void;
}) {
  const schedule = transformMedication(medication);

  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder mb="lg">
      <Group justify="space-between" mt="xs" mb="xs">
        <Text fw={500}>{medication.name}</Text>
        <Group>
          <IconPencil onClick={onEditClick} style={{ cursor: 'pointer' }} />
          <IconTrash
            onClick={() => deleteMedication(animalId, medication.id)}
            style={{ cursor: 'pointer' }}
          />
        </Group>
      </Group>
      <Text size="sm" c="dimmed">
        {!medication.isRecurring &&
          'On ' + formatDate(medication.startDate) + ' (one-off)'}
        {medication.isRecurring &&
          'From ' + formatDate(medication.startDate) + ': ' + schedule}
        {medication.timesPerDay && (
          <>
            <br />
            {medication.timesPerDay} time(s) a day
          </>
        )}
        {medication.notes && (
          <>
            <br />
            {medication.notes}
          </>
        )}
      </Text>
    </Card>
  );
}
