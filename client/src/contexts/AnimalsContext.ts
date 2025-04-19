import { createContext, useContext } from 'react';
import { AnimalsContextType } from '../types/AnimalTypes';

export const AnimalsContext = createContext<AnimalsContextType>({
  animal: null,
  animals: [],
  animalsLoading: true,
  refreshAnimals: () => {},
});

export function useAnimals() {
  return useContext(AnimalsContext);
}
