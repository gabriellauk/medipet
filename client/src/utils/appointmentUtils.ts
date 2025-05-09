import { Appointment } from '../types/AppointmentTypes';

export const filterAppointments = (
  appointments: Appointment[],
  isPast: boolean
): Appointment[] => {
  const today = new Date().setHours(0, 0, 0, 0);

  return appointments.filter((appointment) => {
    const date = new Date(appointment.date).setHours(0, 0, 0, 0);
    const isDateInPast = date < today;

    if (isPast) {
      return isDateInPast;
    } else {
      return !isDateInPast;
    }
  });
};
