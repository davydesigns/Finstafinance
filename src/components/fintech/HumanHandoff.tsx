import { View } from 'react-native';

import { Button, Card, Icon, Row, Stack, Text } from '@/components/core';
import { useStrings } from '@/i18n';
import { useTheme } from '@/theme';

export interface HumanHandoffProps {
  /** `bar` stays visible at the top of a conversation. `card` is the full offer, used when escalating. */
  variant?: 'bar' | 'card';
  /** Honest expected wait, in minutes. Omit if unknown rather than guessing. */
  waitMinutes?: number;
  onTalk: () => void;
  /** Offer a callback instead of waiting. */
  onCallback?: () => void;
  /** Why a person is needed, shown in the card form. */
  reason?: string;
}

/**
 * The way out to a human. It must exist from the first message and appear automatically when a
 * conversation is going badly or touches something regulated. A bot without one is a "doom loop".
 */
export function HumanHandoff({ variant = 'bar', waitMinutes, onTalk, onCallback, reason }: HumanHandoffProps) {
  const { space } = useTheme();
  const strings = useStrings();
  const wait = waitMinutes === undefined ? undefined : strings.ai.handoff.wait.replace('{minutes}', String(waitMinutes));

  if (variant === 'bar') {
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: space[3] }}>
        <Row gap={2}>
          <Icon name="person" size="small" color="secondary" />
          {wait ? (
            <Text variant="caption" color="secondary">
              {wait}
            </Text>
          ) : null}
        </Row>
        <Button label={strings.ai.talkToPerson} variant="secondary" size="small" accessibilityHint={strings.ai.talkToPersonHint} onPress={onTalk} />
      </View>
    );
  }

  return (
    <Card variant="outlined" padding="lg">
      <Stack gap={3}>
        <Row gap={2}>
          <Icon name="person" color="link" />
          <Text variant="bodyStrong">{reason ?? strings.ai.handoff.reason}</Text>
        </Row>
        {wait ? (
          <Text variant="bodySmall" color="secondary">
            {wait}
          </Text>
        ) : null}
        <Button label={strings.ai.talkToPerson} fullWidth accessibilityHint={strings.ai.talkToPersonHint} onPress={onTalk} />
        {onCallback ? <Button label={strings.ai.handoff.callback} variant="tertiary" fullWidth onPress={onCallback} /> : null}
      </Stack>
    </Card>
  );
}
