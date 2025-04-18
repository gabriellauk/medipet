import { useState } from 'react';
import { Button, Drawer, Container, Text } from '@mantine/core';
import { useApi } from '../../contexts/ApiContext';
import { useDisclosure } from '@mantine/hooks';
import { useAnimals } from '../../contexts/AnimalsContext';
import { WeightForm } from './WeightForm';
import WeightCard from './WeightCard';
import { useWeights } from '../../hooks/useWeights';

export type Weight = {
  id: number;
  weight: number;
  date: string;
};

export type DrawerMode = 'create' | 'update';

export default function ObservationDiary() {
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
      setItemToEdit(response.body as Weight);
      setDrawerMode('update');
      open();
    } else {
      setItemToEdit(null);
    }
  }

  return (
    <Container>
      <h1>Weight tracker</h1>
      <p>Monitor any fluctuations in {animal!.name}'s weight here.</p>
      {!weightsLoading && !weightsError && weights.length === 0 && (
        <p>
          <i>{animal!.name} doesn't have any weights listed yet.</i>
        </p>
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
            refetchWeights={refetchWeights}
          />
        ) : (
          <WeightForm
            close={close}
            mode={'update'}
            item={itemToEdit!}
            refetchWeights={refetchWeights}
          />
        )}
      </Drawer>
      <Button onClick={handleOpenDrawerCreate} radius="xl" mb="xl" size="md">
        Add weight
      </Button>
      {weightsLoading && <Text>Loading weights...</Text>}
      {weightsError && <Text>Failed to load weights: {weightsError}</Text>}
      {weights.length > 0 &&
        weights.map((item) => (
          <WeightCard
            key={item.id}
            weightId={item.id}
            date={item.date}
            weight={item.weight / 100}
            animalId={animal!.id}
            deleteWeight={deleteWeight}
            onEditClick={() => handleOpenDrawerEdit(item.id)}
          />
        ))}
    </Container>
  );
}
