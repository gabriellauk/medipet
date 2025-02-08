import { IconArrowLeft } from '@tabler/icons-react';
import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Paper,
  Stepper,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { useState, useEffect, useRef } from 'react';
import InputField from '../components/InputField';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../contexts/ApiProvider';
import ErrorArea from '../components/ErrorArea';


const logoutUrl =
import.meta.env.VITE_REACT_APP_BASE_API_URL + '/logout';

export function CreateAnimal2() {
    interface CreateAnimalFormErrors {
        name?: string;
        animalType?: string;
      }
    
      const [formErrors, setFormErrors] = useState<CreateAnimalFormErrors>();
      const [submissionError, setSubmissionError] = useState<string | undefined>();
      const nameField = useRef<HTMLInputElement | null>(null);
      const animalTypeField = useRef<HTMLInputElement | null>(null);
      const navigate = useNavigate();
      const api = useApi();
    
      interface CreateAnimalFormData {
        name: string;
        animalTypeId: string;
      }
    
      useEffect(() => {
        nameField.current?.focus();
      }, []);
    
      const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
    
        const name = nameField.current?.value;
        const animalType = animalTypeField.current?.value;
    
        const formErrors: CreateAnimalFormErrors = {};
    
        if (!name) {
          formErrors.name = 'Name must be provided.';
        }
        if (!animalType) {
          formErrors.animalType = 'Animal type must be provided.';
        }
        setSubmissionError(undefined);
        setFormErrors(formErrors);
    
        if (formErrors && Object.keys(formErrors).length > 0) {
          return;
        }
    
        if (name && animalType) {
          const formData: CreateAnimalFormData = {
            name: name,
            animalTypeId: animalType,
          };
    
          const data = await api.post('/animal', { ...formData });
    
          if (!data.ok) {
            setSubmissionError(data.body.error ? data.body.error : 'Unknown error');
            setFormErrors(formErrors);
          } else {
            setSubmissionError(undefined);
            setFormErrors({});
            console.log("Just before test line")
            navigate('/test');
            console.log("Just after test line")
          }
        }
      };
    
  return (
    <Container size={460} my={30}>
        <Stepper iconSize={42} active={1} mb="lg">
      <Stepper.Step label="Step 1" description="Create an account" />
      <Stepper.Step label="Step 2" description="Add your pet" />
    </Stepper>
      <Title ta="center">
        Welcome!
      </Title>
      <Text c="dimmed" fz="sm" ta="center">
      <p>MediPet gives you a place to store a health record for your pet - helping you remember appointments, keep track of any medication and monitor changes to symptoms.</p>
      <p><b>To finish creating your account, tell us a bit about your pet.</b></p>
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <form onSubmit={onSubmit}>
        <ErrorArea error={submissionError} />
        <InputField
          name="name"
          label="Your pet's name"
          error={formErrors?.name}
          fieldRef={nameField}
        />
        <InputField
          name="animalType"
          label="Species - change to dropdown later"
          error={formErrors?.animalType}
          fieldRef={animalTypeField}
        />
        <Button variant="filled" type="submit" mt="lg">
          Continue
        </Button>
      </form>
          <Anchor c="dimmed" size="sm">
            <Center inline mt="lg">
              <IconArrowLeft size={12} stroke={1.5} />
              <Box ml={5}>
                <form action={logoutUrl} method="POST">
          <UnstyledButton type="submit">Log out</UnstyledButton>
        </form>
        </Box>
            </Center>
          </Anchor>
      </Paper>
    </Container>
  );
}