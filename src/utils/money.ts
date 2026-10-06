/**
 * Money formatting helpers (display only; no business rules live here).
 *
 * AMOUNTS ARE INTEGER MINOR UNITS: 1250 means $12.50 in USD and ¥1250 in JPY.
 * That is how payment APIs represent money, and it avoids floating-point
 * errors like 0.1 + 0.2 !== 0.3. The number of decimals comes from the
 * currency itself via Intl, so nothing here hardcodes "2" or "$".
 */

export type SignDisplay = 'negative' | 'always' | 'never';

const MINUS = '−'; // a true minus sign, wider and clearer than a hyphen

export function currencyDigits(currency: string, locale?: string): number {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
}

export function currencySymbol(currency: string, locale?: string): string {
  const parts = new Intl.NumberFormat(locale, { style: 'currency', currency }).formatToParts(0);
  return parts.find((part) => part.type === 'currency')?.value ?? currency;
}

interface FormatOptions {
  /** BCP 47 tag like 'en-US'. Defaults to the device locale. */
  locale?: string;
  /** `negative` shows only a minus; `always` also shows + on credits; `never` hides signs. */
  signDisplay?: SignDisplay;
}

export function formatMoney(minorUnits: number, currency: string, { locale, signDisplay = 'negative' }: FormatOptions = {}): string {
  const digits = currencyDigits(currency, locale);
  const body = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Math.abs(minorUnits) / 10 ** digits);

  if (signDisplay === 'never') return body;
  if (minorUnits < 0) return `${MINUS}${body}`;
  if (signDisplay === 'always' && minorUnits > 0) return `+${body}`;
  return body;
}

/** Text for screen readers: signs become words, because symbols are read inconsistently. */
export function spokenMoney(minorUnits: number, currency: string, { locale, signDisplay = 'negative' }: FormatOptions = {}): string {
  const body = formatMoney(Math.abs(minorUnits), currency, { locale, signDisplay: 'never' });
  if (signDisplay === 'never') return body;
  if (minorUnits < 0) return `minus ${body}`;
  if (signDisplay === 'always' && minorUnits > 0) return `plus ${body}`;
  return body;
}

/**
 * Clean up what a user types into an amount field: digits and one decimal
 * point only, no more decimals than the currency allows. Accepts "," as a
 * decimal separator and normalises it to ".".
 */
export function sanitizeAmountInput(text: string, digits: number): string {
  const cleaned = text.replace(',', '.').replace(/[^0-9.]/g, '');
  const [whole, ...rest] = cleaned.split('.');
  if (digits === 0 || rest.length === 0) return whole;
  return `${whole}.${rest.join('').slice(0, digits)}`;
}

/** "12.5" -> 1250 (USD). Returns null for empty or unparseable text. String-based, so no float drift. */
export function parseAmountToMinorUnits(text: string, currency: string, locale?: string): number | null {
  const digits = currencyDigits(currency, locale);
  const clean = sanitizeAmountInput(text, digits);
  if (clean === '' || clean === '.') return null;
  const [whole, fraction = ''] = clean.split('.');
  return Number(whole || '0') * 10 ** digits + Number(fraction.padEnd(digits, '0') || '0');
}
