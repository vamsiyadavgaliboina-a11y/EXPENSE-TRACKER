export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatMonthYear = (month, year) => {
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
  });
};

export const getMonthYearKey = (month, year) => {
  return `${year}-${month < 10 ? '0' + month : month}`;
};
