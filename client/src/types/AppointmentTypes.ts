export type Appointment = {
  id: number;
  description: string;
  date: string;
  notes: string | null;
};

export type AppointmentFormProps =
  | {
      close: () => void;
      mode: 'create';
      item: null;
      refetchAppointments: () => void;
    }
  | {
      close: () => void;
      mode: 'update';
      item: Appointment;
      refetchAppointments: () => void;
    };

export type AppointmentFormData = {
  date: Date | null;
  description: string;
  notes?: string;
};
