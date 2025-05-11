import { formatLongDate } from '../../utils/dateUtils';
import { Weight } from '../../types/WeightTypes';
import EntityCard from '../../components/EntityCard';

export default function WeightCard({
  weight,
  animalId,
  deleteWeight,
  onEditClick,
}: {
  weight: Weight;
  animalId: number;
  deleteWeight: (animalId: number, weightId: number) => void;
  onEditClick: () => void;
}) {
  return (
    <EntityCard
      title={formatLongDate(weight.date)}
      bodyContent={`${weight.weight / 1000} kg`}
      onEditClick={onEditClick}
      onDeleteClick={() => deleteWeight(animalId, weight.id)}
    />
  );
}
