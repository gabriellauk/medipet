import { Center, Group, Paper, Text } from '@mantine/core';
import styles from './KeyStat.module.css';
import { Icon, IconProps } from '@tabler/icons-react';

export default function KeyStat({
  label,
  stat,
  Icon,
}: {
  label: string;
  stat: number | string;
  Icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;
}) {
  return (
    <Paper withBorder radius="md" p="xs" className={styles.keyStat}>
      <Group>
        <Center>
          <Icon size={40} stroke={1.5} />
        </Center>
        <div>
          <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
            {label}
          </Text>
          <Text fw={700} size="xl">
            {stat}
          </Text>
        </div>
      </Group>
    </Paper>
  );
}
