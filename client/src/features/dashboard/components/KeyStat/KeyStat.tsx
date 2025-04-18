import { Center, Group, Paper, Text } from '@mantine/core';
import styles from './KeyStat.module.css';
export default function KeyStat({ stat, Icon }: { stat: any; Icon: any }) {
  return (
    <Paper withBorder radius="md" p="xs" className={styles.keyStat}>
      <Group>
        <Center>
          <Icon size={40} stroke={1.5} />
        </Center>
        <div>
          <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
            {stat.label}
          </Text>
          <Text fw={700} size="xl">
            {stat.stats}
          </Text>
        </div>
      </Group>
    </Paper>
  );
}
