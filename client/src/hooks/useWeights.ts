import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../contexts/ApiContext';
import { useAnimals } from '../contexts/AnimalsContext';
import { Weight } from '../types/WeightTypes';

export function useWeights() {
  const api = useApi();
  const { animal } = useAnimals();
  const [weights, setWeights] = useState<Weight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeights = useCallback(async () => {
    if (!animal) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get<{ data: Weight[] }>(
        `/animal/${animal.id}/weight`
      );
      if (response.ok) {
        setWeights(response.body.data);
      } else {
        setError('Failed to fetch weights');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
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
