import { TextInput } from '@mantine/core';
import React from 'react';
interface InputFieldProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  fieldRef?: React.Ref<HTMLInputElement>;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  error,
  fieldRef,
}) => {
  return (
    <TextInput
      mt="md"
      id={name}
      label={label}
      type={type}
      placeholder={placeholder}
      ref={fieldRef}
      error={error}
      />
  );
};

export default InputField;