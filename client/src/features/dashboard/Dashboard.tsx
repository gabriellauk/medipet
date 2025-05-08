import { Loader } from '@mantine/core';
import { useWeights } from '../../hooks/useWeights';

import { Grid } from '@mantine/core';
import Profile from './components/Profile/Profile';
import UpcomingAppointment from './components/UpcomingAppointment';
import { useAnimals } from '../../contexts/AnimalsContext';
import { useAppointments } from '../../hooks/useAppointments';
import { useMedication } from '../../hooks/useMedication';
import { filterCurrentMedication } from '../../utils/medicationUtils';
import { useObservations } from '../../hooks/useObservations';
import { getObservationsFromPastThreeMonths } from '../../utils/observationsUtils';
import CallToActionBanner from './CallToActionBanner';
import { KeyStatsGrid } from './KeyStatsGrid';
import { WeightChart } from './WeightChart';
import { MedicationAndObservations } from './MedicationAndObservations';

export default function Dashboard() {
  const { animal } = useAnimals();
  const { weights, weightsLoading } = useWeights();
  const { appointments, appointmentsLoading, appointmentsError } =
    useAppointments();
  const { medication, medicationLoading, medicationError } = useMedication();
  const filteredMedication = filterCurrentMedication(medication);
  const { observations, observationsLoading } = useObservations();

  const upcomingAppointment =
    appointments.length > 0 ? appointments.slice(-1)[0] : null;

  const sortedWeights = [...weights].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const mostRecentWeight =
    sortedWeights.length > 0 ? sortedWeights[sortedWeights.length - 1] : null;

  const weightChange =
    sortedWeights.length >= 2
      ? (sortedWeights[sortedWeights.length - 1].weight -
          sortedWeights[sortedWeights.length - 2].weight) /
        1000
      : null;

  const isLoading =
    weightsLoading ||
    appointmentsLoading ||
    medicationLoading ||
    observationsLoading;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Grid align="stretch" gutter="md">
        <Grid.Col span={{ base: 12, xs: 6 }}>
          <Profile weight={mostRecentWeight} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>
          <UpcomingAppointment
            appointment={upcomingAppointment}
            error={appointmentsError}
          />
        </Grid.Col>
      </Grid>

      <Grid align="stretch" gutter="md" mt="md">
        <Grid.Col span={{ base: 12, xs: 12 }}>
          <KeyStatsGrid
            observationsCount={
              getObservationsFromPastThreeMonths(observations).length
            }
            mostRecentWeight={mostRecentWeight}
            weightChange={weightChange}
            filteredMedicationCount={filteredMedication.length}
          />
        </Grid.Col>
      </Grid>

      {weights.length > 0 && (
        <Grid align="stretch" gutter="md" mt="md">
          <Grid.Col span={{ base: 12, xs: 12 }}>
            <WeightChart weights={weights} animalName={animal!.name} />
          </Grid.Col>
        </Grid>
      )}

      <Grid align="stretch" gutter="md" mt="md">
        <CallToActionBanner
          observationsCount={observations.length}
          weightsCount={weights.length}
        />
      </Grid>

      <MedicationAndObservations
        medication={filteredMedication}
        medicationError={medicationError}
        observations={observations}
      />
    </>
  );
}
