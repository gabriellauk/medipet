import { Text, Paper, Grid, Group, Button } from '@mantine/core';
import { Observation } from '../../types/ObservationTypes';
import { Weight } from '../../types/WeightTypes';
import { useNavigate } from 'react-router-dom';

export default function CallToActionBanner({
  observations,
  weights,
}: {
  observations: Observation[];
  weights: Weight[];
}) {
  const navigate = useNavigate();
  const text =
    observations.length === 0 && weights.length === 0
      ? 'No weights or observations listed yet.'
      : 'Noticed a change in weight or behaviour?';

  return (
    <>
      <Grid.Col span={{ base: 12, xs: 12 }}>
        <Paper
          withBorder
          radius="md"
          p="lg"
          style={{ backgroundColor: 'var(--mantine-color-gray-3)' }}
        >
          <Group justify="space-between" mt="xs" mb="xs">
            <Text fw={500}>{text}</Text>
            <Group>
              <Button
                variant="filled"
                color="blue"
                onClick={() => navigate('/weight-tracker')}
              >
                Add weight
              </Button>
              <Button
                variant="filled"
                color="blue"
                onClick={() => navigate('/observation-diary')}
              >
                Add observation
              </Button>
            </Group>
          </Group>
        </Paper>
      </Grid.Col>
    </>
  );
}
