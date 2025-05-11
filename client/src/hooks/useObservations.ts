import { Observation } from '../types/ObservationTypes';
import { useEntityData } from './useEntityData';

export function useObservations() {
  const { data, loading, error, refetchData } =
    useEntityData<Observation>('symptom');

  return {
    observations: data,
    observationsLoading: loading,
    observationsError: error,
    refetchObservations: refetchData,
  };
}
