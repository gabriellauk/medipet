export type Observation = {
  id: number;
  description: string;
  date: string;
};

export type ObservationFormProps =
  | {
      close: () => void;
      mode: 'create';
      item: null;
      refetchObservations: () => void;
    }
  | {
      close: () => void;
      mode: 'update';
      item: Observation;
      refetchObservations: () => void;
    };

export type ObservationFormData = {
  date: Date | null;
  description: string;
};
