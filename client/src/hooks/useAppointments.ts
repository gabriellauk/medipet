import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../contexts/ApiContext';
import { useAnimals } from '../contexts/AnimalsContext';
import { Appointment } from '../types/AppointmentTypes';

export function useAppointments() {
  const api = useApi();
  const { animal } = useAnimals();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await api.get<{ data: Appointment[] }>(
      `/animal/${animal!.id}/appointment`
    );

    if (response.ok) {
      setAppointments(response.body.data);
    } else {
      setError('Failed to fetch appointments.');
    }

    setLoading(false);
  }, [animal, api]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments: appointments,
    appointmentsLoading: loading,
    appointmentsError: error,
    refetchAppointments: fetchAppointments,
  };
}
