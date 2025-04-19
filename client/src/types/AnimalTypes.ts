export enum AnimalTypeId {
  Cat = 1,
  Dog = 2,
  Rabbit = 3,
}

export type Animal = {
  id: number;
  name: string;
  animalTypeId: number;
};

export type CreateAnimalFormData = {
  name: string;
  animalType: string;
};

export type AnimalsContextType = {
  animal: Animal | null;
  animals: Animal[];
  animalsLoading: boolean;
  refreshAnimals: () => void;
};
