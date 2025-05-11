import { Appointment } from '../types/AppointmentTypes';
import { useEntityData } from './useEntityData';

export function useAppointments() {
  const { data, loading, error, refetchData } =
    useEntityData<Appointment>('appointment');

  return {
    appointments: data,
    appointmentsLoading: loading,
    appointmentsError: error,
    refetchAppointments: refetchData,
  };
}
