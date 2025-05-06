export const formatDate = (inputDate: string) => {
  const date = new Date(inputDate);

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const getRelativeTime = (date: string): string => {
  const today = new Date();
  const inputDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  const differenceInDays = Math.round(
    (today.getTime() - inputDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (differenceInDays === 0) {
    return 'today';
  } else if (differenceInDays === 1) {
    return '1 day ago';
  } else if (differenceInDays > 1) {
    return `${differenceInDays} days ago`;
  } else if (differenceInDays === -1) {
    return 'tomorrow';
  } else {
    return `${Math.abs(differenceInDays)} days from now`;
  }
};
