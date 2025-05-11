import { Blockquote, Group, List, Text } from '@mantine/core';
import { IconPill } from '@tabler/icons-react';
import { useAnimals } from '../../../contexts/AnimalsContext';
import { Medication } from '../../../types/MedicationTypes';
import { useNavigate } from 'react-router-dom';
import { buildConciseMedicationScheduleDescription } from '../../../utils/medicationUtils';

export default function MedicationSummary({
  medication,
  error,
}: {
  medication: Medication[];
  error: string | null;
}) {
  const { animal } = useAnimals();
  const navigate = useNavigate();

  return (
    <Blockquote
      color="blue"
      icon={null}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      p="lg"
    >
      <Group>
        <IconPill />
        <Text size="md">
          <b>{animal!.name}'s current medications</b>
        </Text>
      </Group>
      <p></p>

      {error ? (
        error
      ) : medication.length ? (
        <List>
          {medication.map((med) => (
            <List.Item key={med.id}>
              {med.name}, {buildConciseMedicationScheduleDescription(med)}
            </List.Item>
          ))}
        </List>
      ) : (
        'No current medications to display.'
      )}
      <p></p>

      <Text
        variant="link"
        component="a"
        onClick={() => navigate('/medication-schedule')}
        style={{ cursor: 'pointer' }}
      >
        <b>→ Update schedule</b>
      </Text>
    </Blockquote>
  );
}
