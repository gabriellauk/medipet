import EntityCard from '../../components/EntityCard';
import { Medication } from '../../types/MedicationTypes';
import { buildMedicationScheduleDescription } from '../../utils/medicationUtils';

export default function MedicationCard({
  medication,
  animalId,
  deleteMedication,
  onEditClick,
}: {
  medication: Medication;
  animalId: number;
  deleteMedication: (animalId: number, medicationId: number) => void;
  onEditClick: () => void;
}) {
  const scheduleDescription = buildMedicationScheduleDescription(medication);

  const bodyContent = (
    <>
      {scheduleDescription}
      {medication.notes && (
        <>
          <br />
          {medication.notes}
        </>
      )}
    </>
  );

  return (
    <EntityCard
      title={medication.name}
      bodyContent={bodyContent}
      onEditClick={onEditClick}
      onDeleteClick={() => deleteMedication(animalId, medication.id)}
    />
  );
}
