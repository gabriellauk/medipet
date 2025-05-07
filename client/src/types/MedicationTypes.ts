import { FormProps } from "./CommonTypes";

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

export type MedicationFormProps = FormProps<Medication>;

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
