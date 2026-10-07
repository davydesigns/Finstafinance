import { View } from 'react-native';

import { AILabel, ConfidenceIndicator, FeedbackControl, type ConfidenceLevel, type Feedback } from '@/components/ai';
import { Button, Card, Disclosure, Row, Stack, Text } from '@/components/core';
import { useStrings } from '@/i18n';
import type { Money } from '@/utils/money';

import { MoneyText } from './MoneyText';

export interface InsightCardProps {
  title: string;
  summary: string;
  /** The one figure the insight is about. */
  amount?: Money;
  /** Only pass confidence when it can change what the customer does. */
  confidence?: ConfidenceLevel;
  /** The evidence behind it. Without this, the card cannot explain itself, so provide it. */
  why: { dataUsed: string[]; factors: string[] };
  action?: { label: string; onPress: () => void };
  onDismiss?: () => void;
  onFeedback?: (feedback: Feedback) => void;
  /** Opens the controls for the data this insight uses. */
  onChangeData?: () => void;
  /** Stops this KIND of insight. */
  onTurnOff?: () => void;
  locale?: string;
}

function Bullets({ heading, items }: { heading: string; items: string[] }) {
  return (
    <Stack gap={1}>
      <Text variant="label">{heading}</Text>
      {items.map((item) => (
        <Text key={item} variant="bodySmall" color="secondary">
          {`• ${item}`}
        </Text>
      ))}
    </Stack>
  );
}

/**
 * A proactive insight from the AI: labelled as AI, explainable in two taps ("Why am I seeing
 * this?"), correctable (feedback with reasons) and controllable (change the data, or turn off).
 */
export function InsightCard({
  title,
  summary,
  amount,
  confidence,
  why,
  action,
  onDismiss,
  onFeedback,
  onChangeData,
  onTurnOff,
  locale,
}: InsightCardProps) {
  const strings = useStrings();

  return (
    <Card variant="outlined" tone="ai" padding="lg">
      <Stack gap={3}>
        <Row gap={3} wrap>
          <View style={{ flex: 1 }}>
            <AILabel />
          </View>
          {onDismiss ? <Button label={strings.ai.dismiss} variant="tertiary" size="small" onPress={onDismiss} /> : null}
        </Row>

        <Text variant="heading3">{title}</Text>
        {amount ? <MoneyText variant="moneyLarge" amount={amount} locale={locale} /> : null}
        <Text color="secondary">{summary}</Text>
        {confidence ? <ConfidenceIndicator level={confidence} /> : null}
        {action ? <Button label={action.label} fullWidth onPress={action.onPress} /> : null}

        <Disclosure title={strings.ai.why.title}>
          <Bullets heading={strings.ai.why.dataUsed} items={why.dataUsed} />
          <Bullets heading={strings.ai.why.factors} items={why.factors} />
          <Stack gap={1} align="start">
            {onChangeData ? <Button label={strings.ai.why.change} variant="tertiary" size="small" onPress={onChangeData} /> : null}
            {onTurnOff ? <Button label={strings.ai.why.turnOff} variant="tertiary" size="small" onPress={onTurnOff} /> : null}
          </Stack>
        </Disclosure>

        {onFeedback ? <FeedbackControl onSubmit={onFeedback} /> : null}
      </Stack>
    </Card>
  );
}
