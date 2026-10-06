import { Text, type TextColor, type TextProps } from '@/components/core';
import { formatMoney, spokenMoney, type SignDisplay } from '@/utils/money';

export interface MoneyTextProps extends Omit<TextProps, 'children' | 'color'> {
  /** INTEGER MINOR UNITS: 1250 = $12.50. Negative = money out. */
  amount: number;
  /** ISO 4217 code, e.g. 'USD', 'EUR', 'JPY'. Symbol and decimals come from Intl. */
  currency: string;
  /** BCP 47 tag, e.g. 'de-DE'. Defaults to the device locale. */
  locale?: string;
  /** `negative` (default) shows only a minus; `always` also shows + on credits. */
  signDisplay?: SignDisplay;
  /** Hides the figure (privacy mode). A fixed mask is used so the size of the amount isn't leaked. */
  masked?: boolean;
  /** Colour credits green and debits red. Signs still show, so colour is never the only cue. */
  colorBySign?: boolean;
  color?: TextColor;
}

const MASK = '••••••';

export function MoneyText({
  amount,
  currency,
  locale,
  signDisplay = 'negative',
  masked = false,
  colorBySign = false,
  color = 'primary',
  variant = 'money',
  ...rest
}: MoneyTextProps) {
  const resolvedColor: TextColor = colorBySign ? (amount > 0 ? 'success' : amount < 0 ? 'danger' : color) : color;

  return (
    <Text
      variant={variant}
      color={resolvedColor}
      accessibilityLabel={masked ? 'Amount hidden' : spokenMoney(amount, currency, { locale, signDisplay })}
      {...rest}
    >
      {masked ? MASK : formatMoney(amount, currency, { locale, signDisplay })}
    </Text>
  );
}
