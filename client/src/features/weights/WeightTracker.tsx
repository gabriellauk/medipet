import { useState, useEffect } from 'react';
import { Button, Drawer, Container } from '@mantine/core';
import { useApi } from '../../contexts/ApiContext';
import { useDisclosure } from '@mantine/hooks';
import { useAnimals } from '../../contexts/AnimalsContext';
import { WeightForm } from './WeightForm';
import WeightCard from './WeightCard';

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
  const [weightsData, setWeightsData] = useState<Weight[]>([]);

  useEffect(() => {
    (async () => {
      const response = await api.get('/animal/' + animal!.id + '/weight');
      if (response.ok) {
        setWeightsData(response.body.data as Weight[]);
      } else {
        setWeightsData([]);
      }
    })();
  }, [opened, animal, api]);

  async function deleteWeight(animalId: number, weightId: number) {
    await api.delete('/animal/' + animalId + '/weight/' + weightId);
    setWeightsData((prevList) =>
      prevList.filter((item) => item.id !== weightId)
    );
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
      {weightsData.length === 0 && (
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
          <WeightForm close={close} mode={'create'} item={null} />
        ) : (
          <WeightForm close={close} mode={'update'} item={itemToEdit!} />
        )}
      </Drawer>
      <Button onClick={handleOpenDrawerCreate} radius="xl" mb="xl" size="md">
        Add weight
      </Button>
      {weightsData.length > 0 &&
        weightsData.map((item) => (
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
