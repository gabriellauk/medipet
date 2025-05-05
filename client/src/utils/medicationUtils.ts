import { Medication } from '../types/MedicationTypes';
import { formatDate } from './dateUtils';

export const filterCurrentMedication = (
  medications: Medication[]
): Medication[] => {
  const today = new Date().setHours(0, 0, 0, 0);

  return medications.filter((medication) => {
    const startDate = new Date(medication.startDate).setHours(0, 0, 0, 0);
    const endDate = medication.endDate
      ? new Date(medication.endDate).setHours(0, 0, 0, 0)
      : null;
    const isStartDateValid = startDate <= today;
    const isEndDateValid = !endDate || endDate >= today;

    return isStartDateValid && isEndDateValid;
  });
};

export const transformMedication = (medication: Medication) => {
  let frequencyAndDuration = '';
  if (medication.isRecurring === false) return `(one-off)`;
  if (medication.frequencyNumber === 1) {
    if (medication.frequencyUnit === 'day') frequencyAndDuration += 'daily';
    if (medication.frequencyUnit !== 'day')
      frequencyAndDuration += `${medication.frequencyUnit}ly`;
  } else if (medication.frequencyNumber && medication.frequencyNumber > 1) {
    frequencyAndDuration += `every ${medication.frequencyNumber} ${medication.frequencyUnit}s`;
  }
  if (medication.isRecurring && medication.endDate) {
    const endDate = formatDate(medication.endDate);
    frequencyAndDuration += ` until ${endDate}`;
  }
  return `${frequencyAndDuration}`;
};
