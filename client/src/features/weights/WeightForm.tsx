import { Button, Title } from '@mantine/core';
import { useForm } from 'react-hook-form';
import ErrorArea from '../../components/ErrorArea';
import {
  Weight,
  WeightFormApiData,
  WeightFormData,
  WeightFormProps,
} from '../../types/WeightTypes';
import { FormField } from '../../components/FormField';
import { formatApiDate } from '../../utils/dateUtils';
import { useEntityForm } from '../../hooks/useEntityForm';

export function WeightForm({
  close,
  mode,
  item,
  refetchItems,
}: WeightFormProps) {
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

  const { submitEntity, submissionError } = useEntityForm<
    Weight,
    WeightFormApiData
  >({
    mode,
    item,
    endpoint: 'weight',
    refetchItems,
    close,
  });

  const onSubmit = (data: WeightFormData) => {
    const formData = {
      weight: Math.round(data.weight * 1000),
      date: data.date ? formatApiDate(data.date) : '',
    };
    submitEntity(formData);
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
