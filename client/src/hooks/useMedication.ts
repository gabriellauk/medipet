import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../contexts/ApiContext';
import { useAnimals } from '../contexts/AnimalsContext';
import { Medication } from '../types/MedicationTypes';

export function useMedication() {
  const api = useApi();
  const { animal } = useAnimals();
  const [medication, setMedication] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedication = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await api.get<{ data: Medication[] }>(
      `/animal/${animal!.id}/medication`
    );

    if (response.ok) {
      setMedication(response.body.data);
    } else {
      setError('Failed to fetch medication.');
    }

    setLoading(false);
  }, [animal, api]);

  useEffect(() => {
    fetchMedication();
  }, [fetchMedication]);

  return {
    medication: medication,
    medicationLoading: loading,
    medicationError: error,
    refetchMedication: fetchMedication,
  };
}
