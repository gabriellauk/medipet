import { Button, TextInput, Title } from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { useApi } from '../../contexts/ApiContext';
import ErrorArea from '../../components/ErrorArea';
import { useAnimals } from '../../contexts/AnimalsContext';
import { Observation } from './ObservationDiary';
import { GenericApiResponse } from '../../ApiClient';
import { useState } from 'react';

type Props =
  | {
      close: () => void;
      mode: 'create';
      item: null;
    }
  | {
      close: () => void;
      mode: 'update';
      item: Observation;
    };

type ObservationFormData = {
  date: Date | null;
  description: string;
};

export function ObservationForm({ close, mode, item }: Props) {
  const api = useApi();
  const { animal } = useAnimals();
  const [submissionError, setSubmissionError] = useState('');

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ObservationFormData>({
    defaultValues: {
      date: mode === 'update' ? new Date(item!.date) : null,
      description: mode === 'update' ? item!.description : '',
    },
  });

  const onSubmit = async (data: ObservationFormData) => {
    const formData = {
      description: data.description,
      date: data.date ? dayjs(data.date).format('YYYY-MM-DD') : '',
    };

    let apiResponse: GenericApiResponse;
    if (mode === 'create') {
      apiResponse = await api.post(`/animal/${animal!.id}/symptom`, formData);
    } else {
      const changedFields: Partial<ObservationFormData> = {};
      if (formData.description !== item!.description) {
        changedFields.description = formData.description;
      }
      if (
        data.date &&
        data.date.toISOString() !== new Date(item!.date).toISOString()
      ) {
        changedFields.date = data.date;
      }
      if (Object.keys(changedFields).length === 0) {
        setError('description', { message: 'No changes to submit' });
        return;
      }
      apiResponse = await api.patch(
        `/animal/${animal!.id}/symptom/${item!.id}`,
        changedFields
      );
    }

    if (!apiResponse.ok) {
      setSubmissionError('An error occurred. Please try again later.');
      return;
    }

    close();
  };

  return (
    <>
      <Title ta="center">
        {mode === 'create' ? 'Add an observation' : 'Edit observation'}
      </Title>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ErrorArea error={submissionError} />

        <Controller
          name="description"
          control={control}
          rules={{ required: 'Description must be provided.' }}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Description"
              error={errors.description?.message}
            />
          )}
        />

        <Controller
          name="date"
          control={control}
          rules={{ required: 'Date must be provided.' }}
          render={({ field }) => (
            <DateInput
              {...field}
              label="Date input"
              error={errors.date?.message}
            />
          )}
        />

        <Button variant="filled" type="submit" mt="lg">
          {mode === 'create' ? 'Add' : 'Update'}
        </Button>
      </form>
    </>
  );
}
