import { Observation } from '../types/ObservationTypes';

export const getObservationsFromPastThreeMonths = (
  observations: Observation[]
): Observation[] => {
  const today = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(today.getMonth() - 3);

  return observations.filter((observation) => {
    const observationDate = new Date(observation.date);
    return observationDate >= threeMonthsAgo && observationDate <= today;
  });
};
