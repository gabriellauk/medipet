import { useState, useEffect } from 'react';
import { Button, Drawer, Loader } from '@mantine/core';
import { useApi } from '../contexts/ApiContext';
import { useDisclosure } from '@mantine/hooks';
import { AddObservation } from '../components/AddObservation';
import { useAnimals } from '../contexts/AnimalsContext';

export default function ObservationDiary() {
  const [observationsData, setObservationsData] = useState<string | null>();
  const api = useApi();
  const { animals } = useAnimals();
  const animal = animals[0];

  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    (async () => {
      const response = await api.get('/animal/' + animal.id + '/symptom');
      if (response.ok) {
        setObservationsData(response.body.data[0].description);
      } else {
        setObservationsData(null);
      }
    })();
  }, [api]);

  return (
    <>
      {observationsData === undefined ? (
        <Loader color="blue" />
      ) : (
        <>
          {observationsData === null ? (
            <p>No observations noted for {animal.name} yet.</p>
          ) : (
            <>
              <h1>Observation diary</h1>
              <p>
                Here's where you can keep track of any changes to behaviour or
                anything else you may want to make a note of ahead of{' '}
                {animal.name}'s next appointment.
              </p>
              <h2></h2>
              <Drawer
                opened={opened}
                onClose={close}
                title="Add observation"
                position="right"
                closeButtonProps={{ 'aria-label': 'Close drawer' }}
              >
                <AddObservation close={close} />
              </Drawer>

              <Button variant="default" onClick={open}>
                Add observation
              </Button>
              <p>Latest observation: {observationsData}</p>
            </>
          )}
        </>
      )}
    </>
  );
}
