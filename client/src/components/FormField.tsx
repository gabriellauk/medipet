import {
  Controller,
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import {
  TextInput,
  Textarea,
  NumberInput,
  NativeSelect,
  Radio,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  rules?: RegisterOptions<T, Path<T>>;
  label: string;
  placeholder?: string;
  description?: string;
  error?: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'radio' | 'date';
  options?: { value: string; label: string }[];
  suffix?: string;
}

export function FormField<T extends FieldValues>({
  name,
  control,
  rules,
  label,
  placeholder,
  description,
  error,
  type,
  options = [],
  suffix,
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => {
        switch (type) {
          case 'text':
            return (
              <TextInput
                {...field}
                label={label}
                placeholder={placeholder}
                description={description}
                error={error}
              />
            );
          case 'textarea':
            return (
              <Textarea
                {...field}
                label={label}
                placeholder={placeholder}
                description={description}
                error={error}
              />
            );
          case 'number':
            return (
              <NumberInput
                {...field}
                label={label}
                placeholder={placeholder}
                description={description}
                error={error}
                step={1}
                min={0}
                rightSection={suffix ? <span>{suffix}</span> : undefined}
              />
            );
          case 'select':
            return (
              <NativeSelect
                {...field}
                label={label}
                description={description}
                data={options}
                error={error}
              />
            );
          case 'radio':
            return (
              <Radio.Group
                {...field}
                label={label}
                description={description}
                error={error}
              >
                {options.map((option) => (
                  <Radio
                    key={option.value}
                    value={option.value}
                    label={option.label}
                  />
                ))}
              </Radio.Group>
            );
          case 'date':
            return (
              <DateInput
                {...field}
                label={label}
                placeholder={placeholder}
                description={description}
                error={error}
              />
            );
        }
      }}
    />
  );
}
