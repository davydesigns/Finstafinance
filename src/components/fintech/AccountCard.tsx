import { Card, IconTile, PressableSurface, Row, Stack, Text, type IconName } from '@/components/core';
import { useLocale, useStrings, type Strings } from '@/i18n';
import { useTheme } from '@/theme';
import { spokenMoney, type Money } from '@/utils/money';

import { MoneyText } from './MoneyText';
import { StatusBadge, type StatusBadgeProps } from './StatusBadge';

export type AccountType = keyof Strings['account']['types'];

const ACCOUNT_ICON: Record<AccountType, IconName> = {
  checking: 'swap-horizontal',
  savings: 'wallet',
  credit: 'card',
  investment: 'trending-up',
};

export interface AccountCardProps {
  title: string;
  accountType: AccountType;
  /**
   * Only the last four digits. The design system never receives a full
   * account number, so it cannot leak one.
   */
  lastFour: string;
  balance: Money;
  /** Default "Available balance". Credit accounts might say "Current balance". */
  balanceLabel?: string;
  status?: StatusBadgeProps;
  /** Privacy mode: hides the balance and says so to screen readers. */
  masked?: boolean;
  /** Set false when `title` already says the type ("Checking"), to avoid "Checking / Checking · 4821". */
  showAccountType?: boolean;
  locale?: string;
  /** Makes the whole card tappable (e.g. open the account). */
  onPress?: () => void;
}

export function AccountCard({
  title,
  accountType,
  lastFour,
  balance,
  balanceLabel,
  status,
  masked = false,
  showAccountType = true,
  locale: localeOverride,
  onPress,
}: AccountCardProps) {
  const { size } = useTheme();
  const locale = useLocale(localeOverride);
  const strings = useStrings();
  const typeLabel = strings.account.types[accountType];
  const balanceCaption = balanceLabel ?? strings.account.availableBalance;

  // Digits are spaced so screen readers say "1 2 3 4", not "one thousand two hundred…".
  const spoken = [
    title,
    `${typeLabel} ${strings.account.account} ${strings.account.endingIn} ${lastFour.split('').join(' ')}`,
    `${balanceCaption} ${masked ? strings.account.balanceHidden : spokenMoney(balance, { locale, words: strings.money })}`,
    status?.label,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <PressableSurface label={spoken} hint={strings.account.opens} onPress={onPress} radius="lg">
      {(pressed) => (
        <Card variant="elevated" padding="lg" pressed={pressed}>
          <Stack gap={4}>
            {/* Wraps so the status badge drops below the name when text is enlarged. */}
            <Row gap={3} wrap>
              <IconTile name={ACCOUNT_ICON[accountType]} />
              <Stack gap={0} style={{ flex: 1, flexBasis: size.minContentWidth }}>
                <Text variant="bodyStrong" numberOfLines={2}>
                  {title}
                </Text>
                <Text variant="bodySmall" color="secondary">
                  {showAccountType ? `${typeLabel} · ` : ''}•••• {lastFour}
                </Text>
              </Stack>
              {status ? <StatusBadge {...status} /> : null}
            </Row>
            <Stack gap={0}>
              <Text variant="bodySmall" color="secondary">
                {balanceCaption}
              </Text>
              <MoneyText variant="moneyLarge" amount={balance} locale={locale} masked={masked} />
            </Stack>
          </Stack>
        </Card>
      )}
    </PressableSurface>
  );
}
