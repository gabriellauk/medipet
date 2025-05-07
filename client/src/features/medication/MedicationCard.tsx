import EntityCard from '../../components/EntityCard';
import { Medication } from '../../types/MedicationTypes';
import { transformMedication } from '../../utils/medicationUtils';
import { formatDate } from '../../utils/dateUtils';

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
  const schedule = transformMedication(medication);

  const bodyContent = (
    <>
      {medication.isRecurring
        ? `From ${formatDate(medication.startDate)}: ${schedule}`
        : `On ${formatDate(medication.startDate)} (one-off)`}
      {medication.timesPerDay && (
        <>
          <br />
          {medication.timesPerDay} time(s) a day
        </>
      )}
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
