import { useEffect, useState } from 'react';
import { useApi } from './ApiContext';
import { AnimalsContext, Animal } from './AnimalsContext';
import { useNavigate } from 'react-router-dom';

export default function AnimalsContextProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [animalsLoading, setAnimalsLoading] = useState(true);

  const api = useApi();
  const navigate = useNavigate();

  const refreshAnimals = async () => {
    const response = await api.get('/animal');
    if (response.status === 200) {
      setAnimals(response.body.data);
      setAnimalsLoading(false);
      navigate('/');
    }
  };

  useEffect(() => {
    const checkAnimals = async () => {
      const response = await api.get('/animal');
      if (response.status === 200) {
        setAnimals(response.body.data);
        setAnimalsLoading(false);
      } else {
        setAnimals([]);
        setAnimalsLoading(false);
      }
    };

    checkAnimals();
  }, []);

  return (
    <AnimalsContext.Provider
      value={{ animals, animalsLoading, refreshAnimals }}
    >
      {children}
    </AnimalsContext.Provider>
  );
}
