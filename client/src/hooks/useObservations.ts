import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../contexts/ApiContext';
import { useAnimals } from '../contexts/AnimalsContext';
import { Observation } from '../types/ObservationTypes';

export function useObservations() {
  const api = useApi();
  const { animal } = useAnimals();
  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchObservations = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await api.get<{ data: Observation[] }>(
      `/animal/${animal!.id}/symptom`
    );

    if (response.ok) {
      setObservations(response.body.data);
    } else {
      setError('Failed to fetch observations.');
    }

    setLoading(false);
  }, [animal, api]);

  useEffect(() => {
    fetchObservations();
  }, [fetchObservations]);

  return {
    observations: observations,
    observationsLoading: loading,
    observationsError: error,
    refetchObservations: fetchObservations,
  };
}
