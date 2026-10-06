import { Pressable, View } from 'react-native';

import { Card, IconTile, Text, type IconName } from '@/components/core';
import { useTheme } from '@/theme';
import { spokenMoney } from '@/utils/money';

import { MoneyText } from './MoneyText';
import { StatusBadge, type BadgeStatus } from './StatusBadge';

export type AccountType = 'checking' | 'savings' | 'credit' | 'investment';

const ACCOUNT_TYPE: Record<AccountType, { label: string; icon: IconName }> = {
  checking: { label: 'Checking', icon: 'swap-horizontal' },
  savings: { label: 'Savings', icon: 'wallet' },
  credit: { label: 'Credit card', icon: 'card' },
  investment: { label: 'Investment', icon: 'trending-up' },
};

export interface AccountCardProps {
  name: string;
  accountType: AccountType;
  /**
   * Only the last four digits. The design system never receives a full
   * account number, so it cannot leak one.
   */
  lastFour: string;
  /** INTEGER MINOR UNITS. */
  balance: number;
  currency: string;
  /** Default "Available balance". Credit accounts might say "Current balance". */
  balanceLabel?: string;
  status?: { status: BadgeStatus; label: string };
  /** Privacy mode: hides the balance and says so to screen readers. */
  hideBalance?: boolean;
  locale?: string;
  /** Makes the whole card tappable (e.g. open the account). */
  onPress?: () => void;
}

export function AccountCard({
  name,
  accountType,
  lastFour,
  balance,
  currency,
  balanceLabel = 'Available balance',
  status,
  hideBalance = false,
  locale,
  onPress,
}: AccountCardProps) {
  const { colors, space } = useTheme();
  const { label: typeLabel, icon } = ACCOUNT_TYPE[accountType];

  // Digits are spaced so screen readers say "1 2 3 4", not "one thousand two hundred…".
  const spoken = [
    name,
    `${typeLabel} account ending in ${lastFour.split('').join(' ')}`,
    `${balanceLabel} ${hideBalance ? 'hidden' : spokenMoney(balance, currency, { locale })}`,
    status?.label,
  ]
    .filter(Boolean)
    .join(', ');

  const body = (pressed: boolean) => (
    <Card variant="elevated" padding={5} style={pressed ? { backgroundColor: colors.action.subtle } : undefined}>
      <View style={{ gap: space[4] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[3] }}>
          <IconTile name={icon} />
          <View style={{ flex: 1 }}>
            <Text variant="bodyStrong" numberOfLines={1}>
              {name}
            </Text>
            <Text variant="bodySmall" color="secondary">
              {typeLabel} · •••• {lastFour}
            </Text>
          </View>
          {status ? <StatusBadge status={status.status} label={status.label} /> : null}
        </View>
        <View>
          <Text variant="bodySmall" color="secondary">
            {balanceLabel}
          </Text>
          <MoneyText variant="moneyLarge" amount={balance} currency={currency} locale={locale} masked={hideBalance} />
        </View>
      </View>
    </Card>
  );

  if (!onPress) {
    return (
      <View accessible accessibilityLabel={spoken}>
        {body(false)}
      </View>
    );
  }

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={spoken} accessibilityHint="Opens account" onPress={onPress}>
      {({ pressed }) => body(pressed)}
    </Pressable>
  );
}
