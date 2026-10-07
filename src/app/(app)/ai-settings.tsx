import { useState } from 'react';

import { Banner, Card, Disclosure, Screen, SegmentedControl, Stack, Text } from '@/components/core';
import { DataUseRow } from '@/components/fintech';
import { DemoNotice } from '@/gallery/DemoNotice';

/**
 * PATTERN: AI and data controls. Each use of data is explained in plain words, shows its state in
 * words, can be erased, and anything NEW to the customer starts OFF until they choose it.
 */
type Retention = 'off' | '30' | '365';
const RETENTION = [
  { value: 'off' as const, label: "Don't keep" },
  { value: '30' as const, label: '30 days' },
  { value: '365' as const, label: '1 year' },
];
const RETENTION_TEXT: Record<Retention, string> = {
  off: "Chats aren't saved. Each conversation starts fresh.",
  '30': 'Chats are kept for 30 days so you can pick up where you left off.',
  '365': 'Chats are kept for 1 year so you can pick up where you left off.',
};

export default function AiSettings() {
  const [insights, setInsights] = useState(true);
  const [offers, setOffers] = useState(false);
  const [retention, setRetention] = useState<Retention>('30');
  const [message, setMessage] = useState<string | null>(null);

  const erase = (what: string) => setMessage(`Done. We've erased what ${what} learned about you. (Demo: nothing was changed.)`);

  return (
    <Screen>
      <Stack gap={5}>
        <Text variant="heading1">AI and data controls</Text>
        <DemoNotice>These switches only change this page. No data is collected, stored or erased.</DemoNotice>
        <Banner tone="ai" title="You decide what AI can use">
          Anything new starts off. You can change these at any time, and erasing never affects your accounts.
        </Banner>

        {message ? (
          <Banner tone="success" title="Erased" onDismiss={() => setMessage(null)}>
            {message}
          </Banner>
        ) : null}

        <Card variant="outlined" padding="lg">
          <Stack gap={5}>
            <DataUseRow
              title="Spending insights"
              description="Looks at your transactions to spot patterns and forecast your balance."
              usedFor="insights and forecasts"
              value={insights}
              onValueChange={setInsights}
              onRemoveData={() => erase('spending insights')}
            />
            <DataUseRow
              title="Personalised offers"
              description="Uses your spending to suggest products that may suit you."
              usedFor="offers only. Never shared outside the bank"
              value={offers}
              onValueChange={setOffers}
              onRemoveData={() => erase('personalised offers')}
            />
          </Stack>
        </Card>

        <Card variant="outlined" padding="lg">
          <Stack gap={3}>
            <Text variant="bodyStrong">Assistant chat history</Text>
            <SegmentedControl options={RETENTION} value={retention} onValueChange={setRetention} accessibilityLabel="How long to keep assistant chats" />
            <Text variant="bodySmall" color="secondary">
              {RETENTION_TEXT[retention]}
            </Text>
          </Stack>
        </Card>

        <Disclosure title="Why we ask">
          <Text variant="bodySmall" color="secondary">
            AI features work better with more of your data, but that should always be your choice. We only turn on what you agree to, we say what it is used for, and you can erase it whenever you like.
          </Text>
        </Disclosure>
      </Stack>
    </Screen>
  );
}
