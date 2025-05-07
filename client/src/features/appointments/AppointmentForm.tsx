import { Button, Title } from '@mantine/core';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { useApi } from '../../contexts/ApiContext';
import ErrorArea from '../../components/ErrorArea';
import { useAnimals } from '../../contexts/AnimalsContext';
import { useState } from 'react';
import {
  Appointment,
  AppointmentFormData,
  AppointmentFormProps,
} from '../../types/AppointmentTypes';
import { GenericApiResponse } from '../../types/CommonTypes';
import { FormField } from '../../components/FormField';

export function AppointmentForm({
  close,
  mode,
  item,
  refetchItems,
}: AppointmentFormProps) {
  const api = useApi();
  const { animal } = useAnimals();
  const [submissionError, setSubmissionError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    defaultValues: {
      date: mode === 'update' ? new Date(item!.date) : null,
      description: mode === 'update' ? item!.description : '',
      notes: mode === 'update' ? item!.notes || '' : '',
    },
  });

  const onSubmit = async (data: AppointmentFormData) => {
    const formattedDate = data.date
      ? dayjs(data.date).format('YYYY-MM-DD')
      : '';

    let apiResponse: GenericApiResponse<Appointment>;

    if (mode === 'create') {
      const formData = {
        description: data.description,
        date: formattedDate,
        notes: data.notes,
      };
      apiResponse = await api.post(
        `/animal/${animal!.id}/appointment`,
        formData
      );
    } else {
      const changedFields: Partial<{
        description: string;
        date: string;
        notes: string;
      }> = {};
      if (data.description !== item.description)
        changedFields.description = data.description;
      if (formattedDate !== item.date) changedFields.date = formattedDate;
      if (data.notes !== item.notes) changedFields.notes = data.notes;

      if (Object.keys(changedFields).length === 0) {
        return;
      }

      apiResponse = await api.patch(
        `/animal/${animal!.id}/appointment/${item.id}`,
        changedFields
      );
    }

    if (apiResponse.ok) {
      refetchItems();
      close();
    } else {
      setSubmissionError('An error occurred. Please try again later.');
    }

    close();
  };

  return (
    <>
      <Title ta="center">
        {mode === 'create' ? 'Add an appointment' : 'Edit appointment'}
      </Title>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ErrorArea error={submissionError} />

        <FormField
          name="description"
          control={control}
          rules={{ required: 'Description must be provided' }}
          label="Description"
          placeholder="e.g. vaccination, check-up, etc."
          type="text"
          error={errors.description?.message}
        />

        <FormField
          name="date"
          control={control}
          rules={{ required: 'Date must be provided' }}
          label="Appointment date"
          placeholder="Pick a date"
          type="date"
          error={errors.date?.message}
        />

        <FormField
          name="notes"
          control={control}
          label="Notes"
          description="Use this field to record anything you intend to discuss with the vet. After the appointment, you could update it with their recommended follow-up actions."
          type="textarea"
          error={errors.notes?.message}
        />

        <Button type="submit" mt="lg">
          {mode === 'create' ? 'Add' : 'Update'}
        </Button>
      </form>
    </>
  );
}
