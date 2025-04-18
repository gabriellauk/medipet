import { IconArrowLeft } from '@tabler/icons-react';
import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  NativeSelect,
  Paper,
  Stepper,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../contexts/ApiContext';
import ErrorArea from '../../components/ErrorArea';
import { useAnimals } from '../../contexts/AnimalsContext';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

export function CreateAnimal() {
  const { logout } = useAuth();
  const { refreshAnimals } = useAnimals();
  const navigate = useNavigate();
  const api = useApi();
  const [submissionError, setSubmissionError] = useState('');

  type CreateAnimalFormData = {
    name: string;
    animalType: string;
  };

  enum AnimalTypeId {
    Cat = 1,
    Dog = 2,
    Rabbit = 3,
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAnimalFormData>({
    defaultValues: {
      name: '',
      animalType: '',
    },
  });

  const onSubmit = async (data: CreateAnimalFormData) => {
    const animalTypeId =
      AnimalTypeId[data.animalType as keyof typeof AnimalTypeId];

    const formData = {
      name: data.name,
      animalTypeId: animalTypeId,
    };

    const response = await api.post('/animal', formData);

    if (!response.ok) {
      setSubmissionError('An error occurred. Please try again.');
      return;
    }

    refreshAnimals();
    navigate('/dashboard');
  };

  return (
    <Container size={460} my={30}>
      <Stepper iconSize={42} active={1} mb="lg">
        <Stepper.Step label="Step 1" description="Create an account" />
        <Stepper.Step label="Step 2" description="Add your pet" />
      </Stepper>
      <Title ta="center">Welcome!</Title>
      <Text c="dimmed" fz="sm" ta="center">
        <p>
          MediPet gives you a place to store a health record for your pet -
          helping you remember appointments, keep track of any medication and
          monitor changes to symptoms.
        </p>
        <p>
          <b>To finish creating your account, tell us a bit about your pet.</b>
        </p>
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ErrorArea error={submissionError} />

          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name must be provided' }}
            render={({ field }) => (
              <TextInput
                {...field}
                label="Your pet's name"
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            name="animalType"
            control={control}
            rules={{
              required: 'Species must be provided',
            }}
            render={({ field }) => (
              <NativeSelect
                {...field}
                label="Species"
                data={[
                  { value: '', label: 'Select species' },
                  { value: 'Cat', label: 'Cat' },
                  { value: 'Dog', label: 'Dog' },
                  { value: 'Rabbit', label: 'Rabbit' },
                ]}
                error={errors.animalType?.message}
              />
            )}
          />

          <Button type="submit" mt="lg">
            Continue
          </Button>
        </form>

        <Anchor c="dimmed" size="sm">
          <Center inline mt="lg">
            <IconArrowLeft size={12} stroke={1.5} />
            <Box ml={5}>
              <form onSubmit={logout}>
                <UnstyledButton type="submit">Log out</UnstyledButton>
              </form>
            </Box>
          </Center>
        </Anchor>
      </Paper>
    </Container>
  );
}
