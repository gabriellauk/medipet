import { Button, NumberInput, Title } from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { useApi } from '../../contexts/ApiContext';
import { useAnimals } from '../../contexts/AnimalsContext';
import ErrorArea from '../../components/ErrorArea';
import { useState } from 'react';
import { WeightFormData, WeightFormProps } from '../../types/WeightTypes';
import { GenericApiResponse } from '../../types/CommonTypes';

export function WeightForm({
  close,
  mode,
  item,
  refetchWeights,
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
      weight: mode === 'update' ? item.weight / 100 : undefined,
      date: mode === 'update' ? new Date(item.date) : null,
    },
  });

  const onSubmit = async (data: WeightFormData) => {
    const weightInGrams = Math.round(data.weight * 100);
    const formattedDate = data.date
      ? dayjs(data.date).format('YYYY-MM-DD')
      : '';

    let apiResponse: GenericApiResponse;

    if (mode === 'create') {
      const formData = { weight: weightInGrams, date: formattedDate };
      apiResponse = await api.post(`/animal/${animal!.id}/weight`, formData);
    } else {
      const changedFields: Partial<{ weight: number; date: string }> = {};
      if (weightInGrams !== item.weight) changedFields.weight = weightInGrams;
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
      refetchWeights();
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

        <Controller
          name="weight"
          control={control}
          rules={{
            required: 'Weight must be provided.',
            min: { value: 0.1, message: 'Weight must be greater than 0.' },
          }}
          render={({ field }) => (
            <NumberInput
              {...field}
              label="Weight (kg)"
              suffix=" kg"
              placeholder="Enter weight in kg"
              error={errors.weight?.message}
            />
          )}
        />

        <Controller
          name="date"
          control={control}
          rules={{
            required: 'Date must be provided.',
          }}
          render={({ field }) => (
            <DateInput
              {...field}
              label="Date recorded"
              placeholder="Pick a date"
              error={errors.date?.message}
            />
          )}
        />

        <Button type="submit" mt="lg">
          {mode === 'create' ? 'Add' : 'Update'}
        </Button>
      </form>
    </>
  );
}
