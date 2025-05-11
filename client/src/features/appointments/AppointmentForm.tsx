import { Button, Title } from '@mantine/core';
import { useForm } from 'react-hook-form';
import ErrorArea from '../../components/ErrorArea';
import {
  Appointment,
  AppointmentFormApiData,
  AppointmentFormData,
  AppointmentFormProps,
} from '../../types/AppointmentTypes';
import { FormField } from '../../components/FormField';
import { formatApiDate } from '../../utils/dateUtils';
import { useEntityForm } from '../../hooks/useEntityForm';

export function AppointmentForm({
  close,
  mode,
  item,
  refetchItems,
}: AppointmentFormProps) {
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

  const { submitEntity, submissionError } = useEntityForm<
    Appointment,
    AppointmentFormApiData
  >({
    mode,
    item,
    endpoint: 'appointment',
    refetchItems,
    close,
  });

  const onSubmit = (data: AppointmentFormData) => {
    const formData = {
      ...data,
      date: data.date ? formatApiDate(data.date) : '',
    };
    submitEntity(formData);
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
