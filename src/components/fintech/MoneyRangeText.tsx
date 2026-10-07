import { View } from 'react-native';

import { Text } from '@/components/core';
import { TextBase } from '@/components/core/Text';
import { useLocale, useStrings } from '@/i18n';
import { useTheme, type MoneyVariant } from '@/theme';
import { formatMoney, spokenMoney, type Money } from '@/utils/money';

import { FIGURE_PROPS, WEB_NO_WRAP } from './figure';

export interface MoneyRangeTextProps {
  low: Money;
  high: Money;
  variant?: MoneyVariant;
  /** BCP 47 override. Normally set once via <LocaleProvider>. */
  locale?: string;
  /** Show the "Estimate" caption. Leave on: a forecast must never read as a fact. */
  showEstimateLabel?: boolean;
}

/**
 * A forecast as a RANGE, not a single number. A single figure ("$1,260") reads as a promise;
 * a range with an "Estimate" label tells the truth about uncertainty without alarming anyone.
 */
export function MoneyRangeText({ low, high, variant = 'money', locale: localeOverride, showEstimateLabel = true }: MoneyRangeTextProps) {
  const { colors, space } = useTheme();
  const locale = useLocale(localeOverride);
  const strings = useStrings();

  if (low.currency !== high.currency) throw new RangeError('MoneyRangeText needs both amounts in the same currency');
  if (low.minor > high.minor) throw new RangeError('MoneyRangeText: low must not be greater than high');

  const spoken = `${strings.ai.estimate}: ${strings.ai.range
    .replace('{low}', spokenMoney(low, { locale, words: strings.money }))
    .replace('{high}', spokenMoney(high, { locale, words: strings.money }))}`;

  return (
    <View accessible accessibilityLabel={spoken} style={{ gap: space[1] }}>
      <TextBase variant={variant} colorValue={colors.text.primary} {...FIGURE_PROPS} style={WEB_NO_WRAP}>
        {formatMoney(low, { locale })}
        {'–'}
        {formatMoney(high, { locale })}
      </TextBase>
      {showEstimateLabel ? (
        <Text variant="caption" color="secondary">
          {strings.ai.estimate}
        </Text>
      ) : null}
    </View>
  );
}
