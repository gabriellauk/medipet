import { Button, Title } from '@mantine/core';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { useApi } from '../../contexts/ApiContext';
import ErrorArea from '../../components/ErrorArea';
import { useAnimals } from '../../contexts/AnimalsContext';
import { GenericApiResponse } from '../../types/CommonTypes';
import { useState } from 'react';
import {
  Observation,
  ObservationFormData,
  ObservationFormProps,
} from '../../types/ObservationTypes';
import { FormField } from '../../components/FormField';

export function ObservationForm({
  close,
  mode,
  item,
  refetchItems,
}: ObservationFormProps) {
  const api = useApi();
  const { animal } = useAnimals();
  const [submissionError, setSubmissionError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ObservationFormData>({
    defaultValues: {
      date: mode === 'update' ? new Date(item!.date) : null,
      description: mode === 'update' ? item!.description : '',
    },
  });

  const onSubmit = async (data: ObservationFormData) => {
    const formattedDate = data.date
      ? dayjs(data.date).format('YYYY-MM-DD')
      : '';

    let apiResponse: GenericApiResponse<Observation>;
    if (mode === 'create') {
      const formData = { description: data.description, date: formattedDate };
      apiResponse = await api.post(`/animal/${animal!.id}/symptom`, formData);
    } else {
      const changedFields: Partial<{ description: string; date: string }> = {};
      if (data.description !== item!.description)
        changedFields.description = data.description;
      if (formattedDate != item.date) changedFields.date = formattedDate;

      if (Object.keys(changedFields).length === 0) {
        return;
      }
      apiResponse = await api.patch(
        `/animal/${animal!.id}/symptom/${item!.id}`,
        changedFields
      );
    }

    if (apiResponse.ok) {
      refetchItems();
      close();
    } else {
      setSubmissionError('An error occurred. Please try again later.');
      return;
    }
  };

  return (
    <>
      <Title ta="center">
        {mode === 'create' ? 'Add an observation' : 'Edit observation'}
      </Title>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ErrorArea error={submissionError} />

        <FormField
          name="description"
          control={control}
          rules={{ required: 'Description must be provided.' }}
          label="Description"
          placeholder="Describe the symptom or behaviour"
          error={errors.description?.message}
          type="text"
        />

        <FormField
          name="date"
          control={control}
          rules={{ required: 'Date must be provided.' }}
          label="Date recorded"
          placeholder="Pick a date"
          error={errors.date?.message}
          type="date"
        />

        <Button type="submit" mt="lg">
          {mode === 'create' ? 'Add' : 'Update'}
        </Button>
      </form>
    </>
  );
}
