/**
 * Money values and display formatting (no business rules live here).
 *
 * A `Money` is an INTEGER number of minor units plus an ISO 4217 currency:
 * { minor: 1250, currency: 'USD' } is $12.50, and { minor: 1250, currency: 'JPY' } is ¥1,250.
 * Integers avoid floating-point errors (0.1 + 0.2 !== 0.3). The currency decides the symbol
 * and the number of decimals, so nothing here hardcodes "$" or "2".
 */

export interface Money {
  readonly minor: number;
  readonly currency: string;
}

/** The only sanctioned way to create a Money. Throws on a non-integer or malformed currency. */
export function money(minor: number, currency: string): Money {
  if (!Number.isSafeInteger(minor)) {
    throw new RangeError(`Money.minor must be a safe integer of minor units, got ${minor}`);
  }
  if (!/^[A-Z]{3}$/.test(currency)) {
    throw new RangeError(`Money.currency must be an ISO 4217 code like "USD", got "${currency}"`);
  }
  return { minor, currency };
}

/** `auto` shows a minus on negatives only; `always` also shows + on credits; `never` hides signs. */
export type SignDisplay = 'auto' | 'always' | 'never';

const MINUS = '−'; // a true minus sign, wider and clearer than a hyphen

// Intl constructors are slow, so each distinct formatter is built once.
const formatters = new Map<string, Intl.NumberFormat>();

function currencyFormatter(currency: string, locale: string | undefined, digits?: number): Intl.NumberFormat {
  const key = `${locale ?? ''}|${currency}|${digits ?? ''}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(
      locale,
      digits === undefined
        ? { style: 'currency', currency }
        : { style: 'currency', currency, minimumFractionDigits: digits, maximumFractionDigits: digits },
    );
    formatters.set(key, formatter);
  }
  return formatter;
}

export function currencyDigits(currency: string, locale?: string): number {
  return currencyFormatter(currency, locale).resolvedOptions().maximumFractionDigits ?? 2;
}

export function currencySymbol(currency: string, locale?: string): string {
  const parts = currencyFormatter(currency, locale).formatToParts(0);
  return parts.find((part) => part.type === 'currency')?.value ?? currency;
}

interface FormatOptions {
  /** BCP 47 tag like 'en-US'. Defaults to the device locale. */
  locale?: string;
  signDisplay?: SignDisplay;
}

export function formatMoney(value: Money, { locale, signDisplay = 'auto' }: FormatOptions = {}): string {
  const digits = currencyDigits(value.currency, locale);
  const body = currencyFormatter(value.currency, locale, digits).format(Math.abs(value.minor) / 10 ** digits);

  if (signDisplay === 'never') return body;
  if (value.minor < 0) return `${MINUS}${body}`;
  if (signDisplay === 'always' && value.minor > 0) return `+${body}`;
  return body;
}

interface SpokenOptions extends FormatOptions {
  /** Words for the signs, so they can be localised. */
  words?: { plus: string; minus: string };
}

/** Text for screen readers: signs become words, because symbols are read inconsistently. */
export function spokenMoney(
  value: Money,
  { locale, signDisplay = 'auto', words = { plus: 'plus', minus: 'minus' } }: SpokenOptions = {},
): string {
  const body = formatMoney({ minor: Math.abs(value.minor), currency: value.currency }, { locale, signDisplay: 'never' });
  if (signDisplay === 'never') return body;
  if (value.minor < 0) return `${words.minus} ${body}`;
  if (signDisplay === 'always' && value.minor > 0) return `${words.plus} ${body}`;
  return body;
}

// Group and decimal separators differ by locale ("1,234.50" vs "1.234,50"), so ask Intl.
const separators = new Map<string, { group: string; decimal: string }>();

function localeSeparators(locale: string | undefined): { group: string; decimal: string } {
  const key = locale ?? '';
  let found = separators.get(key);
  if (!found) {
    const parts = new Intl.NumberFormat(locale).formatToParts(1234567.8);
    found = {
      group: parts.find((part) => part.type === 'group')?.value ?? ',',
      decimal: parts.find((part) => part.type === 'decimal')?.value ?? '.',
    };
    separators.set(key, found);
  }
  return found;
}

/**
 * Clean up what a user types or pastes into an amount field: digits and one
 * decimal point only, no more decimals than the currency allows.
 * The locale decides what "," and "." mean: in en-US "1,234.50" is one thousand
 * two hundred thirty-four and a half; in de-DE "1.234,50" is the same amount.
 * The result always uses "." as the decimal point.
 */
export function sanitizeAmountInput(text: string, digits: number, locale?: string): string {
  const { group, decimal } = localeSeparators(locale);
  const normalised = text
    .replace(/\s/g, '') // spaces, including the no-break spaces some locales use for grouping
    .split(group)
    .join('')
    .split(decimal)
    .join('.')
    .replace(/[^0-9.]/g, '');
  const [whole, ...rest] = normalised.split('.');
  if (digits === 0 || rest.length === 0) return whole;
  return `${whole}.${rest.join('').slice(0, digits)}`;
}

/** "12.5" -> { minor: 1250, currency: 'USD' }. Returns null for empty or unparseable text. String-based, so no float drift. */
export function parseMoney(text: string, currency: string, locale?: string): Money | null {
  const digits = currencyDigits(currency, locale);
  const clean = sanitizeAmountInput(text, digits, locale);
  if (clean === '' || clean === '.') return null;
  const [whole, fraction = ''] = clean.split('.');
  return money(Number(whole || '0') * 10 ** digits + Number(fraction.padEnd(digits, '0') || '0'), currency);
}
