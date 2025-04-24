import { Button, Container, Loader, Paper } from '@mantine/core';
import { useWeights } from '../../hooks/useWeights';

import { Text } from '@mantine/core';

import { LineChart } from '@mantine/charts';

import { Grid } from '@mantine/core';
import { icons } from './dashboard-data';
import { keyStatsData } from './dashboard-data';
import { Group, SimpleGrid } from '@mantine/core';
import Profile from './components/Profile/Profile';
import UpcomingAppointment from './components/UpcomingAppointment';
import KeyStat from './components/KeyStat/KeyStat';
import ObservationsTimeline from './components/ObservationsTimeline';
import MedicationSummary from './components/MedicationSummary';
import DemoDisclaimer from '../../components/DemoDisclaimer';

import styles from './Dashboard.module.css';
import { useAnimals } from '../../contexts/AnimalsContext';
import { useAppointments } from '../../hooks/useAppointments';

const stats = keyStatsData.map((stat) => {
  const Icon = icons[stat.icon];
  return <KeyStat stat={stat} Icon={Icon} key={stat.label} />;
});

export default function Dashboard() {
  const { animal } = useAnimals();
  const { weights, weightsLoading } = useWeights();
  const { appointments, appointmentsLoading, appointmentsError } =
    useAppointments();

  const upcomingAppointment =
    appointments.length > 0 ? appointments.slice(-1)[0] : null;

  const sortedWeights = [...weights].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const mostRecentWeight =
    sortedWeights.length > 0
      ? sortedWeights[sortedWeights.length - 1].weight / 100
      : null;

  return (
    <Container my="md">
      {weightsLoading || appointmentsLoading ? (
        <Loader />
      ) : (
        <>
          <DemoDisclaimer />
          <p></p>
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
              <SimpleGrid cols={{ base: 1, sm: 4 }}>{stats}</SimpleGrid>
            </Grid.Col>
          </Grid>

          <Grid align="stretch" gutter="md" mt="md">
            <Grid.Col span={{ base: 12, xs: 12 }}>
              <b>{animal!.name}'s weight over time</b>
              <p></p>
              <LineChart
                h={300}
                data={sortedWeights.map(({ id, ...rest }) => rest)}
                dataKey="date"
                series={[{ name: 'weight', color: 'indigo.6' }]}
                curveType="linear"
              />
            </Grid.Col>
          </Grid>

          <Grid align="stretch" gutter="md" mt="md">
            <Grid.Col span={{ base: 12, xs: 12 }}>
              <Paper
                withBorder
                radius="md"
                p="lg"
                className={styles.callToAction}
              >
                <Group justify="space-between" mt="xs" mb="xs">
                  {/* TODO: Move to separate component */}
                  {/* <Text fw={500}>No weights or observations listed yet.</Text> */}
                  <Text fw={500}>Noticed a new symptom or behaviour?</Text>
                  <Group>
                    <Button variant="filled" color="blue">
                      Add weight
                    </Button>
                    <Button variant="filled" color="blue">
                      Add observation
                    </Button>
                  </Group>
                </Group>
              </Paper>
            </Grid.Col>
          </Grid>

          <Grid align="stretch" gutter="md" mt="md">
            {/* <Grid.Col span={{ base: 12, xs: 12 }}><MedicationSummary /></Grid.Col> */}
            <Grid.Col span={{ base: 12, xs: 6 }}>
              <MedicationSummary />
            </Grid.Col>
            <Grid.Col span={{ base: 12, xs: 6 }}>
              <Text ta="right">
                <b>Latest observations</b>
              </Text>
              <p></p>
              <ObservationsTimeline />
            </Grid.Col>
          </Grid>
        </>
      )}
    </Container>
  );
}
