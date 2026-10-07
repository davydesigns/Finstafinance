import { View } from 'react-native';

import { Icon, IconTile, PressableSurface, Row, Stack, Text, type IconName } from '@/components/core';
import { useLocale, useStrings, type Strings } from '@/i18n';
import { useTheme } from '@/theme';
import { formatDate } from '@/utils/date';
import { spokenMoney, type Money } from '@/utils/money';

import { MoneyText } from './MoneyText';
import { StatusBadge } from './StatusBadge';

/** Categories the design system has an icon and label for. Any other string is allowed (see `typeLabel`). */
export type TransactionKind = keyof Strings['transaction']['types'];
export type TransactionStatus = 'completed' | 'pending' | 'failed';

const KIND_ICON: Record<TransactionKind, IconName> = {
  purchase: 'bag-handle',
  transfer: 'swap-horizontal',
  fee: 'receipt',
  refund: 'return-up-back',
  subscription: 'repeat',
};

function isKind(type: string, kinds: object): type is TransactionKind {
  return type in kinds;
}

export interface TransactionRowProps {
  /** Merchant or payee name. */
  title: string;
  date: Date;
  /** Direction comes from the sign: negative is money out, positive is money in. */
  amount: Money;
  /** A category. Known kinds get an icon and a translated label; others fall back to the direction. */
  type?: TransactionKind | (string & {});
  /** Overrides the label shown and spoken for `type`. */
  typeLabel?: string;
  /** `completed` shows no badge; `pending` and `failed` do. Default `completed`. */
  status?: TransactionStatus;
  /** Overrides the icon implied by `type`. */
  icon?: IconName;
  locale?: string;
  /** Privacy mode: hides the amount, and says so to screen readers. */
  masked?: boolean;
  /** Makes the row tappable (e.g. open details). */
  onPress?: () => void;
}

export function TransactionRow({
  title,
  date,
  amount,
  type,
  typeLabel,
  status = 'completed',
  icon,
  locale: localeOverride,
  masked = false,
  onPress,
}: TransactionRowProps) {
  const { colors, space, touchTarget, radius } = useTheme();
  const locale = useLocale(localeOverride);
  const strings = useStrings();
  const failed = status === 'failed';
  const credit = amount.minor > 0;

  const known = type !== undefined && isKind(type, strings.transaction.types);
  const label = typeLabel ?? (known ? strings.transaction.types[type] : credit ? strings.transaction.credit : strings.transaction.debit);
  const glyph: IconName = icon ?? (known ? KIND_ICON[type] : credit ? 'arrow-down-circle' : 'arrow-up-circle');

  const statusWord = status === 'pending' ? strings.transaction.pending : failed ? strings.transaction.failed : null;

  // One sentence for screen readers, instead of five separate stops.
  const spoken = [
    title,
    label,
    masked ? strings.money.hidden : spokenMoney(amount, { locale, signDisplay: 'always', words: strings.money }),
    formatDate(date, locale, 'long'),
    statusWord,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <PressableSurface label={spoken} hint={strings.transaction.opens} onPress={onPress} radius="md">
      {(pressed) => (
        <View
          style={{
            minHeight: touchTarget,
            flexDirection: 'row',
            alignItems: 'center',
            gap: space[3],
            paddingVertical: space[3],
            paddingHorizontal: space[2],
            borderRadius: radius.md,
            backgroundColor: pressed ? colors.surface.pressed : 'transparent',
          }}
        >
          <IconTile name={glyph} />
          <Stack gap={1} align="start" style={{ flex: 1 }}>
            <Text variant="bodyStrong" numberOfLines={2}>
              {title}
            </Text>
            <Text variant="bodySmall" color="secondary" numberOfLines={2}>
              {[formatDate(date, locale, 'short'), label].filter(Boolean).join(' · ')}
            </Text>
            {status === 'pending' ? <StatusBadge status="pending" label={strings.transaction.pending} /> : null}
            {failed ? <StatusBadge status="danger" label={strings.transaction.failed} /> : null}
          </Stack>
          <Row gap={1}>
            <MoneyText
              amount={amount}
              locale={locale}
              signDisplay="always"
              signTone={failed ? 'none' : 'credits'}
              color={failed ? 'secondary' : undefined}
              strikethrough={failed}
              masked={masked}
            />
            {onPress ? <Icon name="chevron-forward" size="small" color="secondary" /> : null}
          </Row>
        </View>
      )}
    </PressableSurface>
  );
}
