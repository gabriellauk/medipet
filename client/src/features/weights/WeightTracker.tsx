import { useApi } from '../../contexts/ApiContext';
import { useAnimals } from '../../contexts/AnimalsContext';
import { WeightForm } from './WeightForm';
import WeightCard from './WeightCard';
import { useWeights } from '../../hooks/useWeights';
import { Weight } from '../../types/WeightTypes';
import EntityDrawer from '../../components/EntityDrawer';
import { EntityList } from '../../components/EntityList';
import { useEntityManager } from '../../hooks/useEntityManager';

export default function WeightTracker() {
  const api = useApi();
  const { animal } = useAnimals();

  const { weights, weightsLoading, weightsError, refetchWeights } =
    useWeights();

  const {
    opened,
    close,
    drawerMode,
    itemToEdit,
    openCreateMode,
    openUpdateMode,
  } = useEntityManager<Weight>();

  const handleDelete = async (id: number) => {
    const response = await api.delete(`/animal/${animal!.id}/weight/${id}`);
    if (response.ok) {
      refetchWeights();
    }
  };

  return (
    <>
      <h1>Weight tracker</h1>
      <p>Monitor any fluctuations in {animal!.name}'s weight here.</p>

      <EntityList<Weight>
        name="weight"
        entities={weights}
        loading={weightsLoading}
        error={weightsError}
        emptyMessage={`${animal!.name} doesn't have any weights listed yet.`}
        onAdd={openCreateMode}
        renderEntity={(weight) => (
          <WeightCard
            key={weight.id}
            weight={weight}
            animalId={animal!.id}
            deleteWeight={() => handleDelete(weight.id)}
            onEditClick={() => openUpdateMode(weight)}
          />
        )}
      />

      <EntityDrawer opened={opened} onClose={close}>
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
      </EntityDrawer>
    </>
  );
}
