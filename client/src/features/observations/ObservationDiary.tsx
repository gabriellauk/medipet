import { useApi } from '../../contexts/ApiContext';
import { useAnimals } from '../../contexts/AnimalsContext';
import { useObservations } from '../../hooks/useObservations';
import { useEntityManager } from '../../hooks/useEntityManager';
import ObservationCard from './ObservationCard';
import { ObservationForm } from './ObservationForm';
import EntityDrawer from '../../components/EntityDrawer';
import { Observation } from '../../types/ObservationTypes';

import { EntityList } from '../../components/EntityList';

export default function ObservationDiary() {
  const api = useApi();
  const { animal } = useAnimals();
  const {
    observations,
    observationsLoading,
    observationsError,
    refetchObservations,
  } = useObservations();

  const {
    opened,
    close,
    drawerMode,
    itemToEdit,
    openCreateMode,
    openUpdateMode,
  } = useEntityManager<Observation>();

  const handleDelete = async (id: number) => {
    const response = await api.delete(`/animal/${animal!.id}/symptom/${id}`);
    if (response.ok) {
      refetchObservations();
    }
  };

  return (
    <>
      <h1>Observation Diary</h1>
      <p>
        Here's where you can keep track of any changes to behaviour or anything
        else you may want to make a note of ahead of {animal!.name}'s next
        appointment.
      </p>

      <EntityList<Observation>
        name="observation"
        entities={observations}
        loading={observationsLoading}
        error={observationsError}
        emptyMessage={`No observations noted for ${animal!.name} yet.`}
        onAdd={openCreateMode}
        renderEntity={(observation) => (
          <ObservationCard
            key={observation.id}
            observation={observation}
            animalId={animal!.id}
            deleteObservation={() => handleDelete(observation.id)}
            onEditClick={() => openUpdateMode(observation)}
          />
        )}
      />

      <EntityDrawer opened={opened} onClose={close}>
        {drawerMode === 'create' ? (
          <ObservationForm
            close={close}
            mode="create"
            item={null}
            refetchItems={refetchObservations}
          />
        ) : (
          <ObservationForm
            close={close}
            mode="update"
            item={itemToEdit!}
            refetchItems={refetchObservations}
          />
        )}
      </EntityDrawer>
    </>
  );
}
