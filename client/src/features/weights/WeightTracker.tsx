import { useState } from 'react';
import { Button, Drawer, Loader } from '@mantine/core';
import { useApi } from '../../contexts/ApiContext';
import { useDisclosure } from '@mantine/hooks';
import { useAnimals } from '../../contexts/AnimalsContext';
import { WeightForm } from './WeightForm';
import WeightCard from './WeightCard';
import { useWeights } from '../../hooks/useWeights';
import { DrawerMode } from '../../types/CommonTypes';
import { Weight } from '../../types/WeightTypes';

export default function WeightTracker() {
  const api = useApi();
  const { animal } = useAnimals();
  const [opened, { open, close }] = useDisclosure(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode | null>();
  const [itemToEdit, setItemToEdit] = useState<Weight | null>(null);

  const { weights, weightsLoading, weightsError, refetchWeights } =
    useWeights();

  async function deleteWeight(animalId: number, weightId: number) {
    const response = await api.delete(`/animal/${animalId}/weight/${weightId}`);
    if (response.ok) {
      refetchWeights();
    }
  }

  async function handleOpenDrawerCreate() {
    setDrawerMode('create');
    open();
  }

  async function handleOpenDrawerEdit(itemId: number) {
    const response = await api.get(
      '/animal/' + animal!.id + '/weight/' + itemId
    );
    if (response.ok) {
      const weight = response.body as Weight;
      setItemToEdit(weight);
      setDrawerMode('update');
      open();
    } else {
      setItemToEdit(null);
    }
  }

  const addWeightButton = (
    <Button onClick={handleOpenDrawerCreate} radius="xl" mb="xl" size="md">
      Add weight
    </Button>
  );

  return (
    <>
      <h1>Weight tracker</h1>
      <p>Monitor any fluctuations in {animal!.name}'s weight here.</p>
      {weightsLoading ? (
        <Loader />
      ) : weightsError ? (
        <p>
          <i>{weightsError}</i>
        </p>
      ) : weights.length === 0 ? (
        <>
          <p>
            <i>{animal!.name} doesn't have any weights listed yet.</i>
          </p>
          {addWeightButton}
        </>
      ) : (
        <>
          {addWeightButton}
          {weights.map((item) => (
            <WeightCard
              key={item.id}
              weight={item}
              animalId={animal!.id}
              deleteWeight={deleteWeight}
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
          <WeightForm
            close={close}
            mode={'create'}
            item={null}
            refetchItems={refetchWeights}
          />
        ) : (
          <WeightForm
            close={close}
            mode={'update'}
            item={itemToEdit!}
            refetchItems={refetchWeights}
          />
        )}
      </Drawer>
    </>
  );
}
