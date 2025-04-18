import { Timeline, Text } from '@mantine/core';
import { IconNotes } from '@tabler/icons-react';

export default function ObservationsTimeline() {
  // const observations = null;

  const observations = (
    <Timeline
      active={3}
      bulletSize={24}
      lineWidth={2}
      align="right"
      color="blue"
    >
      <Timeline.Item bullet={<IconNotes size={12} />} title="15th April 2025">
        <Text c="dimmed" size="sm">
          Tried new food (Blink Tuna & Salmon), seems better
        </Text>
        <Text size="xs" mt={4}>
          1 day ago
        </Text>
      </Timeline.Item>

      <Timeline.Item bullet={<IconNotes size={12} />} title="14th April 2025">
        <Text c="dimmed" size="sm">
          Refused dinner, could not be persuaded
        </Text>
        <Text size="xs" mt={4}>
          2 days ago
        </Text>
      </Timeline.Item>

      <Timeline.Item title="11th April 2024" bullet={<IconNotes size={12} />}>
        <Text c="dimmed" size="sm">
          Breathing seems to be back to normal completely now. ...
        </Text>
        <Text size="xs" mt={4}>
          1 year ago
        </Text>
      </Timeline.Item>
    </Timeline>
  );

  return <>{observations ? observations : 'No observations recorded yet'}</>;
}
