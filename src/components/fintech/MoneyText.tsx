import type { StyleProp, TextProps as RNTextProps } from 'react-native';

import { resolveTextColor, TextBase, type ColorChoice } from '@/components/core/Text';
import type { TextLayoutStyle } from '@/components/core/layoutStyle';
import { useLocale, useStrings } from '@/i18n';
import { useTheme, type MoneyVariant } from '@/theme';
import { FIGURE_PROPS, WEB_NO_WRAP } from './figure';
import { formatMoney, spokenMoney, type Money, type SignDisplay } from '@/utils/money';

/** Which directions get a status colour. Signs always show alongside, so colour is never the only cue. */
export type SignTone = 'none' | 'credits' | 'both';

export interface MoneyTextProps extends Omit<RNTextProps, 'style' | 'children'>, ColorChoice {
  amount: Money;
  /** BCP 47 override. Normally set once via <LocaleProvider>. */
  locale?: string;
  signDisplay?: SignDisplay;
  variant?: MoneyVariant;
  /** Hides the figure (privacy mode). A fixed mask is used so the size of the amount isn't leaked. */
  masked?: boolean;
  /** `credits`: money in is green. `both`: money out is red too. Forces visible signs. */
  signTone?: SignTone;
  /** Struck through, e.g. for a failed transaction. */
  strikethrough?: boolean;
  style?: StyleProp<TextLayoutStyle>;
}

const MASK = '••••••';

export function MoneyText({
  amount,
  locale: localeOverride,
  signDisplay: requestedSign = 'auto',
  variant = 'money',
  masked = false,
  signTone = 'none',
  strikethrough = false,
  color,
  tone,
  style,
  ...rest
}: MoneyTextProps) {
  const { colors } = useTheme();
  const locale = useLocale(localeOverride);
  const strings = useStrings();

  // Colour must never be the only cue for credit vs debit, so colouring forces visible signs.
  const signDisplay: SignDisplay = signTone !== 'none' && requestedSign === 'never' ? 'always' : requestedSign;
  const resolvedTone =
    amount.minor > 0 && signTone !== 'none' ? 'success' : amount.minor < 0 && signTone === 'both' ? 'danger' : tone;

  return (
    <TextBase
      variant={variant}
      colorValue={resolveTextColor(colors, { color, tone: resolvedTone })}
      {...FIGURE_PROPS}
      accessibilityLabel={masked ? strings.money.hidden : spokenMoney(amount, { locale, signDisplay, words: strings.money })}
      style={[WEB_NO_WRAP, strikethrough && { textDecorationLine: 'line-through' }, style]}
      {...rest}
    >
      {masked ? MASK : formatMoney(amount, { locale, signDisplay })}
    </TextBase>
  );
}
