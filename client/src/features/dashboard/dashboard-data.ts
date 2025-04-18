import {
  IconCalendar,
  IconNotes,
  IconPill,
  IconScaleOutline,
} from '@tabler/icons-react';

import { IconArrowUpRight } from '@tabler/icons-react';

export const icons = {
  medication: IconPill,
  weights: IconScaleOutline,
  observations: IconNotes,
  appointments: IconCalendar,
  up: IconArrowUpRight,
};

export const keyStatsData = [
  {
    label: 'Recent observations',
    stats: '22',
    icon: 'observations',
  },
  {
    label: 'Last weighed',
    stats: '15th April',
    icon: 'weights',
  },

  {
    label: 'Weight change',
    stats: '0.1kg',
    icon: 'up',
  },
  {
    label: 'Current medications',
    stats: '3',
    icon: 'medication',
  },
] as const;

// const keyStatsData = [
//   {
//     label: 'Recent observations',
//     stats: '0',
//     icon: 'observations',
//   },
//   {
//     label: 'Last weighed',
//     stats: 'N/A',
//     icon: 'weights',
//   },

//   {
//     label: 'Weight change',
//     stats: 'N/A',
//     icon: 'up',
//   },
//   {
//     label: 'Current medications',
//     stats: '0',
//     icon: 'medication',
//   },
// ] as const;
