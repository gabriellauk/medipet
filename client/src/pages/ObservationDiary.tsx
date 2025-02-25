import { useState, useEffect } from 'react';
import { Button, Drawer, Container } from '@mantine/core';
import { useApi } from '../contexts/ApiContext';
import { useDisclosure } from '@mantine/hooks';
import { AddObservation } from '../components/AddObservation';
import { useAnimals } from '../contexts/AnimalsContext';
import ObservationCard from '../components/ObservationCard';

export default function ObservationDiary() {
  type Symptom = {
    id: number;
    description: string;
    date: string;
  };

  const api = useApi();
  const { animals } = useAnimals();
  const animal = animals[0];
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    (async () => {
      const response = await api.get('/animal/' + animal.id + '/symptom');
      if (response.ok) {
        setObservationsData(response.body.data as Symptom[]);
      } else {
        setObservationsData([]);
      }
    })();
  });

  function capitaliseEachWord(str: string) {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  const animalName = capitaliseEachWord(animal.name);

  const [observationsData, setObservationsData] = useState<Symptom[]>([]);

  async function deleteObservation(animalId: number, symptomId: number) {
    await api.delete('/animal/' + animalId + '/symptom/' + symptomId);
    setObservationsData((prevList) =>
      prevList.filter((item) => item.id !== symptomId)
    );
  }

  return (
    <Container>
      <h1>Observation diary</h1>
      <p>
        Here's where you can keep track of any changes to behaviour or anything
        else you may want to make a note of ahead of {animalName}'s next
        appointment.
      </p>
      {observationsData.length === 0 && (
        <p>
          <i>No observations noted for {animalName} yet.</i>
        </p>
      )}
      <Drawer
        opened={opened}
        onClose={close}
        title="Add observation"
        position="right"
        closeButtonProps={{ 'aria-label': 'Close drawer' }}
      >
        <AddObservation close={close} />
      </Drawer>
      <Button onClick={open} radius="xl" mb="xl" size="md">
        Add observation
      </Button>
      {observationsData.length > 0 &&
        observationsData.map((item) => (
          <ObservationCard
            key={item.id}
            symptomId={item.id}
            date={item.date}
            description={item.description}
            animalId={animal.id}
            deleteObservation={deleteObservation}
          />
        ))}
      ;
    </Container>
  );
}
