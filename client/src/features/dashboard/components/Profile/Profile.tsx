import { Avatar, Paper, Text } from '@mantine/core';
import { GiCat, GiRabbit, GiSittingDog } from 'react-icons/gi';
import { useAnimals } from '../../../../contexts/AnimalsContext';
import styles from './Profile.module.css';
import { Weight } from '../../../../types/WeightTypes';

export default function Profile({ weight }: { weight: Weight | null }) {
  const { animal } = useAnimals();

  const animalIcons: Record<number, JSX.Element> = {
    1: <GiCat size={80} />,
    2: <GiSittingDog size={80} />,
    3: <GiRabbit size={80} />,
  };

  const icon = animalIcons[animal!.animalTypeId];

  return (
    <Paper withBorder className={styles.paper}>
      <Avatar size={120} radius={120} className={styles.avatar}>
        {icon}
      </Avatar>
      <Text ta="center" fz="lg" fw={500} mt="md">
        {animal!.name}
      </Text>
      <Text ta="center" c="dimmed" fz="sm">
        Current weight: {weight ? `${weight.weight / 1000} kg` : 'N/A'}
      </Text>
    </Paper>
  );
}
