import { Avatar, Paper, Text } from '@mantine/core';
import { GiCat } from 'react-icons/gi';
import { useAnimals } from '../../../../contexts/AnimalsContext';
import styles from './Profile.module.css';

export default function Profile({ weight }: { weight: number | null }) {
  const { animal } = useAnimals();

  return (
    <Paper withBorder className={styles.paper}>
      <Avatar size={120} radius={120} className={styles.avatar}>
        <GiCat size={80} />
      </Avatar>
      <Text ta="center" fz="lg" fw={500} mt="md">
        {animal!.name}
      </Text>
      <Text ta="center" c="dimmed" fz="sm">
        Current weight: {weight ? `${weight} kg` : 'N/A'}
      </Text>
    </Paper>
  );
}
