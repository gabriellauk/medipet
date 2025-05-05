import { Timeline, Text } from '@mantine/core';
import { Observation } from '../../../types/ObservationTypes';
import TimelineItem from './TimelineItem';

export default function ObservationsTimeline({
  observations,
}: {
  observations: Observation[];
}) {
  return (
    <>
      <Text ta="right">
        <b>Latest observations</b>
      </Text>
      <p></p>
      <Timeline
        active={3}
        bulletSize={24}
        lineWidth={2}
        align="right"
        color="blue"
      >
        {observations.map((obs) => (
          <TimelineItem observation={obs} />
        ))}
      </Timeline>
    </>
  );
}
