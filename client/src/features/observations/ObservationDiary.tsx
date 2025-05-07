import { useState } from 'react';
import { Button, Loader } from '@mantine/core';
import { useApi } from '../../contexts/ApiContext';
import { useDisclosure } from '@mantine/hooks';
import { ObservationForm } from './ObservationForm';
import { useAnimals } from '../../contexts/AnimalsContext';
import ObservationCard from './ObservationCard';
import { DrawerMode } from '../../types/CommonTypes';
import { Observation } from '../../types/ObservationTypes';
import { useObservations } from '../../hooks/useObservations';
import EntityDrawer from '../../components/EntityDrawer';

export default function ObservationDiary() {
  const api = useApi();
  const { animal } = useAnimals();
  const [opened, { open, close }] = useDisclosure(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode | null>();
  const [itemToEdit, setItemToEdit] = useState<Observation | null>(null);
  const {
    observations,
    observationsLoading,
    observationsError,
    refetchObservations,
  } = useObservations();

  async function deleteObservation(animalId: number, symptomId: number) {
    const response = await api.delete(
      '/animal/' + animalId + '/symptom/' + symptomId
    );
    if (response.ok) {
      refetchObservations();
    }
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

  const addObservationButton = (
    <Button onClick={handleOpenDrawerCreate} radius="xl" mb="xl" size="md">
      Add observation
    </Button>
  );

  return (
    <>
      <h1>Observation diary</h1>
      <p>
        Here's where you can keep track of any changes to behaviour or anything
        else you may want to make a note of ahead of {animal!.name}'s next
        appointment.
      </p>
      {observationsLoading ? (
        <Loader />
      ) : observationsError ? (
        <p>
          <i>{observationsError}</i>
        </p>
      ) : observations.length === 0 ? (
        <>
          <p>
            <i>No observations noted for {animal!.name} yet.</i>
          </p>
          {addObservationButton}
        </>
      ) : (
        <>
          {addObservationButton}
          {observations.map((item) => (
            <ObservationCard
              key={item.id}
              observation={item}
              animalId={animal!.id}
              deleteObservation={deleteObservation}
              onEditClick={() => handleOpenDrawerEdit(item.id)}
            />
          ))}
        </>
      )}
      <EntityDrawer opened={opened} onClose={close}>
        {drawerMode == 'create' ? (
          <ObservationForm
            close={close}
            mode={'create'}
            item={null}
            refetchItems={refetchObservations}
          />
        ) : (
          <ObservationForm
            close={close}
            mode={'update'}
            item={itemToEdit!}
            refetchItems={refetchObservations}
          />
        )}
      </EntityDrawer>
    </>
  );
}
