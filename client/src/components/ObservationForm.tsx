import { Button, Title } from '@mantine/core';
import { useState, useEffect, useRef } from 'react';
import InputField from './InputField';
import { useApi } from '../contexts/ApiContext';
import ErrorArea from './ErrorArea';
import { useAnimals } from '../contexts/AnimalsContext';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { Symptom } from '../pages/ObservationDiary';
import { GenericApiResponse } from '../ApiClient';

type Props =
  | {
      close: () => void;
      mode: 'create';
      item: null;
    }
  | {
      close: () => void;
      mode: 'update';
      item: Symptom;
    };

type CreateSymptomFormData = {
  date: string;
  description: string;
};

type UpdateSymptomFormData = {
  date?: string;
  description?: string;
};

type CreateOrUpdateSymptomFormErrors = {
  date?: string;
  description?: string;
};

export function ObservationForm({ close, mode, item }: Props) {
  const api = useApi();
  const { animals } = useAnimals();
  const animal = animals[0];

  const descriptionField = useRef<HTMLInputElement | null>(null);
  const dateField = useRef<HTMLInputElement | null>(null);
  const [dateValue, setDateValue] = useState<Date | null>(null);

  const [formErrors, setFormErrors] =
    useState<CreateOrUpdateSymptomFormErrors>();
  const [submissionError, setSubmissionError] = useState<string | undefined>();

  useEffect(() => {
    if (mode === 'update') {
      const dateObject = new Date(item.date);
      setDateValue(dateObject);
      descriptionField.current!.value = item.description;
    }
  }, [mode, item]);

  useEffect(() => {
    descriptionField.current?.focus();
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const description = descriptionField.current?.value;
    const date = dateField.current?.value
      ? dayjs(dateValue).format('YYYY-MM-DD')
      : '';

    const formErrors: CreateOrUpdateSymptomFormErrors = {};
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

    const handleResponse = (response: GenericApiResponse) => {
      if (!response.ok) {
        setSubmissionError(
          response.body?.error ? response.body.error : 'Unknown error'
        );
        return;
      }
      setSubmissionError(undefined);
      close();
    };

    let apiResponse: GenericApiResponse;
    if (description && date) {
      if (mode === 'create') {
        const formData: CreateSymptomFormData = {
          description: description,
          date: date,
        };
        apiResponse = await api.post(
          '/animal/' + animal.id + '/symptom',
          formData
        );
      } else {
        const changedFields: UpdateSymptomFormData = {};
        if (description != item.description) {
          changedFields.description = description;
        }
        if (date != item.date) {
          changedFields.date = date;
        }
        if (Object.keys(changedFields).length == 0) {
          setSubmissionError('No changes to submit');
          return;
        }
        apiResponse = await api.patch(
          '/animal/' + animal.id + '/symptom/' + item.id,
          changedFields
        );
      }
      handleResponse(apiResponse);
    }
  };

  return (
    <>
      <Title ta="center">
        {mode == 'create' ? 'Add an observation' : 'Edit observation'}
      </Title>
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
          ref={dateField}
        />
        <Button variant="filled" type="submit" mt="lg">
          {mode === 'create' ? 'Add' : 'Update'}
        </Button>
      </form>
    </>
  );
}
