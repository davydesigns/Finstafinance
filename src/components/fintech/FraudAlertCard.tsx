import { AILabel } from '@/components/ai';
import { Banner, Button, Card, Disclosure, Stack, Text } from '@/components/core';
import { useStrings } from '@/i18n';
import type { Money } from '@/utils/money';

import { TransactionRow } from './TransactionRow';

export interface FraudAlertCardProps {
  cardLastFour: string;
  merchant: string;
  /** Negative: money out. */
  amount: Money;
  date: Date;
  /** Where it happened, e.g. "Lisbon, Portugal". */
  place?: string;
  /** SPECIFIC reasons we flagged it. Generic warnings get ignored; specifics change decisions. */
  reasons: string[];
  onItsMe: () => void;
  onNotMe: () => void;
  onTalk: () => void;
  locale?: string;
}

/**
 * "Is this you?" Shows exactly what happened and exactly why it was flagged, gives both answers
 * equal weight (no pressure toward either), and keeps a person one tap away.
 */
export function FraudAlertCard({
  cardLastFour,
  merchant,
  amount,
  date,
  place,
  reasons,
  onItsMe,
  onNotMe,
  onTalk,
  locale,
}: FraudAlertCardProps) {
  const strings = useStrings();
  const f = strings.ai.fraud;

  return (
    <Stack gap={3}>
      <Banner tone="warning" title={f.title}>
        {`We noticed an unusual purchase on your card ending in ${cardLastFour.split('').join(' ')}.`}
      </Banner>

      <Card variant="outlined" padding="sm">
        <TransactionRow title={merchant} date={date} amount={amount} type="purchase" typeLabel={place} locale={locale} />
      </Card>

      <Card variant="outlined" padding="lg">
        <Stack gap={3}>
          <AILabel label="Flagged automatically" />
          <Disclosure title={f.reason}>
            <Stack gap={1}>
              {reasons.map((reason) => (
                <Text key={reason} variant="bodySmall" color="secondary">
                  {`• ${reason}`}
                </Text>
              ))}
            </Stack>
          </Disclosure>
        </Stack>
      </Card>

      <Stack gap={2}>
        <Button label={f.itsMe} fullWidth onPress={onItsMe} />
        <Button label={f.notMe} variant="destructive" fullWidth onPress={onNotMe} />
        <Button label={strings.ai.talkToPerson} variant="tertiary" fullWidth onPress={onTalk} />
      </Stack>
    </Stack>
  );
}
