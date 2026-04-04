import { format, parseISO, isValid } from 'date-fns';

export const formatDate = (date, fmt = 'MMM d, yyyy') => {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) ? format(d, fmt) : '—';
};

export const formatMonth = (monthStr) => {
  // monthStr is 'YYYY-MM'
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-');
  const d = new Date(parseInt(year), parseInt(month) - 1, 1);
  return format(d, 'MMM yyyy');
};
