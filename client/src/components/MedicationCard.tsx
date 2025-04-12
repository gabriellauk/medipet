import { Card, Group, Text } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { TimeUnit } from '../pages/MedicationSchedule';

export default function MedicationCard({
  medicationId,
  name,
  isRecurring,
  startDate,
  timesPerDay,
  frequencyNumber,
  frequencyUnit,
  durationNumber,
  durationUnit,
  endDate,
  notes,
  animalId,
  deleteMedication,
  onEditClick,
}: {
  medicationId: number;
  name: string;
  isRecurring: boolean;
  startDate: string;
  timesPerDay?: number;
  frequencyNumber?: number;
  frequencyUnit?: TimeUnit;
  durationNumber?: number;
  durationUnit?: TimeUnit;
  endDate?: string;
  notes?: string;
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
        name: {name}
        <br />
        recurring: {isRecurring ? 'true' : 'false'} <br />
        start date: {startDate}
        <br />
        times per day: {timesPerDay}
        <br />
        frequency: {frequencyNumber} times a {frequencyUnit}
        <br />
        duration: {durationNumber} {durationUnit}s<br />
        ends: {endDate}
        <br />
        notes: {notes}
      </Text>
    </Card>
  );
}
