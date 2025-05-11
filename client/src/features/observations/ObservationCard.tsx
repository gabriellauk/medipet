import { Observation } from '../../types/ObservationTypes';
import EntityCard from '../../components/EntityCard';
import { formatLongDate } from '../../utils/dateUtils';

export default function ObservationCard({
  observation,
  animalId,
  deleteObservation,
  onEditClick,
}: {
  observation: Observation;
  animalId: number;
  deleteObservation: (animalId: number, symptomId: number) => void;
  onEditClick: () => void;
}) {
  return (
    <EntityCard
      title={formatLongDate(observation.date)}
      bodyContent={observation.description}
      onEditClick={onEditClick}
      onDeleteClick={() => deleteObservation(animalId, observation.id)}
    />
  );
}
