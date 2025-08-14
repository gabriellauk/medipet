import { Space, Title } from '@mantine/core';
import { LineChart } from '@mantine/charts';
import { Weight } from '../../types/WeightTypes';
import { formatShortDate } from '../../utils/dateUtils';

export function WeightChart({
  weights,
  animalName,
}: {
  weights: Weight[];
  animalName: string;
}) {
  const weightValues = weights.map((w) => w.weight);
  const minWeight = Math.min(...weightValues);
  const maxWeight = Math.max(...weightValues);

  const percent = 0.02;
  const lower = Math.floor((minWeight * (1 - percent)) / 100) * 100;
  const upper = Math.ceil((maxWeight * (1 + percent)) / 100) * 100;

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
        yAxisProps={{
          domain: [lower, upper],
          tickFormatter: (value) => `${(value / 1000).toFixed(1)} kg`,
          tickCount: 6,
        }}
        xAxisProps={{
          tickFormatter: (dateStr: string) => formatShortDate(dateStr),
        }}
      />
    </>
  );
}
