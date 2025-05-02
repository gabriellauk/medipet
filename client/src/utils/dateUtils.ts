export const formatDate = (inputDate: string) => {
  const date = new Date(inputDate);

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};
