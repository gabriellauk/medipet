import { Medication } from '../types/MedicationTypes';
import { describe, it, expect } from 'vitest';
import { buildMedicationScheduleDescription } from './medicationUtils';

describe('buildMedicationScheduleDescription', () => {
  it('should return correct description for a one-off medication', () => {
    const medication: Medication = {
      id: 1,
      name: 'Some one-off medication',
      isRecurring: false,
      startDate: '2025-01-01',
    };

    const result = buildMedicationScheduleDescription(medication);
    expect(result).toEqual('Once on 1 January 2025');
  });

  it('should return correct description for a fixed-term daily medication', () => {
    const medication: Medication = {
      id: 1,
      name: 'Some fixed-term daily medication',
      isRecurring: true,
      timesPerDay: 1,
      frequencyNumber: 1,
      frequencyUnit: 'day',
      startDate: '2025-01-01',
      endDate: '2025-01-10',
    };

    const result = buildMedicationScheduleDescription(medication);
    expect(result).toEqual(
      'One dose every day from 1 January 2025 until 10 January 2025'
    );
  });

  it('should return correct description for an ongoing daily medication', () => {
    const medication: Medication = {
      id: 1,
      name: 'Some ongoing daily medication',
      isRecurring: true,
      timesPerDay: 1,
      frequencyNumber: 1,
      frequencyUnit: 'day',
      startDate: '2025-01-01',
    };

    const result = buildMedicationScheduleDescription(medication);
    expect(result).toEqual('One dose every day from 1 January 2025 (ongoing)');
  });

  it('should return correct description for a fixed-term multi-dose medication', () => {
    const medication: Medication = {
      id: 1,
      name: 'Some fixed-term multi-dose medication',
      isRecurring: true,
      timesPerDay: 2,
      frequencyNumber: 2,
      frequencyUnit: 'day',
      startDate: '2025-01-01',
      endDate: '2025-02-01',
    };

    const result = buildMedicationScheduleDescription(medication);
    expect(result).toEqual(
      '2 doses every 2 days from 1 January 2025 until 1 February 2025'
    );
  });

  it('should return correct description for an ongoing multi-dose medication', () => {
    const medication: Medication = {
      id: 1,
      name: 'Some ongoing multi-dose medication',
      isRecurring: true,
      timesPerDay: 2,
      frequencyNumber: 2,
      frequencyUnit: 'day',
      startDate: '2025-01-01',
    };

    const result = buildMedicationScheduleDescription(medication);
    expect(result).toEqual(
      '2 doses every 2 days from 1 January 2025 (ongoing)'
    );
  });
});
