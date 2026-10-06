const formatters = new Map<string, Intl.DateTimeFormat>();

/**
 * Cached `Intl.DateTimeFormat`: building one per row is slow in long lists.
 * Returns null for an invalid date, so bad server data omits the date
 * instead of crashing the whole screen.
 */
export function formatDate(date: Date, locale: string | undefined, month: 'short' | 'long'): string | null {
  if (Number.isNaN(date.getTime())) return null;
  const key = `${locale ?? ''}|${month}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, { year: 'numeric', month, day: 'numeric' });
    formatters.set(key, formatter);
  }
  return formatter.format(date);
}
