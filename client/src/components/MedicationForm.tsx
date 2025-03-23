import { Button, Title } from '@mantine/core';
import { useState, useEffect, useRef } from 'react';
import InputField from './InputField';
import { useApi } from '../contexts/ApiContext';
import ErrorArea from './ErrorArea';
import { useAnimals } from '../contexts/AnimalsContext';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { GenericApiResponse } from '../ApiClient';
import { Medication } from '../pages/MedicationSchedule';

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

type CreateMedicationFormData = {
  name: string;
  isRecurring: string;
  // timesPerDay: number;
  // frequencyNumber: number;
  frequencyUnit: string; // update this
  // durationNumber: number;
  // durationUnit: string; // update this
  startDate: string;
  // notes: string;
};
type UpdateMedicationFormData = {
  name?: string;
};
// TODO: Add error type for update
type CreateMedicationFormErrors = Partial<
  Record<keyof CreateMedicationFormData, string>
>;

export function MedicationForm({ close, mode, item }: Props) {
  const api = useApi();
  const { animal } = useAnimals();

  const nameField = useRef<HTMLInputElement | null>(null);
  const startDateField = useRef<HTMLInputElement | null>(null);
  const isRecurringField = useRef<HTMLInputElement | null>(null);
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const frequencyUnitField = useRef<HTMLInputElement | null>(null);

  const [formErrors, setFormErrors] = useState<CreateMedicationFormErrors>();
  const [submissionError, setSubmissionError] = useState<string | undefined>();

  // useEffect(() => {
  //   if (mode === 'update') {
  //     const dateObject = new Date(item.date);
  //     setDateValue(dateObject);
  //     nameField.current!.value = item.name;
  //   }
  // }, [mode, item]);

  useEffect(() => {
    nameField.current?.focus();
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const name = nameField.current?.value;
    const startDate = startDateField.current?.value
      ? dayjs(dateValue).format('YYYY-MM-DD')
      : '';
    const isRecurring = isRecurringField.current?.value;
    const frequencyUnit = frequencyUnitField.current?.value;

    const formErrors: CreateMedicationFormErrors = {};
    if (!name) {
      formErrors.name = 'Name must be provided.';
    }
    if (!startDate) {
      formErrors.startDate = 'Start date must be provided.';
    }
    if (!isRecurring) {
      formErrors.isRecurring =
        'Please specify if this medication is recurring or a one-off';
    }
    // add more errors
    setSubmissionError(undefined);
    setFormErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    const handleResponse = (response: GenericApiResponse) => {
      if (!response.ok) {
        setSubmissionError(
          response.body?.error ? response.body.error : 'Unknown error'
        );
        return;
      }
      setSubmissionError(undefined);
      close();
    };

    let apiResponse: GenericApiResponse;
    if (name && startDate && isRecurring && frequencyUnit) {
      if (mode === 'create') {
        const formData: CreateMedicationFormData = {
          name: name,
          isRecurring: isRecurring,
          startDate: startDate,
          frequencyUnit: frequencyUnit,
        };
        apiResponse = await api.post(
          '/animal/' + animal!.id + '/medication',
          formData
        );
      } else {
        const changedFields: UpdateMedicationFormData = {};
        if (name != item.name) {
          changedFields.name = name;
        }
        if (Object.keys(changedFields).length === 0) {
          setSubmissionError('No changes to submit');
          return;
        }
        apiResponse = await api.patch(
          '/animal/' + animal!.id + '/medication/' + item.id,
          changedFields
        );
      }
      handleResponse(apiResponse);
    }
  };

  return (
    <>
      <Title ta="center">
        {mode == 'create' ? 'Add medication' : 'Edit medication'}
      </Title>
      <form onSubmit={onSubmit}>
        <ErrorArea error={submissionError} />
        <InputField
          name="name"
          label="Name"
          error={formErrors?.name}
          fieldRef={nameField}
        />
        <InputField
          name="isRecurring"
          label="Is recurring?"
          error={formErrors?.isRecurring}
          fieldRef={isRecurringField}
        />
        <InputField
          name="frequencyUnit"
          label="Frequency unit"
          error={formErrors?.frequencyUnit}
          fieldRef={frequencyUnitField}
        />
        <DateInput
          value={dateValue}
          onChange={setDateValue}
          label="Start date"
          ref={startDateField}
        />
        <Button variant="filled" type="submit" mt="lg">
          {mode === 'create' ? 'Add' : 'Update'}
        </Button>
      </form>
    </>
  );
}
