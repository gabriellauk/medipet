import { useState, useEffect } from 'react';
import { Button, Drawer, Container } from '@mantine/core';
import { useApi } from '../../contexts/ApiContext';
import { useDisclosure } from '@mantine/hooks';
import { ObservationForm } from './ObservationForm';
import { useAnimals } from '../../contexts/AnimalsContext';
import ObservationCard from './ObservationCard';
import { DrawerMode } from '../../types/CommonTypes';
import { Observation } from '../../types/ObservationTypes';

export default function ObservationDiary() {
  const api = useApi();
  const { animal } = useAnimals();
  const [opened, { open, close }] = useDisclosure(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode | null>();
  const [itemToEdit, setItemToEdit] = useState<Observation | null>(null);
  const [observationsData, setObservationsData] = useState<Observation[]>([]);

  useEffect(() => {
    (async () => {
      const response = await api.get('/animal/' + animal!.id + '/symptom');
      if (response.ok) {
        setObservationsData(response.body.data as Observation[]);
      } else {
        setObservationsData([]);
      }
    })();
  }, [opened, animal, api]);

  async function deleteObservation(animalId: number, symptomId: number) {
    await api.delete('/animal/' + animalId + '/symptom/' + symptomId);
    setObservationsData((prevList) =>
      prevList.filter((item) => item.id !== symptomId)
    );
  }

  async function handleOpenDrawerCreate() {
    setDrawerMode('create');
    open();
  }

  async function handleOpenDrawerEdit(itemId: number) {
    const response = await api.get(
      '/animal/' + animal!.id + '/symptom/' + itemId
    );
    if (response.ok) {
      setItemToEdit(response.body as Observation);
      setDrawerMode('update');
      open();
    } else {
      setItemToEdit(null);
    }
  }

  return (
    <Container>
      <h1>Observation diary</h1>
      <p>
        Here's where you can keep track of any changes to behaviour or anything
        else you may want to make a note of ahead of {animal!.name}'s next
        appointment.
      </p>
      {observationsData.length === 0 && (
        <p>
          <i>No observations noted for {animal!.name} yet.</i>
        </p>
      )}
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        closeButtonProps={{ 'aria-label': 'Close drawer' }}
      >
        {drawerMode == 'create' ? (
          <ObservationForm close={close} mode={'create'} item={null} />
        ) : (
          <ObservationForm close={close} mode={'update'} item={itemToEdit!} />
        )}
      </Drawer>
      <Button onClick={handleOpenDrawerCreate} radius="xl" mb="xl" size="md">
        Add observation
      </Button>
      {observationsData.length > 0 &&
        observationsData.map((item) => (
          <ObservationCard
            key={item.id}
            observationId={item.id}
            date={item.date}
            description={item.description}
            animalId={animal!.id}
            deleteObservation={deleteObservation}
            onEditClick={() => handleOpenDrawerEdit(item.id)}
          />
        ))}
    </Container>
  );
}
