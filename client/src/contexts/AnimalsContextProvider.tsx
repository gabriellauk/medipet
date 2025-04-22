import { useEffect, useMemo, useState } from 'react';
import { useApi } from './ApiContext';
import { AnimalsContext } from './AnimalsContext';
import { useNavigate } from 'react-router-dom';
import { Animal } from '../types/AnimalTypes';

export default function AnimalsContextProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [animalsLoading, setAnimalsLoading] = useState(true);

  const api = useApi();
  const navigate = useNavigate();

  function capitaliseEachWord(str: string) {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  function updateAnimals(responseData: Animal[]) {
    const animalsData = responseData;
    animalsData.forEach((animal: Animal) => {
      animal.name = capitaliseEachWord(animal.name);
    });
    setAnimals(animalsData);
    setAnimalsLoading(false);
  }

  const refreshAnimals = async () => {
    const response = await api.get<{ data: Animal[] }>('/animal');
    if (response.status === 200) {
      updateAnimals(response.body.data);
      navigate('/');
    }
  };

  useEffect(() => {
    const checkAnimals = async () => {
      const response = await api.get<{ data: Animal[] }>('/animal');
      if (response.status === 200) {
        updateAnimals(response.body.data);
      } else {
        setAnimals([]);
        setAnimalsLoading(false);
      }
    };

    checkAnimals();
  }, []);

  const animal = useMemo(() => animals[0] || null, [animals]);

  return (
    <AnimalsContext.Provider
      value={{ animal, animals, animalsLoading, refreshAnimals }}
    >
      {children}
    </AnimalsContext.Provider>
  );
}
