import { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';

export type FormProps<T> =
  | {
      close: () => void;
      mode: 'create';
      item: null;
      refetchItems: () => void;
    }
  | {
      close: () => void;
      mode: 'update';
      item: T;
      refetchItems: () => void;
    };

export type GenericApiResponse<T> = {
  ok: boolean;
  status: number;
  body: T;
};

export type EntityListProps<T> = {
  name: string;
  entities: T[];
  loading: boolean;
  error: string | null;
  emptyMessage: string;
  onAdd: () => void;
  renderEntity: (entity: T) => JSX.Element;
};

export type FormFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: RegisterOptions<T, Path<T>>;
  label?: string;
  placeholder?: string;
  description?: string;
  error?: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'radio' | 'date';
  options?: { value: string; label: string }[];
  suffix?: string;
  maxDate?: Date;
};
