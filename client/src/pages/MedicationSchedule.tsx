import { useState, useEffect } from 'react';
import { Button, Drawer, Container } from '@mantine/core';
import { useApi } from '../contexts/ApiContext';
import { useDisclosure } from '@mantine/hooks';
import { useAnimals } from '../contexts/AnimalsContext';
import { MedicationForm } from '../components/MedicationForm';
import MedicationCard from '../components/MedicationCard';

export type Medication = {
  id: number;
  name: string;
  isRecurring: boolean;
  timesPerDay: number;
  frequencyNumber: number;
  frequencyUnit: string;
  durationNumber: number;
  durationUnit: string;
  startDate: string;
  endDate: string;
};

export type DrawerMode = 'create' | 'update';

export default function MedicationSchedule() {
  const api = useApi();
  const { animal } = useAnimals();
  const [opened, { open, close }] = useDisclosure(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode | null>();
  const [itemToEdit, setItemToEdit] = useState<Medication | null>(null);
  const [medicationsData, setMedicationsData] = useState<Medication[]>([]);

  useEffect(() => {
    (async () => {
      const response = await api.get('/animal/' + animal!.id + '/medication');
      if (response.ok) {
        setMedicationsData(response.body.data as Medication[]);
      } else {
        setMedicationsData([]);
      }
    })();
  }, [opened, animal, api]);

  async function deleteMedication(animalId: number, medicationId: number) {
    await api.delete('/animal/' + animalId + '/medication/' + medicationId);
    setMedicationsData((prevList) =>
      prevList.filter((item) => item.id !== medicationId)
    );
  }

  async function handleOpenDrawerCreate() {
    setDrawerMode('create');
    open();
  }

  async function handleOpenDrawerEdit(itemId: number) {
    const response = await api.get(
      '/animal/' + animal!.id + '/medication/' + itemId
    );
    if (response.ok) {
      setItemToEdit(response.body as Medication);
      setDrawerMode('update');
      open();
    } else {
      setItemToEdit(null);
    }
  }

  return (
    <Container>
      <h1>Medication schedule</h1>
      <p>Intro text.</p>
      {medicationsData.length === 0 && (
        <p>
          <i>No medication listed for {animal!.name} yet.</i>
        </p>
      )}
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        closeButtonProps={{ 'aria-label': 'Close drawer' }}
      >
        {drawerMode == 'create' ? (
          <MedicationForm close={close} mode={'create'} item={null} />
        ) : (
          <MedicationForm close={close} mode={'update'} item={itemToEdit!} />
        )}
      </Drawer>
      <Button onClick={handleOpenDrawerCreate} radius="xl" mb="xl" size="md">
        Add medication
      </Button>
      {medicationsData.length > 0 &&
        medicationsData.map((item) => (
          <MedicationCard
            key={item.id}
            medicationId={item.id}
            name={item.name}
            isRecurring={item.isRecurring}
            startDate={item.startDate}
            frequencyUnit={item.frequencyUnit}
            animalId={animal!.id}
            deleteMedication={deleteMedication}
            onEditClick={() => handleOpenDrawerEdit(item.id)}
          />
        ))}
    </Container>
  );
}
