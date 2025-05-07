import { useApi } from '../../contexts/ApiContext';
import { useAnimals } from '../../contexts/AnimalsContext';
import AppointmentCard from './AppointmentCard';
import { AppointmentForm } from './AppointmentForm';
import { Appointment } from '../../types/AppointmentTypes';
import { useAppointments } from '../../hooks/useAppointments';
import EntityDrawer from '../../components/EntityDrawer';
import { useEntityManager } from '../../hooks/useEntityManager';
import { EntityList } from '../../components/EntityList';

export default function AppointmentsCalendar() {
  const api = useApi();
  const { animal } = useAnimals();
  const {
    appointments,
    appointmentsLoading,
    appointmentsError,
    refetchAppointments: refetchApppontments,
  } = useAppointments();

  const {
    opened,
    close,
    drawerMode,
    itemToEdit,
    openCreateMode,
    openUpdateMode,
  } = useEntityManager<Appointment>();

  const handleDelete = async (id: number) => {
    const response = await api.delete(
      `/animal/${animal!.id}/appointment/${id}`
    );
    if (response.ok) {
      refetchApppontments();
    }
  };

  return (
    <>
      <h1>Appointments calendar</h1>
      <p>
        View details about {animal!.name}'s check-ups and other vet appointments
        here.
      </p>

      <EntityList<Appointment>
        name="appointment"
        entities={appointments}
        loading={appointmentsLoading}
        error={appointmentsError}
        emptyMessage={`No apppointments listed for ${animal!.name} yet.`}
        onAdd={openCreateMode}
        renderEntity={(appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            animalId={animal!.id}
            deleteAppointment={() => handleDelete(appointment.id)}
            onEditClick={() => openUpdateMode(appointment)}
          />
        )}
      />

      <EntityDrawer opened={opened} onClose={close}>
        {drawerMode == 'create' ? (
          <AppointmentForm
            close={close}
            mode={'create'}
            item={null}
            refetchItems={refetchApppontments}
          />
        ) : (
          <AppointmentForm
            close={close}
            mode={'update'}
            item={itemToEdit!}
            refetchItems={refetchApppontments}
          />
        )}
      </EntityDrawer>
    </>
  );
}
