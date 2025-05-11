import { Medication } from '../types/MedicationTypes';
import { useEntityData } from './useEntityData';

export function useMedication() {
  const { data, loading, error, refetchData } =
    useEntityData<Medication>('medication');

  return {
    medication: data,
    medicationLoading: loading,
    medicationError: error,
    refetchMedication: refetchData,
  };
}
