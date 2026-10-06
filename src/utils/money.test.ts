import { currencyDigits, currencySymbol, formatMoney, money, parseMoney, sanitizeAmountInput, spokenMoney } from './money';

const usd = (minor: number) => money(minor, 'USD');

describe('money()', () => {
  it('accepts integer minor units', () => {
    expect(money(1250, 'USD')).toEqual({ minor: 1250, currency: 'USD' });
    expect(money(-1, 'EUR').minor).toBe(-1);
    expect(money(0, 'JPY').minor).toBe(0);
  });

  it.each([12.5, NaN, Infinity, 2 ** 53])('rejects non-integer or unsafe minor units: %p', (minor) => {
    expect(() => money(minor, 'USD')).toThrow(RangeError);
  });

  it.each(['usd', 'US', 'USDX', '', '$'])('rejects a malformed currency: %p', (currency) => {
    expect(() => money(100, currency)).toThrow(RangeError);
  });
});

describe('formatMoney()', () => {
  it('formats USD with two decimals', () => {
    expect(formatMoney(usd(124050), { locale: 'en-US' })).toBe('$1,240.50');
    expect(formatMoney(usd(5), { locale: 'en-US' })).toBe('$0.05');
    expect(formatMoney(usd(0), { locale: 'en-US' })).toBe('$0.00');
  });

  it('takes decimals from the currency: JPY has none', () => {
    expect(currencyDigits('JPY', 'ja-JP')).toBe(0);
    expect(formatMoney(money(125000, 'JPY'), { locale: 'en-US' })).toBe('¥125,000');
  });

  it('uses a true minus sign for negatives', () => {
    expect(formatMoney(usd(-4550), { locale: 'en-US' })).toBe('−$45.50');
  });

  it('signDisplay: auto, always, never', () => {
    expect(formatMoney(usd(250000), { locale: 'en-US', signDisplay: 'auto' })).toBe('$2,500.00');
    expect(formatMoney(usd(250000), { locale: 'en-US', signDisplay: 'always' })).toBe('+$2,500.00');
    expect(formatMoney(usd(-250000), { locale: 'en-US', signDisplay: 'always' })).toBe('−$2,500.00');
    expect(formatMoney(usd(-250000), { locale: 'en-US', signDisplay: 'never' })).toBe('$2,500.00');
  });

  it('never shows a sign on zero', () => {
    expect(formatMoney(usd(0), { locale: 'en-US', signDisplay: 'always' })).toBe('$0.00');
  });

  it('respects the locale for grouping and symbol placement', () => {
    expect(formatMoney(money(-1899, 'EUR'), { locale: 'de-DE' })).toBe('−18,99 €');
  });

  it('is exact for large amounts', () => {
    expect(formatMoney(usd(2482042), { locale: 'en-US' })).toBe('$24,820.42');
  });
});

describe('spokenMoney()', () => {
  it('turns signs into words', () => {
    expect(spokenMoney(usd(-4550), { locale: 'en-US' })).toBe('minus $45.50');
    expect(spokenMoney(usd(250000), { locale: 'en-US', signDisplay: 'always' })).toBe('plus $2,500.00');
    expect(spokenMoney(usd(250000), { locale: 'en-US' })).toBe('$2,500.00');
  });

  it('accepts localised sign words', () => {
    expect(spokenMoney(usd(-100), { locale: 'en-US', words: { plus: 'más', minus: 'menos' } })).toBe('menos $1.00');
  });
});

describe('sanitizeAmountInput()', () => {
  it('keeps digits and one decimal point', () => {
    expect(sanitizeAmountInput('12ab.3456', 2, 'en-US')).toBe('12.34');
    expect(sanitizeAmountInput('1.2.3', 2, 'en-US')).toBe('1.23');
    expect(sanitizeAmountInput('abc', 2, 'en-US')).toBe('');
  });

  it('uses the locale decimal separator and always returns "."', () => {
    expect(sanitizeAmountInput('12,5', 2, 'de-DE')).toBe('12.5');
    expect(sanitizeAmountInput('12.5', 2, 'en-US')).toBe('12.5');
  });

  it('survives pasted amounts with thousands separators (was silently wrong: $1,234.50 became $1.23)', () => {
    expect(sanitizeAmountInput('$1,234.50', 2, 'en-US')).toBe('1234.50');
    expect(sanitizeAmountInput('1.234,50', 2, 'de-DE')).toBe('1234.50');
    expect(sanitizeAmountInput('1\u202f234,50', 2, 'fr-FR')).toBe('1234.50'); // narrow no-break space
    expect(sanitizeAmountInput('1 234,50 €', 2, 'fr-FR')).toBe('1234.50');
  });

  it('allows no decimal point for zero-decimal currencies', () => {
    expect(sanitizeAmountInput('1200.50', 0, 'en-US')).toBe('1200');
  });
});

describe('parseMoney()', () => {
  it('parses to exact minor units without float drift', () => {
    expect(parseMoney('12.5', 'USD', 'en-US')).toEqual(usd(1250));
    expect(parseMoney('0.1', 'USD', 'en-US')).toEqual(usd(10));
    expect(parseMoney('0.29', 'USD', 'en-US')).toEqual(usd(29)); // 0.29 * 100 === 28.999999999999996 in floats
    expect(parseMoney('19.99', 'USD', 'en-US')).toEqual(usd(1999));
  });

  it('handles zero-decimal currencies', () => {
    expect(parseMoney('1200', 'JPY', 'ja-JP')).toEqual(money(1200, 'JPY'));
  });

  it('parses pasted values with thousands separators', () => {
    expect(parseMoney('$1,234.50', 'USD', 'en-US')).toEqual(usd(123450));
    expect(parseMoney('1.234,50', 'EUR', 'de-DE')).toEqual(money(123450, 'EUR'));
  });

  it('returns null for empty or non-numeric input', () => {
    expect(parseMoney('', 'USD', 'en-US')).toBeNull();
    expect(parseMoney('.', 'USD', 'en-US')).toBeNull();
    expect(parseMoney('abc', 'USD', 'en-US')).toBeNull();
  });
});

describe('currencySymbol()', () => {
  it('returns the symbol for the locale', () => {
    expect(currencySymbol('USD', 'en-US')).toBe('$');
    expect(currencySymbol('EUR', 'de-DE')).toBe('€');
  });
});
