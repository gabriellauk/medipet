export type Weight = {
  id: number;
  weight: number;
  date: string;
};

export type WeightFormProps =
  | {
      close: () => void;
      mode: 'create';
      item: null;
      refetchWeights: () => void;
    }
  | {
      close: () => void;
      mode: 'update';
      item: Weight;
      refetchWeights: () => void;
    };

export type WeightFormData = {
  weight: number;
  date: Date | null;
};
