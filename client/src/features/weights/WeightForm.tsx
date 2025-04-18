import { Button, NumberInput, Title } from '@mantine/core';
import { useState, useEffect, useRef } from 'react';
import { useApi } from '../../contexts/ApiContext';
import ErrorArea from '../../components/ErrorArea';
import { useAnimals } from '../../contexts/AnimalsContext';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { GenericApiResponse } from '../../ApiClient';
import { Weight } from './WeightTracker';

type Props =
  | {
      close: () => void;
      mode: 'create';
      item: null;
      refetchWeights: () => void;
    }
  | {
      close: () => void;
      mode: 'update';
      item: Weight;
      refetchWeights: () => void;
    };

type WeightFormData = {
  date: string;
  weight: number;
};
type CreateWeightFormData = WeightFormData;
type UpdateWeightFormData = Partial<WeightFormData>;
type WeightFormErrors = Partial<Record<keyof WeightFormData, string>>;

export function WeightForm({ close, mode, item, refetchWeights }: Props) {
  const api = useApi();
  const { animal } = useAnimals();

  const weightField = useRef<HTMLInputElement | null>(null);
  const dateField = useRef<HTMLInputElement | null>(null);
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [weightValue, setWeightValue] = useState<number | undefined>(undefined);

  const [formErrors, setFormErrors] = useState<WeightFormErrors>();
  const [submissionError, setSubmissionError] = useState<string | undefined>();

  useEffect(() => {
    if (mode === 'update') {
      const dateObject = new Date(item.date);
      setDateValue(dateObject);
      setWeightValue(item.weight / 100);
    }
  }, [mode, item]);

  useEffect(() => {
    weightField.current?.focus();
  }, []);

  function convertWeightFromKgToGrams(weightWithSuffix: string) {
    const weight = weightWithSuffix.replace(/\s*kg$/, '').trim();
    const result = Number(weight) * 100;
    return Math.round(result);
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const weightWithSuffix = weightField.current?.value;
    const weight = weightWithSuffix
      ? convertWeightFromKgToGrams(weightWithSuffix)
      : '';

    const date = dateField.current?.value
      ? dayjs(dateValue).format('YYYY-MM-DD')
      : '';

    const formErrors: WeightFormErrors = {};
    if (!weight) {
      formErrors.weight = 'Weight must be provided.';
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
      refetchWeights();
      close();
    };

    let apiResponse: GenericApiResponse;
    if (weight && date) {
      if (mode === 'create') {
        const formData: CreateWeightFormData = {
          weight: weight,
          date: date,
        };
        apiResponse = await api.post(
          '/animal/' + animal!.id + '/weight',
          formData
        );
      } else {
        const changedFields: UpdateWeightFormData = {};
        if (weight != item.weight) {
          changedFields.weight = weight;
        }
        if (date != item.date) {
          changedFields.date = date;
        }
        if (Object.keys(changedFields).length === 0) {
          setSubmissionError('No changes to submit');
          return;
        }
        apiResponse = await api.patch(
          '/animal/' + animal!.id + '/weight/' + item.id,
          changedFields
        );
      }
      handleResponse(apiResponse);
    }
  };

  return (
    <>
      <Title ta="center">
        {mode == 'create' ? 'Add a weight' : 'Edit weight'}
      </Title>
      <form onSubmit={onSubmit}>
        <ErrorArea error={submissionError} />
        <NumberInput
          name="weight"
          label="Weight (kg)"
          suffix=" kg"
          error={formErrors?.weight}
          ref={weightField}
          value={weightValue}
          onChange={() => setWeightValue}
        />
        <DateInput
          value={dateValue}
          onChange={setDateValue}
          label="Date recorded"
          ref={dateField}
        />
        <Button variant="filled" type="submit" mt="lg">
          {mode === 'create' ? 'Add' : 'Update'}
        </Button>
      </form>
    </>
  );
}
