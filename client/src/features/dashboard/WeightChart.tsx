import { Space, Title } from '@mantine/core';
import { LineChart } from '@mantine/charts';
import { Weight } from '../../types/WeightTypes';

export function WeightChart({
  weights,
  animalName,
}: {
  weights: Weight[];
  animalName: string;
}) {
  return (
    <>
      <Title order={2} size="h3">
        {animalName}'s weight over time
      </Title>
      <Space h="xl" />
      <LineChart
        h={300}
        data={weights.map(({ date, weight }) => ({ date, weight }))}
        dataKey="date"
        series={[{ name: 'weight', color: 'indigo.6' }]}
        curveType="linear"
        valueFormatter={(value) => `${value / 1000} kg`}
      />
    </>
  );
}
