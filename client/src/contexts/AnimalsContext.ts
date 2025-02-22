import { createContext, useContext } from 'react';

export type Animal = {
  id: number;
  name: string;
  animalTypeId: number;
};

type AnimalsContextType = {
  animals: Animal[];
  animalsLoading: boolean;
  refreshAnimals: () => void;
};

export const AnimalsContext = createContext<AnimalsContextType>({
  animals: [],
  animalsLoading: true,
  refreshAnimals: () => {},
});

export function useAnimals() {
  return useContext(AnimalsContext);
}
