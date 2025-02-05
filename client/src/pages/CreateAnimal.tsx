import { useState, useEffect, useRef } from 'react';
import InputField from '../components/InputField';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../contexts/ApiProvider';
import ErrorArea from '../components/ErrorArea';
import { Button } from '@mantine/core';

export default function CreateAnimal() {

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
        };
        if (!animalType) {
        formErrors.animalType = 'Animal type must be provided.';
        };
        setSubmissionError(undefined)
        setFormErrors(formErrors);

        if (formErrors && Object.keys(formErrors).length > 0) {
        return; 
      }

      if (name && animalType) {
          const formData: CreateAnimalFormData = {
            name: name,
            animalTypeId: animalType,
          };

        const data = await api.post('/animal', {...formData});

        if (!data.ok) {
            setSubmissionError(data.body.error ? data.body.error : "Unknown error")
            setFormErrors(formErrors);
        }
        else {
            setSubmissionError(undefined)
            setFormErrors({});
            navigate('/test');
        }

        }
  };

    return (
        <>
            <h1>Add a pet</h1>
            <form onSubmit={onSubmit}>
            <ErrorArea error={submissionError} />
        <InputField
          name="name" label="Your pet's name"
          error={formErrors?.name} fieldRef={nameField} />
        <InputField
          name="animalType" label="Species - change to dropdown later"
          error={formErrors?.animalType} fieldRef={animalTypeField} />
        <Button variant="filled" type="submit">Add</Button>
      </form>
        </>
    )
}