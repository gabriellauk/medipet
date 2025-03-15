import { createContext, useContext } from 'react';

export type Animal = {
  id: number;
  name: string;
  animalTypeId: number;
};

type AnimalsContextType = {
  animal: Animal | null;
  animals: Animal[];
  animalsLoading: boolean;
  refreshAnimals: () => void;
};

export const AnimalsContext = createContext<AnimalsContextType>({
  animal: null,
  animals: [],
  animalsLoading: true,
  refreshAnimals: () => {},
});

export function useAnimals() {
  return useContext(AnimalsContext);
}
