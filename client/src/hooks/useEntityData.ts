import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../contexts/ApiContext';
import { useAnimals } from '../contexts/AnimalsContext';

export function useEntityData<T>(entity_name: string) {
  const api = useApi();
  const { animal } = useAnimals();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await api.get<{ data: T[] }>(
      `/animal/${animal!.id}/${entity_name}`
    );

    if (response.ok) {
      setData(response.body.data);
    } else {
      setError(`Failed to fetch ${entity_name}.`);
    }

    setLoading(false);
  }, [animal, api, entity_name]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data: data,
    loading: loading,
    error: error,
    refetchData: fetchData,
  };
}
