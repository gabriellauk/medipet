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
  const filteredMedication = filterCurrentMedication(medication);
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

  const futureAppointments = filterAppointments(appointments, false);
  const upcomingAppointment =
    futureAppointments.length > 0 ? futureAppointments.slice(-1)[0] : null;

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
            onAddApppointment={openApppointmentDrawer}
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
