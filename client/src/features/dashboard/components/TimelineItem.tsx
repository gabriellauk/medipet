import { Timeline, Text } from '@mantine/core';
import { IconNotes } from '@tabler/icons-react';
import { Observation } from '../../../types/ObservationTypes';
import { formatLongDate, getRelativeTime } from '../../../utils/dateUtils';

export default function TimelineItem({
  observation,
}: {
  observation: Observation;
}) {
  return (
    <Timeline.Item
      bullet={<IconNotes size={12} />}
      title={formatLongDate(observation.date)}
    >
      <Text c="dimmed" size="sm">
        {observation.description}
      </Text>
      <Text size="xs" mt={4}>
        {getRelativeTime(observation.date)}
      </Text>
    </Timeline.Item>
  );
}
