import { useState } from 'react';
import { useApi } from '../contexts/ApiContext';
import { useAnimals } from '../contexts/AnimalsContext';

export function useEntityForm<T extends { id: number }, TFormApiData>({
  mode,
  item,
  endpoint,
  refetchItems,
  close,
}: {
  mode: 'create' | 'update';
  item: T | null;
  endpoint: string;
  refetchItems: () => void;
  close: () => void;
}) {
  const api = useApi();
  const { animal } = useAnimals();
  const [submissionError, setSubmissionError] = useState('');

  const submitEntity = async (data: Partial<TFormApiData>) => {
    let apiResponse;

    if (mode === 'create') {
      apiResponse = await api.post(`/animal/${animal!.id}/${endpoint}`, data);
    } else {
      const changedFields = Object.keys(data).reduce((acc, key) => {
        const typedKey = key as keyof TFormApiData;
        if (data[typedKey] !== (item as TFormApiData)[typedKey]) {
          acc[typedKey] = data[typedKey];
        }
        return acc;
      }, {} as Partial<TFormApiData>);

      if (Object.keys(changedFields).length === 0) {
        return;
      }

      apiResponse = await api.patch(
        `/animal/${animal!.id}/${endpoint}/${item!.id}`,
        changedFields
      );
    }

    if (apiResponse.ok) {
      refetchItems();
      close();
    } else {
      setSubmissionError('An error occurred. Please try again later.');
    }
  };

  return { submitEntity, submissionError };
}
