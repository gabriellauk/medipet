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

export type DrawerMode = 'create' | 'update';

export type GenericApiResponse<T> = {
  ok: boolean;
  status: number;
  body: T;
};
