import { Loader } from '@mantine/core';
import { useWeights } from '../../hooks/useWeights';

import { Grid } from '@mantine/core';
import Profile from './components/Profile/Profile';
import UpcomingAppointment from './components/UpcomingAppointment';
import { useAnimals } from '../../contexts/AnimalsContext';
import { useAppointments } from '../../hooks/useAppointments';
import { useMedication } from '../../hooks/useMedication';
import { filterForCurrentMedication } from '../../utils/medicationUtils';
import { useObservations } from '../../hooks/useObservations';
import { getObservationsFromPastThreeMonths } from '../../utils/observationsUtils';
import CallToActionBanner from './CallToActionBanner';
import { KeyStatsGrid } from './KeyStatsGrid';
import { WeightChart } from './WeightChart';
import { MedicationAndObservations } from './MedicationAndObservations';
import { useEntityManager } from '../../hooks/useEntityManager';
import { Weight } from '../../types/WeightTypes';
import EntityDrawer from '../../components/EntityDrawer';
import { WeightForm } from '../weights/WeightForm';
import { Observation } from '../../types/ObservationTypes';
import { ObservationForm } from '../observations/ObservationForm';
import { Appointment } from '../../types/AppointmentTypes';
import { AppointmentForm } from '../appointments/AppointmentForm';
import { filterAppointments } from '../../utils/appointmentUtils';

export default function Dashboard() {
  const { animal } = useAnimals();
  const { weights, weightsLoading, refetchWeights } = useWeights();
  const {
    appointments,
    appointmentsLoading,
    appointmentsError,
    refetchAppointments,
  } = useAppointments();
  const { medication, medicationLoading, medicationError } = useMedication();
  const filteredMedication = filterForCurrentMedication(medication);
  const { observations, observationsLoading, refetchObservations } =
    useObservations();

  const {
    opened: openedWeightDrawer,
    close: closeWeightDrawer,
    openCreateMode: openWeightDrawer,
  } = useEntityManager<Weight>();

  const {
    opened: openedObservationDrawer,
    close: closeObservationDrawer,
    openCreateMode: openObservationDrawer,
  } = useEntityManager<Observation>();

  const {
    opened: openedAppointmentDrawer,
    close: closeAppointmentDrawer,
    openCreateMode: openApppointmentDrawer,
  } = useEntityManager<Appointment>();

  const futureAppointments = filterAppointments(appointments, 'future');
  const upcomingAppointment = futureAppointments.length
    ? futureAppointments[futureAppointments.length - 1]
    : null;

  const weightsOldestToNewest = [...weights].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const mostRecentWeight = weightsOldestToNewest.length
    ? weightsOldestToNewest[weightsOldestToNewest.length - 1]
    : null;

  const weightChangeKg =
    weightsOldestToNewest.length >= 2
      ? Math.round(
          (weightsOldestToNewest[weightsOldestToNewest.length - 1].weight -
            weightsOldestToNewest[weightsOldestToNewest.length - 2].weight) /
            10
        ) / 100
      : null;

  const recentObservations =
    getObservationsFromPastThreeMonths(observations).length;

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
            onAddApppointment={openApppointmentDrawer}
          />
        </Grid.Col>
      </Grid>

      <Grid align="stretch" gutter="md" mt="md">
        <Grid.Col span={{ base: 12, xs: 12 }}>
          <KeyStatsGrid
            observationsCount={recentObservations}
            mostRecentWeight={mostRecentWeight}
            weightChange={weightChangeKg}
            filteredMedicationCount={filteredMedication.length}
          />
        </Grid.Col>
      </Grid>

      {weightsOldestToNewest.length > 0 && (
        <Grid align="stretch" gutter="md" mt="md">
          <Grid.Col span={{ base: 12, xs: 12 }}>
            <WeightChart
              weights={weightsOldestToNewest}
              animalName={animal!.name}
            />
          </Grid.Col>
        </Grid>
      )}

      <Grid align="stretch" gutter="md" mt="md">
        <CallToActionBanner
          observationsCount={observations.length}
          weightsCount={weights.length}
          onAddWeight={openWeightDrawer}
          onAddObservation={openObservationDrawer}
        />
      </Grid>

      <MedicationAndObservations
        medication={filteredMedication}
        medicationError={medicationError}
        observations={observations}
      />

      <EntityDrawer opened={openedWeightDrawer} onClose={closeWeightDrawer}>
        <WeightForm
          close={closeWeightDrawer}
          mode="create"
          item={null}
          refetchItems={refetchWeights}
        />
      </EntityDrawer>

      <EntityDrawer
        opened={openedObservationDrawer}
        onClose={closeObservationDrawer}
      >
        <ObservationForm
          close={closeObservationDrawer}
          mode="create"
          item={null}
          refetchItems={refetchObservations}
        />
      </EntityDrawer>

      <EntityDrawer
        opened={openedAppointmentDrawer}
        onClose={closeAppointmentDrawer}
      >
        <AppointmentForm
          close={closeAppointmentDrawer}
          mode="create"
          item={null}
          refetchItems={refetchAppointments}
        />
      </EntityDrawer>
    </>
  );
}
