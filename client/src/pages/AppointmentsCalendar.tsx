import { useState, useEffect } from 'react';
import { Button, Drawer, Container } from '@mantine/core';
import { useApi } from '../contexts/ApiContext';
import { useDisclosure } from '@mantine/hooks';
import { useAnimals } from '../contexts/AnimalsContext';
import AppointmentCard from '../components/AppointmentCard';
import { AppointmentForm } from '../components/AppointmentForm';

export type Appointment = {
  id: number;
  description: string;
  date: string;
  notes: string | null;
};

export type DrawerMode = 'create' | 'update';

export default function AppointmentsCalendar() {
  const api = useApi();
  const { animal } = useAnimals();
  const [opened, { open, close }] = useDisclosure(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode | null>();
  const [itemToEdit, setItemToEdit] = useState<Appointment | null>(null);
  const [appointmentsData, setAppointmentsData] = useState<Appointment[]>([]);

  useEffect(() => {
    (async () => {
      const response = await api.get('/animal/' + animal!.id + '/appointment');
      if (response.ok) {
        setAppointmentsData(response.body.data as Appointment[]);
      } else {
        setAppointmentsData([]);
      }
    })();
  }, [opened, animal, api]);

  async function deleteAppointment(animalId: number, appointmentId: number) {
    await api.delete('/animal/' + animalId + '/appointment/' + appointmentId);
    setAppointmentsData((prevList) =>
      prevList.filter((item) => item.id !== appointmentId)
    );
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

  return (
    <Container>
      <h1>Appointments calendar</h1>
      <p>
        View details about {animal!.name}'s check-ups and other vet appointments
        here.
      </p>
      {appointmentsData.length === 0 && (
        <p>
          <i>No appointments listed for {animal!.name} yet.</i>
        </p>
      )}
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        closeButtonProps={{ 'aria-label': 'Close drawer' }}
      >
        {drawerMode == 'create' ? (
          <AppointmentForm close={close} mode={'create'} item={null} />
        ) : (
          <AppointmentForm close={close} mode={'update'} item={itemToEdit!} />
        )}
      </Drawer>
      <Button onClick={handleOpenDrawerCreate} radius="xl" mb="xl" size="md">
        Add appointment
      </Button>
      {appointmentsData.length > 0 &&
        appointmentsData.map((item) => (
          <AppointmentCard
            key={item.id}
            appointmentId={item.id}
            date={item.date}
            description={item.description}
            notes={item.notes}
            animalId={animal!.id}
            deleteObservation={deleteAppointment}
            onEditClick={() => handleOpenDrawerEdit(item.id)}
          />
        ))}
    </Container>
  );
}
