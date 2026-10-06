import { formatDate } from './date';

describe('formatDate()', () => {
  const day = new Date(2026, 9, 6);

  it('formats short and long months', () => {
    expect(formatDate(day, 'en-US', 'short')).toBe('Oct 6, 2026');
    expect(formatDate(day, 'en-US', 'long')).toBe('October 6, 2026');
  });

  it('follows the locale', () => {
    expect(formatDate(day, 'de-DE', 'long')).toBe('6. Oktober 2026');
  });

  it('returns null for an invalid date instead of throwing', () => {
    expect(formatDate(new Date('not a date'), 'en-US', 'short')).toBeNull();
  });
});
