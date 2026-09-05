export const formatCurrency = (
  amount: number | null | undefined,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return '$0.00';
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatCompactNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '0';
  }
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(value);
};

export const formatDateTime = (isoDateString: string | null | undefined): string => {
  if (!isoDateString) return '--';
  const date = new Date(isoDateString);
  if (Number.isNaN(date.getTime())) return '--';

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
};

export const formatDateOnly = (isoDateString: string | null | undefined): string => {
  if (!isoDateString) return '--';
  const date = new Date(isoDateString);
  if (Number.isNaN(date.getTime())) return '--';

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date);
};

export const generateSKU = (categoryPrefix: string, indexNumber: number): string => {
  const prefix = (categoryPrefix || 'GEN').substring(0, 3).toUpperCase();
  const serial = String(indexNumber).padStart(5, '0');
  return `SKU-${prefix}-${serial}`;
};