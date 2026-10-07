import { View } from 'react-native';

import { AILabel } from '@/components/ai';
import { Banner, Button, Card, Stack, Text } from '@/components/core';
import { useLocale, useStrings } from '@/i18n';
import { useTheme } from '@/theme';
import { spokenMoney, type Money } from '@/utils/money';

import { MoneyText } from './MoneyText';

export interface ActionProposalCardProps {
  recipient: string;
  amount: Money;
  /** Where the money comes from, e.g. "Checking •••• 4821". */
  from: string;
  /** e.g. "Today". */
  when: string;
  /** App-supplied risk note, e.g. "You haven't paid Sam before". The component never decides what is risky. */
  warning?: string;
  loading?: boolean;
  onConfirm: () => void;
  onEdit: () => void;
  onCancel: () => void;
  locale?: string;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const { space } = useTheme();
  return (
    <View accessible accessibilityLabel={`${label}: ${value}`} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space[3] }}>
      <Text variant="bodySmall" color="secondary">
        {label}
      </Text>
      <Text variant="bodyStrong" style={{ flexShrink: 1, textAlign: 'right' }}>
        {value}
      </Text>
    </View>
  );
}

/**
 * AI PROPOSES, A PERSON DISPOSES. When an assistant drafts a payment, this card shows exactly
 * what would happen and says plainly that nothing has been sent. Only the "Confirm" button, pressed
 * by the customer, moves money. There is no auto-confirm.
 */
export function ActionProposalCard({
  recipient,
  amount,
  from,
  when,
  warning,
  loading = false,
  onConfirm,
  onEdit,
  onCancel,
  locale: localeOverride,
}: ActionProposalCardProps) {
  const locale = useLocale(localeOverride);
  const strings = useStrings();
  const p = strings.ai.proposal;

  return (
    <Card variant="elevated" tone="ai" padding="lg">
      <Stack gap={4}>
        <AILabel label={p.aiDrafted} />
        <Text variant="heading2">{p.title}</Text>

        <View accessible accessibilityLabel={`${p.amount}: ${spokenMoney(amount, { locale, words: strings.money })}`}>
          <MoneyText variant="moneyLarge" amount={amount} locale={locale} />
        </View>

        <Stack gap={2}>
          <DetailRow label={p.to} value={recipient} />
          <DetailRow label={p.from} value={from} />
          <DetailRow label={p.when} value={when} />
        </Stack>

        {warning ? <Banner tone="warning" title={warning} /> : null}

        <Text variant="bodySmall" color="secondary">
          {p.nothingSent}
        </Text>

        <Stack gap={2}>
          <Button label={p.confirm} fullWidth loading={loading} onPress={onConfirm} />
          <Button label={p.edit} variant="secondary" fullWidth disabled={loading} onPress={onEdit} />
          <Button label={p.cancel} variant="tertiary" fullWidth disabled={loading} onPress={onCancel} />
        </Stack>
      </Stack>
    </Card>
  );
}
