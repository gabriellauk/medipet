import React from 'react';
interface ErrorAreaProps {
  error?: string;
}

const ErrorArea: React.FC<ErrorAreaProps> = ({error
}) => {
  return (
    <p>{error}</p>
  );
};

export default ErrorArea;