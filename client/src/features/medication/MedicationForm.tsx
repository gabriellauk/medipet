import { Button, Title } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import ErrorArea from '../../components/ErrorArea';
import {
  Medication,
  MedicationFormApiData,
  MedicationFormData,
  MedicationFormProps,
} from '../../types/MedicationTypes';
import { FormField } from '../../components/FormField';
import { formatApiDate } from '../../utils/dateUtils';
import { useEntityForm } from '../../hooks/useEntityForm';

export function MedicationForm({
  close,
  mode,
  item,
  refetchItems,
}: MedicationFormProps) {
  const {
    control,
    handleSubmit,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<MedicationFormData>({
    defaultValues: {
      name: mode === 'update' ? item!.name : '',
      isRecurring: mode === 'update' ? item!.isRecurring.toString() : undefined,
      timesPerDay: mode === 'update' ? item!.timesPerDay : undefined,
      frequencyNumber: mode === 'update' ? item!.frequencyNumber : undefined,
      frequencyUnit: mode === 'update' ? item!.frequencyUnit : undefined,
      durationNumber: mode === 'update' ? item!.durationNumber : undefined,
      durationUnit: mode === 'update' ? item!.durationUnit : undefined,
      startDate: mode === 'update' ? new Date(item!.startDate) : null,
      notes: mode === 'update' ? item!.notes : '',
    },
    shouldUnregister: true,
  });

  const isRecurringWatch = watch('isRecurring') === 'true';

  useEffect(() => {
    if (!isRecurringWatch) {
      clearErrors([
        'timesPerDay',
        'frequencyNumber',
        'frequencyUnit',
        'durationNumber',
        'durationUnit',
      ]);
    }
  }, [isRecurringWatch, clearErrors]);

  const { submitEntity, submissionError } = useEntityForm<
    Medication,
    MedicationFormApiData
  >({
    mode,
    item,
    endpoint: 'medication',
    refetchItems,
    close,
  });

  const onSubmit = (data: MedicationFormData) => {
    const formData = {
      ...data,
      startDate: data.startDate ? formatApiDate(data.startDate) : '',
    };
    submitEntity(formData);
  };

  return (
    <>
      <Title ta="center">
        {mode === 'create' ? 'Add medication' : 'Edit medication'}
      </Title>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ErrorArea error={submissionError} />

        <FormField
          name="name"
          control={control}
          rules={{ required: 'Name must be provided.' }}
          label="Name"
          placeholder="Enter the medication name"
          type="text"
          error={errors.name?.message}
        />

        {mode === 'create' && (
          <>
            <FormField
              name="startDate"
              control={control}
              rules={{ required: 'Start date must be provided.' }}
              label="Start date"
              placeholder="Pick a start date"
              type="date"
              error={errors.startDate?.message}
            />

            <FormField
              name="isRecurring"
              control={control}
              rules={{
                required:
                  'You must specify if the medication is recurring or not',
              }}
              label="Is this a recurring medication?"
              type="radio"
              options={[
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' },
              ]}
              error={errors.isRecurring?.message}
            />

            {isRecurringWatch && (
              <>
                <FormField
                  name="timesPerDay"
                  control={control}
                  rules={{
                    required: isRecurringWatch
                      ? 'Times per day must be provided.'
                      : false,
                  }}
                  label="How many doses a day are required?"
                  type="number"
                  error={errors.timesPerDay?.message}
                />

                <FormField
                  name="frequencyNumber"
                  control={control}
                  rules={{
                    required: isRecurringWatch
                      ? 'Frequency number must be provided.'
                      : false,
                  }}
                  label="How frequently does this medication need to be given?"
                  type="number"
                  error={errors.frequencyNumber?.message}
                />

                <FormField
                  name="frequencyUnit"
                  control={control}
                  rules={{
                    required: isRecurringWatch
                      ? 'Frequency unit must be provided.'
                      : false,
                  }}
                  label="Frequency unit"
                  type="select"
                  options={[
                    { value: '', label: 'Select a unit of time' },
                    { value: 'day', label: 'day(s)' },
                    { value: 'week', label: 'week(s)' },
                    { value: 'month', label: 'month(s)' },
                    { value: 'year', label: 'year(s)' },
                  ]}
                  error={errors.frequencyUnit?.message}
                />

                <FormField
                  name="durationNumber"
                  control={control}
                  label="For how long should this medication be given?"
                  type="number"
                  error={errors.durationNumber?.message}
                />

                <FormField
                  name="durationUnit"
                  control={control}
                  label="Duration unit"
                  type="select"
                  options={[
                    { value: '', label: 'Select a unit of time' },
                    { value: 'day', label: 'day(s)' },
                    { value: 'week', label: 'week(s)' },
                    { value: 'month', label: 'month(s)' },
                    { value: 'year', label: 'year(s)' },
                  ]}
                  error={errors.durationUnit?.message}
                />
              </>
            )}
          </>
        )}

        <FormField
          name="notes"
          control={control}
          label="Notes"
          description="Use this field to record any additional details about this medication item."
          type="textarea"
          error={errors.notes?.message}
        />

        <Button variant="filled" type="submit" mt="lg">
          {mode === 'create' ? 'Add' : 'Update'}
        </Button>
      </form>
    </>
  );
}
