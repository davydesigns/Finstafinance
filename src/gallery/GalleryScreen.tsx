import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import { Text } from '@/components/core';
import { useTheme } from '@/theme';

/** Shared scaffolding for component gallery screens. Not part of the design system. */
export function GalleryScreen({ children }: { children: ReactNode }) {
  const { space } = useTheme();
  return <ScrollView contentContainerStyle={{ padding: space[4], paddingBottom: space[16] }}>{children}</ScrollView>;
}

export function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  const { space } = useTheme();
  return (
    <View style={{ marginTop: space[8], gap: space[3] }}>
      <Text variant="title3" accessibilityRole="header">
        {title}
      </Text>
      {note ? (
        <Text variant="callout" color="secondary">
          {note}
        </Text>
      ) : null}
      {children}
    </View>
  );
}
