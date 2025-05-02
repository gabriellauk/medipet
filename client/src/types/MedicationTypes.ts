export type TimeUnit = 'day' | 'week' | 'month' | 'year';

export type Medication = {
  id: number;
  name: string;
  startDate: string;
  isRecurring: boolean;
  timesPerDay?: number;
  frequencyNumber?: number;
  frequencyUnit?: TimeUnit;
  durationNumber?: number;
  durationUnit?: TimeUnit;
  notes?: string;
  endDate?: string;
};

export type MedicationFormProps =
  | {
      close: () => void;
      mode: 'create';
      item: null;
      refetchMedication: () => void;
    }
  | {
      close: () => void;
      mode: 'update';
      item: Medication;
      refetchMedication: () => void;
    };

export type MedicationFormData = {
  name: string;
  isRecurring: string;
  timesPerDay?: number;
  frequencyNumber?: number;
  frequencyUnit?: TimeUnit;
  durationNumber?: number;
  durationUnit?: TimeUnit;
  startDate: Date | null;
  notes?: string;
};
