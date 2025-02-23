import { Button, Title } from '@mantine/core';
import { useState, useEffect, useRef } from 'react';
import InputField from './InputField';
import { useApi } from '../contexts/ApiContext';
import ErrorArea from './ErrorArea';
import { useAnimals } from '../contexts/AnimalsContext';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';

type Props = {
  close: () => void;
};

export function AddObservation({ close }: Props) {
  type CreateSymptomFormErrors = {
    date?: string;
    description?: string;
  };

  const [formErrors, setFormErrors] = useState<CreateSymptomFormErrors>();
  const [submissionError, setSubmissionError] = useState<string | undefined>();
  const descriptionField = useRef<HTMLInputElement | null>(null);
  const dateField = useRef<HTMLInputElement | null>(null);
  const api = useApi();
  const { animals } = useAnimals();
  const animal = animals[0];

  const [dateValue, setDateValue] = useState<Date | null>(null);

  type CreateSymptomFormData = {
    date: string;
    description: string;
  };

  useEffect(() => {
    descriptionField.current?.focus();
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const description = descriptionField.current?.value;
    const date = dateField.current?.value
      ? dayjs(dateValue).format('YYYY-MM-DD')
      : '';

    const formErrors: CreateSymptomFormErrors = {};

    if (!description) {
      formErrors.description = 'Description must be provided.';
    }
    if (!date) {
      formErrors.date = 'Date must be provided.';
    }
    setSubmissionError(undefined);
    setFormErrors(formErrors);

    if (formErrors && Object.keys(formErrors).length > 0) {
      return;
    }

    if (description && date) {
      const formData: CreateSymptomFormData = {
        description: description,
        date: date,
      };

      const data = await api.post('/animal/' + animal.id + '/symptom', {
        ...formData,
      });

      if (!data.ok) {
        setSubmissionError(data.body.error ? data.body.error : 'Unknown error');
        setFormErrors(formErrors);
      } else {
        setSubmissionError(undefined);
        setFormErrors({});
        close();
        console.log('Success');
      }
    }
  };

  return (
    <>
      <Title ta="center">Add an observation</Title>
      <form onSubmit={onSubmit}>
        <ErrorArea error={submissionError} />
        <InputField
          name="description"
          label="Description"
          error={formErrors?.description}
          fieldRef={descriptionField}
        />
        <DateInput
          value={dateValue}
          onChange={setDateValue}
          label="Date input"
          placeholder="Date input"
          ref={dateField}
        />
        <Button variant="filled" type="submit" mt="lg">
          Add
        </Button>
      </form>
    </>
  );
}
