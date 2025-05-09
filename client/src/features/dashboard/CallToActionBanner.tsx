import { Text, Paper, Grid, Group, Button } from '@mantine/core';

export default function CallToActionBanner({
  observationsCount,
  weightsCount,
  onAddWeight,
  onAddObservation,
}: {
  observationsCount: number;
  weightsCount: number;
  onAddWeight: () => void;
  onAddObservation: () => void;
}) {
  const text =
    observationsCount === 0 && weightsCount === 0
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
              <Button variant="filled" color="blue" onClick={onAddWeight}>
                Add weight
              </Button>
              <Button variant="filled" color="blue" onClick={onAddObservation}>
                Add observation
              </Button>
            </Group>
          </Group>
        </Paper>
      </Grid.Col>
    </>
  );
}
