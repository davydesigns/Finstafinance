import { Link, type Href } from 'expo-router';
import { Pressable } from 'react-native';

import { Card, Screen, Stack, Text } from '@/components/core';
import { useTheme } from '@/theme';

const ENTRIES: { href: Href; title: string; subtitle: string }[] = [
  { href: '/accounts', title: 'Accounts (demo)', subtitle: 'A realistic screen built only from the design system' },
  { href: '/foundations', title: 'Foundations', subtitle: 'Colour, type, spacing, radius, elevation' },
  { href: '/gallery', title: 'Design System Gallery', subtitle: 'Text, Button and Card: every variation' },
  { href: '/fintech', title: 'Fintech components', subtitle: 'MoneyText, AccountCard, TransactionRow, AmountInput, StatusBadge' },
  { href: '/ai', title: 'AI components', subtitle: 'AI tokens, primitives and fintech components' },
  { href: '/assistant', title: 'AI assistant (pattern)', subtitle: 'Disclosure, streaming, payment proposals, escalation to a person' },
  { href: '/insights', title: 'Insights (pattern)', subtitle: 'Proactive AI insights that explain themselves' },
  { href: '/fraud', title: 'Fraud alert (pattern)', subtitle: 'Specific, balanced, always with a person one tap away' },
  { href: '/ai-settings', title: 'AI and data controls (pattern)', subtitle: 'Consent you can see, change and erase' },
];

export default function GalleryHome() {
  const { space, radius, touchTarget } = useTheme();

  return (
    <Screen>
      <Stack gap={3}>
        <Text variant="heading1">Fintech design system</Text>
        <Text color="secondary">React Native + Expo. Tokens first, then components.</Text>

        <Stack gap={2} style={{ marginTop: space[4] }}>
          {ENTRIES.map((entry) => (
            <Link key={entry.title} href={entry.href} asChild>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel={`${entry.title}: ${entry.subtitle}`}
                style={{ minHeight: touchTarget, borderRadius: radius.lg }}
              >
                {({ pressed }) => (
                  <Card pressed={pressed}>
                    <Text variant="bodyStrong">{entry.title}</Text>
                    <Text variant="bodySmall" color="secondary">
                      {entry.subtitle}
                    </Text>
                  </Card>
                )}
              </Pressable>
            </Link>
          ))}
        </Stack>
      </Stack>
    </Screen>
  );
}
