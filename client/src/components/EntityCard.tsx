import { Card, Group, Text } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';

export default function EntityCard({
  title,
  bodyContent,
  onEditClick,
  onDeleteClick,
}: {
  title: string;
  bodyContent: JSX.Element | string;
  onEditClick: () => void;
  onDeleteClick: () => void;
}) {
  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder mb="lg">
      <Group justify="space-between" mt="xs" mb="xs">
        <Text fw={500}>{title}</Text>
        <Group>
          <IconPencil onClick={onEditClick} style={{ cursor: 'pointer' }} />
          <IconTrash onClick={onDeleteClick} style={{ cursor: 'pointer' }} />
        </Group>
      </Group>
      <Text size="sm" c="dimmed">
        {bodyContent}
      </Text>
    </Card>
  );
}
