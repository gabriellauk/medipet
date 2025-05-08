import { Grid } from '@mantine/core';
import MedicationSummary from './components/MedicationSummary';
import ObservationsTimeline from './components/ObservationsTimeline';
import { Medication } from '../../types/MedicationTypes';
import { Observation } from '../../types/ObservationTypes';

export function MedicationAndObservations({
  medication,
  medicationError,
  observations,
}: {
  medication: Medication[];
  medicationError: string | null;
  observations: Observation[];
}) {
  const latestObservations = observations.slice(0, 3);

  return (
    <Grid align="stretch" gutter="md" mt="md">
      {latestObservations.length === 0 ? (
        <Grid.Col span={{ base: 12, xs: 12 }}>
          <MedicationSummary medication={medication} error={medicationError} />
        </Grid.Col>
      ) : (
        <>
          <Grid.Col span={{ base: 12, xs: 6 }}>
            <MedicationSummary
              medication={medication}
              error={medicationError}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 6 }}>
            <ObservationsTimeline observations={latestObservations} />
          </Grid.Col>
        </>
      )}
    </Grid>
  );
}
