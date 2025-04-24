import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../contexts/ApiContext';
import { useAnimals } from '../contexts/AnimalsContext';
import { Weight } from '../types/WeightTypes';

export function useWeights() {
  const api = useApi();
  const { animal } = useAnimals();
  const [weights, setWeights] = useState<Weight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeights = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await api.get<{ data: Weight[] }>(
      `/animal/${animal!.id}/weight`
    );
    if (response.ok) {
      setWeights(response.body.data);
    } else {
      setError('Failed to fetch weights');
    }
    setLoading(false);
  }, [animal, api]);

  useEffect(() => {
    fetchWeights();
  }, [fetchWeights]);

  return {
    weights,
    weightsLoading: loading,
    weightsError: error,
    refetchWeights: fetchWeights,
  };
}
