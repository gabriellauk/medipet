import { Button, Title } from '@mantine/core';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { useApi } from '../../contexts/ApiContext';
import { useAnimals } from '../../contexts/AnimalsContext';
import ErrorArea from '../../components/ErrorArea';
import { useState } from 'react';
import {
  Weight,
  WeightFormData,
  WeightFormProps,
} from '../../types/WeightTypes';
import { GenericApiResponse } from '../../types/GenericTypes';
import { FormField } from '../../components/FormField';

export function WeightForm({
  close,
  mode,
  item,
  refetchItems,
}: WeightFormProps) {
  const api = useApi();
  const { animal } = useAnimals();
  const [submissionError, setSubmissionError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WeightFormData>({
    defaultValues: {
      weight: mode === 'update' ? item.weight / 1000 : undefined,
      date: mode === 'update' ? new Date(item.date) : null,
    },
  });

  const onSubmit = async (data: WeightFormData) => {
    const weightInGrams = Math.round(data.weight * 1000);
    const formattedDate = data.date
      ? dayjs(data.date).format('YYYY-MM-DD')
      : '';

    let apiResponse: GenericApiResponse<Weight>;

    if (mode === 'create') {
      const formData = { weight: weightInGrams, date: formattedDate };
      apiResponse = await api.post(`/animal/${animal!.id}/weight`, formData);
    } else {
      const changedFields: Partial<{ weight: number; date: string }> = {};
      if (data.weight !== item.weight) changedFields.weight = weightInGrams;
      if (formattedDate !== item.date) changedFields.date = formattedDate;

      if (Object.keys(changedFields).length === 0) {
        return;
      }

      apiResponse = await api.patch(
        `/animal/${animal!.id}/weight/${item.id}`,
        changedFields
      );
    }

    if (apiResponse.ok) {
      refetchItems();
      close();
    } else {
      setSubmissionError('An error occurred. Please try again later.');
    }
  };

  return (
    <>
      <Title ta="center">
        {mode === 'create' ? 'Add a weight' : 'Edit weight'}
      </Title>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ErrorArea error={submissionError} />

        <FormField
          name="weight"
          control={control}
          rules={{
            required: 'Weight must be provided.',
            min: { value: 0.1, message: 'Weight must be greater than 0.' },
          }}
          label="Weight (kg)"
          placeholder="Enter weight in kg"
          error={errors.weight?.message}
          type="number"
          suffix="kg"
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
