import { SimpleGrid } from '@mantine/core';
import {
  IconNotes,
  IconScaleOutline,
  IconArrowDownRight,
  IconArrowUpRight,
  IconPill,
} from '@tabler/icons-react';
import KeyStat from './components/KeyStat/KeyStat';
import { Weight } from '../../types/WeightTypes';

export function KeyStatsGrid({
  observationsCount,
  mostRecentWeight,
  weightChange,
  filteredMedicationCount,
}: {
  observationsCount: number;
  mostRecentWeight: Weight | null;
  weightChange: number | null;
  filteredMedicationCount: number;
}) {
  const weightDecrease = weightChange && weightChange < 0 ? true : false;

  return (
    <SimpleGrid cols={{ base: 1, sm: 4 }}>
      <KeyStat
        label="Recent observations"
        stat={observationsCount}
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
        stat={filteredMedicationCount}
        Icon={IconPill}
      />
    </SimpleGrid>
  );
}
