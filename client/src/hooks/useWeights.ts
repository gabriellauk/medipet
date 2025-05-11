import { Weight } from '../types/WeightTypes';
import { useEntityData } from './useEntityData';

export function useWeights() {
  const { data, loading, error, refetchData } = useEntityData<Weight>('weight');

  return {
    weights: data,
    weightsLoading: loading,
    weightsError: error,
    refetchWeights: refetchData,
  };
}
