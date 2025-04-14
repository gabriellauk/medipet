import {
  Button,
  NativeSelect,
  NumberInput,
  Radio,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { useApi } from '../contexts/ApiContext';
import ErrorArea from './ErrorArea';
import { useAnimals } from '../contexts/AnimalsContext';
import { Medication, TimeUnit } from '../pages/MedicationSchedule';
import { useEffect, useState } from 'react';

type Props =
  | {
      close: () => void;
      mode: 'create';
      item: null;
    }
  | {
      close: () => void;
      mode: 'update';
      item: Medication;
    };

type MedicationFormData = {
  name: string;
  isRecurring: string;
  timesPerDay?: number;
  frequencyNumber?: number;
  frequencyUnit?: TimeUnit;
  durationNumber?: number;
  durationUnit?: TimeUnit;
  startDate: Date | null;
  notes?: string;
};

export function MedicationForm({ close, mode, item }: Props) {
  const api = useApi();
  const { animal } = useAnimals();
  const [submissionError, setSubmissionError] = useState('');

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

  const onSubmit = async (data: MedicationFormData) => {
    const formData = {
      ...data,
      startDate: data.startDate
        ? dayjs(data.startDate).format('YYYY-MM-DD')
        : '',
    };

    let apiResponse;
    if (mode === 'create') {
      apiResponse = await api.post(
        `/animal/${animal!.id}/medication`,
        formData
      );
    } else {
      const changedFields: Partial<MedicationFormData> = {};
      if (formData.name !== item!.name) changedFields.name = formData.name;
      if ((formData.isRecurring === 'true') !== item!.isRecurring)
        changedFields.isRecurring = formData.isRecurring;
      if (formData.startDate !== item!.startDate)
        changedFields.startDate = data.startDate;
      if (Object.keys(changedFields).length === 0) {
        setSubmissionError('No changes to submit');
        return;
      }
      apiResponse = await api.patch(
        `/animal/${animal!.id}/medication/${item!.id}`,
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
        {mode === 'create' ? 'Add medication' : 'Edit medication'}
      </Title>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ErrorArea error={submissionError} />

        <Controller
          name="name"
          control={control}
          rules={{ required: 'Name must be provided.' }}
          render={({ field }) => (
            <TextInput {...field} label="Name" error={errors.name?.message} />
          )}
        />

        {mode === 'create' && (
          <>
            <Controller
              name="startDate"
              control={control}
              rules={{ required: 'Start date must be provided.' }}
              render={({ field }) => (
                <DateInput
                  {...field}
                  label="Start date"
                  error={errors.startDate?.message}
                />
              )}
            />

            <Controller
              name="isRecurring"
              control={control}
              rules={{
                required:
                  'You must specify if the medication is recurring or not',
              }}
              render={({ field }) => (
                <Radio.Group
                  {...field}
                  label="Is this a recurring medication?"
                  error={errors.isRecurring?.message}
                >
                  <Radio value="true" label="Yes" />
                  <Radio value="false" label="No" />
                </Radio.Group>
              )}
            />

            <Controller
              name="timesPerDay"
              control={control}
              rules={{
                required: isRecurringWatch
                  ? 'Times per day must be provided.'
                  : false,
              }}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label="How many doses a day are required?"
                  error={errors.timesPerDay?.message}
                />
              )}
            />

            <Controller
              name="frequencyNumber"
              control={control}
              rules={{
                required: isRecurringWatch
                  ? 'Frequency number must be provided.'
                  : false,
              }}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label="How frequently does this medication need to be given?"
                  error={errors.frequencyNumber?.message}
                />
              )}
            />

            <Controller
              name="frequencyUnit"
              control={control}
              rules={{
                required: isRecurringWatch
                  ? 'Frequency unit must be provided.'
                  : false,
              }}
              render={({ field }) => (
                <NativeSelect
                  {...field}
                  label="Frequency unit"
                  data={['day', 'week', 'month', 'year']}
                  error={errors.frequencyUnit?.message}
                />
              )}
            />

            <Controller
              name="durationNumber"
              control={control}
              rules={{
                required: isRecurringWatch
                  ? 'Duration number must be provided.'
                  : false,
              }}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label="For how long should this medication be given?"
                  error={errors.durationNumber?.message}
                />
              )}
            />

            <Controller
              name="durationUnit"
              control={control}
              rules={{
                required: isRecurringWatch
                  ? 'Duration unit must be provided.'
                  : false,
              }}
              render={({ field }) => (
                <NativeSelect
                  {...field}
                  label="Duration unit"
                  data={['day', 'week', 'month', 'year']}
                  error={errors.durationUnit?.message}
                />
              )}
            />
          </>
        )}

        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Notes"
              description="Use this field to record any additional details about this medication item."
              error={errors.notes?.message}
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
