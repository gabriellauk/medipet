import { formatLongDate } from '../../utils/dateUtils';
import { Appointment } from '../../types/AppointmentTypes';
import EntityCard from '../../components/EntityCard';

export default function AppointmentCard({
  appointment,
  animalId,
  deleteAppointment,
  onEditClick,
}: {
  appointment: Appointment;
  animalId: number;
  deleteAppointment: (animalId: number, appointmentId: number) => void;
  onEditClick: () => void;
}) {
  const bodyContent = (
    <>
      {appointment.description}
      {appointment.notes && (
        <>
          <br />
          {appointment.notes}
        </>
      )}
    </>
  );

  return (
    <EntityCard
      title={formatLongDate(appointment.date)}
      bodyContent={bodyContent}
      onEditClick={onEditClick}
      onDeleteClick={() => deleteAppointment(animalId, appointment.id)}
    />
  );
}
