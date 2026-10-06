import { Link, type Href } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import { Card, Text } from '@/components/core';
import { useTheme } from '@/theme';

const ENTRIES: { href: Href; title: string; subtitle: string }[] = [
  { href: '/foundations', title: 'Foundations', subtitle: 'Colour, type, spacing, radius, elevation' },
  { href: '/components/text', title: 'Text', subtitle: 'Type scale and colour roles' },
  { href: '/components/button', title: 'Button', subtitle: 'Variants, disabled, loading' },
  { href: '/components/card', title: 'Card', subtitle: 'Outlined and raised containers' },
];

export default function GalleryHome() {
  const { colors, space, radius, touchTarget } = useTheme();

  return (
    <ScrollView contentContainerStyle={{ padding: space[4], gap: space[3] }}>
      <Text variant="title1" accessibilityRole="header">
        Fintech design system
      </Text>
      <Text color="secondary">React Native + Expo. Tokens first, then components.</Text>

      <View style={{ gap: space[2], marginTop: space[4] }}>
        {ENTRIES.map((entry) => (
          <Link key={entry.title} href={entry.href} asChild>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={`${entry.title}: ${entry.subtitle}`}
              style={({ pressed }) => ({
                minHeight: touchTarget,
                borderRadius: radius.lg,
                backgroundColor: pressed ? colors.action.subtle : 'transparent',
              })}
            >
              <Card>
                <Text variant="bodyStrong">{entry.title}</Text>
                <Text variant="callout" color="secondary">
                  {entry.subtitle}
                </Text>
              </Card>
            </Pressable>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}
