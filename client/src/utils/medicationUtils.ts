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

export const buildConciseMedicationScheduleDescription = (
  medication: Medication
) => {
  let scheduleDescription = '';
  if (!medication.isRecurring) return `(one-off)`;
  if (medication.frequencyNumber === 1) {
    if (medication.frequencyUnit === 'day') scheduleDescription += 'daily';
    if (medication.frequencyUnit !== 'day')
      scheduleDescription += `${medication.frequencyUnit}ly`;
  } else if (medication.frequencyNumber && medication.frequencyNumber > 1) {
    scheduleDescription += `every ${medication.frequencyNumber} ${medication.frequencyUnit}s`;
  }
  if (medication.isRecurring && medication.endDate) {
    const endDate = formatDate(medication.endDate);
    scheduleDescription += ` until ${endDate}`;
  }
  return `${scheduleDescription}`;
};

export const buildMedicationScheduleDescription = (medication: Medication) => {
  let scheduleDescription = '';
  if (medication.timesPerDay === 1) {
    scheduleDescription = 'One dose';
  } else {
    scheduleDescription = `${medication.timesPerDay} doses`;
  }
  if (!medication.isRecurring) {
    return `${scheduleDescription} on ${formatDate(medication.startDate)}`;
  } else {
    if (medication.frequencyNumber! === 1) {
      scheduleDescription += ` every ${medication.frequencyUnit}`;
    } else {
      scheduleDescription += ` every ${medication.frequencyNumber} ${medication.frequencyUnit}s`;
    }
    scheduleDescription += ` from ${formatDate(medication.startDate)}`;
    if (medication.endDate) {
      scheduleDescription += ` until ${formatDate(medication.endDate)}`;
    }
  }
  return scheduleDescription;
};
