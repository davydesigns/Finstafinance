import type { ReactNode } from 'react';

import { Screen, Stack, Text } from '@/components/core';
import { useTheme } from '@/theme';

/** Shared scaffolding for component gallery screens. Not part of the design system. */
export function GalleryScreen({ children }: { children: ReactNode }) {
  return <Screen>{children}</Screen>;
}

export function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  const { space } = useTheme();
  return (
    <Stack gap={3} style={{ marginTop: space[8] }}>
      <Text variant="heading3">{title}</Text>
      {note ? (
        <Text variant="bodySmall" color="secondary">
          {note}
        </Text>
      ) : null}
      {children}
    </Stack>
  );
}
