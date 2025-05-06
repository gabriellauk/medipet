import { Loader, Title } from '@mantine/core';
import { useWeights } from '../../hooks/useWeights';

import { LineChart } from '@mantine/charts';

import { Grid } from '@mantine/core';
import { SimpleGrid } from '@mantine/core';
import Profile from './components/Profile/Profile';
import UpcomingAppointment from './components/UpcomingAppointment';
import KeyStat from './components/KeyStat/KeyStat';
import ObservationsTimeline from './components/ObservationsTimeline';
import MedicationSummary from './components/MedicationSummary';

import { useAnimals } from '../../contexts/AnimalsContext';
import { useAppointments } from '../../hooks/useAppointments';
import { useMedication } from '../../hooks/useMedication';
import { filterCurrentMedication } from '../../utils/medicationUtils';
import { useObservations } from '../../hooks/useObservations';

import {
  IconArrowDownRight,
  IconNotes,
  IconPill,
  IconScaleOutline,
} from '@tabler/icons-react';

import { IconArrowUpRight } from '@tabler/icons-react';
import { getObservationsFromPastThreeMonths } from '../../utils/observationsUtils';
import CallToActionBanner from './CallToActionBanner';

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

  const weightDecrease = weightChange && weightChange < 0 ? true : false;

  const latestObservations = observations ? observations.slice(0, 3) : [];

  return (
    <>
      {weightsLoading ||
      appointmentsLoading ||
      medicationLoading ||
      observationsLoading ? (
        <Loader />
      ) : (
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
              <SimpleGrid cols={{ base: 1, sm: 4 }}>
                <KeyStat
                  label="Recent observations"
                  stat={getObservationsFromPastThreeMonths(observations).length}
                  Icon={IconNotes}
                />
                <KeyStat
                  label="Last weighed"
                  stat={mostRecentWeight ? mostRecentWeight.date : 'N/A'}
                  Icon={IconScaleOutline}
                />
                <KeyStat
                  label="Weight change"
                  stat={weightChange ? weightChange + ' kg' : 'N/A'}
                  Icon={weightDecrease ? IconArrowDownRight : IconArrowUpRight}
                />
                <KeyStat
                  label="Current medication"
                  stat={filteredMedication.length}
                  Icon={IconPill}
                />
              </SimpleGrid>
            </Grid.Col>
          </Grid>

          {weights.length > 0 && (
            <Grid align="stretch" gutter="md" mt="md">
              <Grid.Col span={{ base: 12, xs: 12 }}>
                <Title order={2} size="h3">
                  {animal!.name}'s weight over time
                </Title>
                <p></p>
                <LineChart
                  h={300}
                  data={sortedWeights.map(({ id, ...rest }) => rest)}
                  dataKey="date"
                  series={[{ name: 'weight', color: 'indigo.6' }]}
                  curveType="linear"
                  valueFormatter={(value) => `${value / 1000} kg`}
                />
              </Grid.Col>
            </Grid>
          )}

          <Grid align="stretch" gutter="md" mt="md">
            <CallToActionBanner observations={observations} weights={weights} />
          </Grid>

          <Grid align="stretch" gutter="md" mt="md">
            {latestObservations.length === 0 ? (
              <Grid.Col span={{ base: 12, xs: 12 }}>
                <MedicationSummary
                  medication={filteredMedication}
                  error={medicationError}
                />
              </Grid.Col>
            ) : (
              <>
                <Grid.Col span={{ base: 12, xs: 6 }}>
                  <MedicationSummary
                    medication={filteredMedication}
                    error={medicationError}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 6 }}>
                  <ObservationsTimeline observations={latestObservations} />
                </Grid.Col>
              </>
            )}
          </Grid>
        </>
      )}
    </>
  );
}
