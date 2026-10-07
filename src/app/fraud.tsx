import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

import { Banner, Button, Screen, Stack, Text } from '@/components/core';
import { FraudAlertCard, HumanHandoff } from '@/components/fintech';
import { DemoNotice } from '@/gallery/DemoNotice';
import { money } from '@/utils/money';

/**
 * PATTERN: fraud alert triage. States the facts and the reasons, gives both answers equal
 * weight, keeps a person one tap away, and tells the customer what happened next.
 */
type Outcome = 'pending' | 'itsMe' | 'notMe' | 'talk';

const RESULT: Record<Exclude<Outcome, 'pending'>, string> = {
  itsMe: "Thanks. We've marked this purchase as yours. No further action is needed.",
  notMe: "We've locked your card ending in 4821 and started a dispute. A replacement is on its way. (Demo: nothing was changed.)",
  talk: "We're connecting you with a person.",
};

export default function Fraud() {
  const [outcome, setOutcome] = useState<Outcome>('pending');

  useEffect(() => {
    if (outcome !== 'pending' && Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(RESULT[outcome]);
  }, [outcome]);

  return (
    <Screen>
      <Stack gap={4}>
        <Text variant="heading1">Security</Text>
        <DemoNotice>This alert is a fixed example. No fraud system is running and no card is ever locked.</DemoNotice>

        {outcome === 'pending' ? (
          <FraudAlertCard
            cardLastFour="4821"
            merchant="Electro Mart"
            amount={money(-129900, 'USD')}
            date={new Date(2026, 9, 6)}
            place="Lisbon, Portugal"
            reasons={['First purchase outside the United States', 'Amount is about 9 times your usual card purchase', 'Your phone was in Chicago 20 minutes earlier']}
            onItsMe={() => setOutcome('itsMe')}
            onNotMe={() => setOutcome('notMe')}
            onTalk={() => setOutcome('talk')}
          />
        ) : (
          <Stack gap={3}>
            <Banner tone={outcome === 'itsMe' ? 'success' : 'info'} title={outcome === 'itsMe' ? 'All set' : outcome === 'notMe' ? 'Your card is secured' : 'Talking to a person'}>
              {RESULT[outcome]}
            </Banner>
            {outcome !== 'itsMe' ? <HumanHandoff variant="card" waitMinutes={2} reason="A person will review this with you" onTalk={() => undefined} onCallback={() => undefined} /> : null}
            <Stack align="start">
              <Button label="Back to the alert (demo)" variant="secondary" onPress={() => setOutcome('pending')} />
            </Stack>
          </Stack>
        )}
      </Stack>
    </Screen>
  );
}
