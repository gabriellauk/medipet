import { Button, Title } from '@mantine/core';
import { useForm } from 'react-hook-form';
import ErrorArea from '../../components/ErrorArea';
import {
  Observation,
  ObservationFormApiData,
  ObservationFormData,
  ObservationFormProps,
} from '../../types/ObservationTypes';
import { FormField } from '../../components/FormField';
import { formatApiDate } from '../../utils/dateUtils';
import { useEntityForm } from '../../hooks/useEntityForm';

export function ObservationForm({
  close,
  mode,
  item,
  refetchItems,
}: ObservationFormProps) {
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

  const { submitEntity, submissionError } = useEntityForm<
    Observation,
    ObservationFormApiData
  >({
    mode,
    item,
    endpoint: 'symptom',
    refetchItems,
    close,
  });

  const onSubmit = (data: ObservationFormData) => {
    const formData = {
      ...data,
      date: data.date ? formatApiDate(data.date) : '',
    };
    submitEntity(formData);
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
