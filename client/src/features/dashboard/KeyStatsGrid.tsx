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

import ROUTES from '../../routes';

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
        path={ROUTES.OBSERVATION_DIARY}
      />
      <KeyStat
        label="Last weighed"
        stat={mostRecentWeight ? mostRecentWeight.date : 'N/A'}
        Icon={IconScaleOutline}
        path={ROUTES.WEIGHT_TRACKER}
      />
      <KeyStat
        label="Weight change"
        stat={weightChange ? weightChange + ' kg' : 'N/A'}
        Icon={weightDecrease ? IconArrowDownRight : IconArrowUpRight}
        path={ROUTES.WEIGHT_TRACKER}
      />
      <KeyStat
        label="Current medications"
        stat={filteredMedicationCount}
        Icon={IconPill}
        path={ROUTES.MEDICATION_SCHEDULE}
      />
    </SimpleGrid>
  );
}
