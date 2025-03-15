import { Button, Textarea, Title } from '@mantine/core';
import { useState, useEffect, useRef } from 'react';
import InputField from './InputField';
import { useApi } from '../contexts/ApiContext';
import ErrorArea from './ErrorArea';
import { useAnimals } from '../contexts/AnimalsContext';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { GenericApiResponse } from '../ApiClient';
import { Appointment } from '../pages/AppointmentsCalendar';

type Props =
  | {
      close: () => void;
      mode: 'create';
      item: null;
    }
  | {
      close: () => void;
      mode: 'update';
      item: Appointment;
    };

type AppointmentFormData = {
  date: string;
  description: string;
  notes?: string;
};
type CreateAppointmentFormData = AppointmentFormData;
type UpdateAppointmentFormData = Partial<AppointmentFormData>;
type AppointmentFormErrors = Partial<Record<keyof AppointmentFormData, string>>;

export function AppointmentForm({ close, mode, item }: Props) {
  const api = useApi();
  const { animal } = useAnimals();

  const descriptionField = useRef<HTMLInputElement | null>(null);
  const dateField = useRef<HTMLInputElement | null>(null);
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const notesField = useRef<HTMLTextAreaElement | null>(null);

  const [formErrors, setFormErrors] = useState<AppointmentFormErrors>();
  const [submissionError, setSubmissionError] = useState<string | undefined>();

  useEffect(() => {
    if (mode === 'update') {
      const dateObject = new Date(item.date);
      setDateValue(dateObject);
      descriptionField.current!.value = item.description;
      if (item.notes != null) {
        notesField.current!.value = item.notes;
        console.log("I'm in the effect");
      }
    }
  }, [mode, item]);

  useEffect(() => {
    descriptionField.current?.focus();
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const description = descriptionField.current?.value;
    const date = dateField.current?.value
      ? dayjs(dateValue).format('YYYY-MM-DD')
      : '';
    const notes = notesField.current?.value;

    const formErrors: AppointmentFormErrors = {};
    if (!description) {
      formErrors.description = 'Description must be provided.';
    }
    if (!date) {
      formErrors.date = 'Date must be provided.';
    }
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
    if (description && date) {
      if (mode === 'create') {
        const formData: CreateAppointmentFormData = {
          description: description,
          date: date,
          notes: notes,
        };
        apiResponse = await api.post(
          '/animal/' + animal!.id + '/appointment',
          formData
        );
      } else {
        const changedFields: UpdateAppointmentFormData = {};
        if (description != item.description) {
          changedFields.description = description;
        }
        if (date != item.date) {
          changedFields.date = date;
        }
        if (notes != item.notes) {
          changedFields.notes = notes;
        }
        if (Object.keys(changedFields).length === 0) {
          setSubmissionError('No changes to submit');
          return;
        }
        apiResponse = await api.patch(
          '/animal/' + animal!.id + '/appointment/' + item.id,
          changedFields
        );
      }
      handleResponse(apiResponse);
    }
  };

  return (
    <>
      <Title ta="center">
        {mode == 'create' ? 'Add an appointment' : 'Edit appointment'}
      </Title>
      <form onSubmit={onSubmit}>
        <ErrorArea error={submissionError} />
        <InputField
          name="description"
          label="Description"
          error={formErrors?.description}
          fieldRef={descriptionField}
        />
        <DateInput
          value={dateValue}
          onChange={setDateValue}
          label="Appointment date"
          ref={dateField}
        />
        <Textarea
          name="notes"
          description="Use this field to record anything you intend to discuss with the vet. After the appointment, you could update it with their recommended follow-up actions."
          label="Notes"
          error={formErrors?.notes}
          ref={notesField}
        />
        <Button variant="filled" type="submit" mt="lg">
          {mode === 'create' ? 'Add' : 'Update'}
        </Button>
      </form>
    </>
  );
}
