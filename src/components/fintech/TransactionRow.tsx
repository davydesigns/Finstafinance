import { Pressable, View } from 'react-native';

import { Icon, IconTile, Text, useFocusRing, type IconName } from '@/components/core';
import { useTheme } from '@/theme';
import { spokenMoney } from '@/utils/money';

import { MoneyText } from './MoneyText';
import { StatusBadge } from './StatusBadge';

export type TransactionType = 'purchase' | 'transfer' | 'deposit' | 'withdrawal' | 'fee' | 'refund';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

const TYPE: Record<TransactionType, { label: string; icon: IconName }> = {
  purchase: { label: 'Purchase', icon: 'bag-handle' },
  transfer: { label: 'Transfer', icon: 'swap-horizontal' },
  deposit: { label: 'Deposit', icon: 'arrow-down-circle' },
  withdrawal: { label: 'Withdrawal', icon: 'arrow-up-circle' },
  fee: { label: 'Fee', icon: 'receipt' },
  refund: { label: 'Refund', icon: 'return-up-back' },
};

export interface TransactionRowProps {
  /** Merchant or payee name. */
  title: string;
  date: Date;
  /** INTEGER MINOR UNITS. Negative = money out, positive = money in. */
  amount: number;
  currency: string;
  type: TransactionType;
  /** `completed` shows no badge; `pending` and `failed` do. Default `completed`. */
  status?: TransactionStatus;
  /** Overrides the icon implied by `type`. */
  icon?: IconName;
  locale?: string;
  /** Makes the row tappable (e.g. open details). */
  onPress?: () => void;
}

export function TransactionRow({
  title,
  date,
  amount,
  currency,
  type,
  status = 'completed',
  icon,
  locale,
  onPress,
}: TransactionRowProps) {
  const { colors, space, touchTarget, radius } = useTheme();
  const { handlers, ringStyle } = useFocusRing();
  const { label: typeLabel, icon: typeIcon } = TYPE[type];
  const failed = status === 'failed';

  const shortDate = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
  const longDate = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(date);

  // One sentence for screen readers, instead of five separate stops.
  const spoken = [
    title,
    typeLabel,
    spokenMoney(amount, currency, { locale, signDisplay: 'always' }),
    longDate,
    status === 'completed' ? null : status,
  ]
    .filter(Boolean)
    .join(', ');

  const content = (pressed: boolean) => (
    <View
      style={{
        minHeight: touchTarget,
        flexDirection: 'row',
        alignItems: 'center',
        gap: space[3],
        paddingVertical: space[3],
        paddingHorizontal: space[2],
        borderRadius: radius.md,
        backgroundColor: pressed ? colors.action.subtle : 'transparent',
      }}
    >
      <IconTile name={icon ?? typeIcon} />
      <View style={{ flex: 1, gap: space[1] }}>
        <Text variant="bodyStrong" numberOfLines={2}>
          {title}
        </Text>
        <Text variant="bodySmall" color="secondary" numberOfLines={2}>
          {shortDate} · {typeLabel}
        </Text>
        {status === 'pending' ? <StatusBadge status="pending" label="Pending" /> : null}
        {failed ? <StatusBadge status="error" label="Failed" /> : null}
      </View>
      <MoneyText
        amount={amount}
        currency={currency}
        locale={locale}
        signDisplay="always"
        color={failed ? 'secondary' : amount > 0 ? 'success' : 'primary'}
        style={failed ? { textDecorationLine: 'line-through' } : undefined}
      />
      {onPress ? <Icon name="chevron-forward" size="small" color="secondary" /> : null}
    </View>
  );

  if (!onPress) {
    return (
      <View accessible accessibilityLabel={spoken}>
        {content(false)}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={spoken}
      accessibilityHint="Opens transaction details"
      onPress={onPress}
      style={[{ borderRadius: radius.md }, ringStyle]}
      {...handlers}
    >
      {({ pressed }) => content(pressed)}
    </Pressable>
  );
}
