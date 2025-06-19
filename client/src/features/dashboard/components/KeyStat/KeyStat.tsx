import { Group, Paper, Text } from '@mantine/core';
import styles from './KeyStat.module.css';
import { Icon, IconProps } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export default function KeyStat({
  label,
  stat,
  Icon,
  path,
}: {
  label: string;
  stat: number | string;
  Icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;
  path: string;
}) {
  return (
    <Link to={path} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Paper withBorder radius="md" p="xs" className={styles.keyStat}>
        <Group>
          <Icon size={40} stroke={1.5} />
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
    </Link>
  );
}
