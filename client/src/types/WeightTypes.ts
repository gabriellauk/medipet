import { FormProps } from './GenericTypes';

export type Weight = {
  id: number;
  weight: number;
  date: string;
};

export type WeightFormProps = FormProps<Weight>;

export type WeightFormData = {
  weight: number;
  date: Date | null;
};

export type WeightFormApiData = Omit<WeightFormData, 'date'> & {
  date: string;
};
