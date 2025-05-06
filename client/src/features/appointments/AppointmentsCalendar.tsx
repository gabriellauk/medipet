import { useState } from 'react';
import { Button, Drawer, Loader } from '@mantine/core';
import { useApi } from '../../contexts/ApiContext';
import { useDisclosure } from '@mantine/hooks';
import { useAnimals } from '../../contexts/AnimalsContext';
import AppointmentCard from './AppointmentCard';
import { AppointmentForm } from './AppointmentForm';
import { Appointment } from '../../types/AppointmentTypes';
import { DrawerMode } from '../../types/CommonTypes';
import { useAppointments } from '../../hooks/useAppointments';

export default function AppointmentsCalendar() {
  const api = useApi();
  const { animal } = useAnimals();
  const [opened, { open, close }] = useDisclosure(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode | null>();
  const [itemToEdit, setItemToEdit] = useState<Appointment | null>(null);

  const {
    appointments,
    appointmentsLoading,
    appointmentsError,
    refetchAppointments: refetchApppontments,
  } = useAppointments();

  async function deleteAppointment(animalId: number, appointmentId: number) {
    const response = await api.delete(
      '/animal/' + animalId + '/appointment/' + appointmentId
    );
    if (response.ok) {
      refetchApppontments();
    }
  }

  async function handleOpenDrawerCreate() {
    setDrawerMode('create');
    open();
  }

  async function handleOpenDrawerEdit(itemId: number) {
    const response = await api.get(
      '/animal/' + animal!.id + '/appointment/' + itemId
    );
    if (response.ok) {
      setItemToEdit(response.body as Appointment);
      setDrawerMode('update');
      open();
    } else {
      setItemToEdit(null);
    }
  }

  const addAppointmentButton = (
    <Button onClick={handleOpenDrawerCreate} radius="xl" mb="xl" size="md">
      Add appointment
    </Button>
  );

  return (
    <>
      <h1>Appointments calendar</h1>
      <p>
        View details about {animal!.name}'s check-ups and other vet appointments
        here.
      </p>
      {appointmentsLoading ? (
        <Loader />
      ) : appointmentsError ? (
        <p>
          <i>{appointmentsError}</i>
        </p>
      ) : appointments.length === 0 ? (
        <>
          <p>
            <i>No appointments listed for {animal!.name} yet.</i>
          </p>
          {addAppointmentButton}
        </>
      ) : (
        <>
          {addAppointmentButton}
          {appointments.length > 0 &&
            appointments.map((item) => (
              <AppointmentCard
                key={item.id}
                appointmentId={item.id}
                date={item.date}
                description={item.description}
                notes={item.notes}
                animalId={animal!.id}
                deleteAppointment={deleteAppointment}
                onEditClick={() => handleOpenDrawerEdit(item.id)}
              />
            ))}
        </>
      )}
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        closeButtonProps={{ 'aria-label': 'Close drawer' }}
      >
        {drawerMode == 'create' ? (
          <AppointmentForm
            close={close}
            mode={'create'}
            item={null}
            refetchAppointments={refetchApppontments}
          />
        ) : (
          <AppointmentForm
            close={close}
            mode={'update'}
            item={itemToEdit!}
            refetchAppointments={refetchApppontments}
          />
        )}
      </Drawer>
    </>
  );
}
