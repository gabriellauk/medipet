import { FormProps } from "./CommonTypes";

export type Observation = {
  id: number;
  description: string;
  date: string;
};

export type ObservationFormProps = FormProps<Observation>;

export type ObservationFormData = {
  date: Date | null;
  description: string;
};
