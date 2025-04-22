export type FormProps<T> =
  | {
      close: () => void;
      mode: 'create';
      item: null;
    }
  | {
      close: () => void;
      mode: 'update';
      item: T;
    };

export type DrawerMode = 'create' | 'update';

export type GenericApiResponse<T> = {
  ok: boolean;
  status: number;
  body: T;
};
