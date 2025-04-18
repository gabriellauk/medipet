import { Blockquote, Group, List, Text } from '@mantine/core';
import { IconPill } from '@tabler/icons-react';
import { useAnimals } from '../../../contexts/AnimalsContext';

export default function MedicationSummary() {
  const { animal } = useAnimals();

  // const medications = null

  const medications = (
    <List>
      <List.Item>Flea treatment (every month)</List.Item>
      <List.Item>Worming tablets (every three months)</List.Item>
      <List.Item>Antibiotics (until 1st May 2025)</List.Item>
    </List>
  );

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
          <b>{animal!.name}'s current medication</b>
        </Text>
      </Group>
      <p></p>
      {medications ? medications : 'No medications recorded yet'}
      <p></p>
      <Text variant="link" component="a" href="https://google.com">
        → Update schedule
      </Text>
    </Blockquote>
  );
}
