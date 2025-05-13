import { useApi } from '../../contexts/ApiContext';
import { useAnimals } from '../../contexts/AnimalsContext';
import { MedicationForm } from './MedicationForm';
import MedicationCard from './MedicationCard';
import { Medication } from '../../types/MedicationTypes';
import { useMedication } from '../../hooks/useMedication';
import EntityDrawer from '../../components/EntityDrawer';
import { useEntityManager } from '../../hooks/useEntityManager';
import { EntityList } from '../../components/EntityList';

export default function MedicationSchedule() {
  const api = useApi();
  const { animal } = useAnimals();
  const { medication, medicationLoading, medicationError, refetchMedication } =
    useMedication();

  const {
    opened,
    close,
    drawerMode,
    itemToEdit,
    openCreateMode,
    openUpdateMode,
  } = useEntityManager<Medication>();

  const handleDelete = async (id: number) => {
    const response = await api.delete(`/animal/${animal!.id}/medication/${id}`);
    if (response.ok) {
      refetchMedication();
    }
  };

  return (
    <>
      <h1>Medication schedule</h1>
      <p>Record {animal!.name}'s regular and one-off medications here.</p>

      <EntityList<Medication>
        name="medication"
        entities={medication}
        loading={medicationLoading}
        error={medicationError}
        emptyMessage={`No medication listed for ${animal!.name} yet.`}
        onAdd={openCreateMode}
        renderEntity={(medication) => (
          <MedicationCard
            key={medication.id}
            medication={medication}
            animalId={animal!.id}
            deleteMedication={() => handleDelete(medication.id)}
            onEditClick={() => openUpdateMode(medication)}
          />
        )}
      />

      <EntityDrawer opened={opened} onClose={close}>
        {drawerMode == 'create' ? (
          <MedicationForm
            close={close}
            mode={'create'}
            item={null}
            refetchItems={refetchMedication}
          />
        ) : (
          <MedicationForm
            close={close}
            mode={'update'}
            item={itemToEdit!}
            refetchItems={refetchMedication}
          />
        )}
      </EntityDrawer>
    </>
  );
}
