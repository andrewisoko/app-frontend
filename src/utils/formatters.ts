/**
 * Mask a PAN: show only last 4 digits.
 * e.g. "4111111111111234" → "**** **** **** 1234"
 */
export function maskPAN(pan: string): string {
  if (!pan || pan.length < 4) return '•••• •••• •••• ••••';
  const last4 = pan.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

/**
 * Format a numeric balance with 2 decimal places and currency symbol.
 */
export function formatBalance(amount: number, currency = 'GBP'): string {
  const symbols: Record<string, string> = {
    GBP: '£',
    USD: '$',
    EUR: '€',
  };
  const symbol = symbols[currency] ?? currency;
  return `${symbol}${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

/**
 * Format a date string or Date object into a human-readable short date.
 * e.g. "2026-01-15T00:00:00Z" → "Jan 15, 2026"
 */
export function formatDate(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Calculate a human-readable duration between two dates.
 * e.g. "2 months, 16 days"
 */
export function formatDuration(start: Date, end: Date): string {
  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return 'Invalid range';

  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;

  const parts: string[] = [];
  if (months > 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  return parts.join(', ') || '0 days';
}

/**
 * Parse the backend time_agreement string "[startDate, endDate]" into two Dates.
 */
export function parseTimeAgreement(timeAgreement: string): [Date, Date] | null {
  try {
    const parsed = JSON.parse(timeAgreement);
    if (Array.isArray(parsed) && parsed.length === 2) {
      return [new Date(parsed[0]), new Date(parsed[1])];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Truncate a long string with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}
