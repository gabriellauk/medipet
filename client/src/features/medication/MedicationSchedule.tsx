import { useState } from 'react';
import { Button, Drawer, Container, Loader } from '@mantine/core';
import { useApi } from '../../contexts/ApiContext';
import { useDisclosure } from '@mantine/hooks';
import { useAnimals } from '../../contexts/AnimalsContext';
import { MedicationForm } from './MedicationForm';
import MedicationCard from './MedicationCard';
import { DrawerMode } from '../../types/CommonTypes';
import { Medication } from '../../types/MedicationTypes';
import { useMedication } from '../../hooks/useMedication';

export default function MedicationSchedule() {
  const api = useApi();
  const { animal } = useAnimals();
  const [opened, { open, close }] = useDisclosure(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode | null>();
  const [itemToEdit, setItemToEdit] = useState<Medication | null>(null);

  const { medication, medicationLoading, medicationError, refetchMedication } =
    useMedication();

  async function deleteMedication(animalId: number, medicationId: number) {
    const response = await api.delete(
      '/animal/' + animalId + '/medication/' + medicationId
    );
    if (response.ok) {
      refetchMedication();
    }
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

  const addMedicationButton = (
    <Button onClick={handleOpenDrawerCreate} radius="xl" mb="xl" size="md">
      Add medication
    </Button>
  );

  return (
    <Container>
      <h1>Medication schedule</h1>
      <p>Record {animal!.name}'s regular and one-off medication here.</p>
      {medicationLoading ? (
        <Loader />
      ) : medicationError ? (
        <p>
          <i>{medicationError}</i>
        </p>
      ) : medication.length === 0 ? (
        <>
          <p>
            <i>No medication listed for {animal!.name} yet.</i>
          </p>
          {addMedicationButton}
        </>
      ) : (
        <>
          {addMedicationButton}
          {medication.map((item) => (
            <MedicationCard
              key={item.id}
              medicationId={item.id}
              name={item.name}
              isRecurring={item.isRecurring}
              startDate={item.startDate}
              timesPerDay={item.timesPerDay}
              frequencyNumber={item.frequencyNumber}
              frequencyUnit={item.frequencyUnit}
              durationNumber={item.durationNumber}
              durationUnit={item.durationUnit}
              endDate={item.endDate}
              notes={item.notes}
              animalId={animal!.id}
              deleteMedication={deleteMedication}
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
          <MedicationForm
            close={close}
            mode={'create'}
            item={null}
            refetchMedication={refetchMedication}
          />
        ) : (
          <MedicationForm
            close={close}
            mode={'update'}
            item={itemToEdit!}
            refetchMedication={refetchMedication}
          />
        )}
      </Drawer>
    </Container>
  );
}
