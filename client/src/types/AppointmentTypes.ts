import { FormProps } from './GenericTypes';

export type Appointment = {
  id: number;
  description: string;
  date: string;
  notes: string | null;
};

export type AppointmentFormProps = FormProps<Appointment>;

export type AppointmentFormData = {
  date: Date | null;
  description: string;
  notes?: string;
};
