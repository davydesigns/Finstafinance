import { useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';

import { Button, Text } from '@/components/core';
import { useTheme } from '@/theme';
import { useHydrated } from '@/utils/useHydrated';

/** A snippet in a monospaced face, selectable, scrollable sideways, with a copy button on the web. Documentation only. */
export function CodeBlock({ code }: { code: string }) {
  const { colors, space, radius, borderWidth } = useTheme();
  const [copied, setCopied] = useState(false);
  // Only known in the browser, so it waits for hydration: the server-built page cannot have the button.
  const hydrated = useHydrated();
  const canCopy = hydrated && Platform.OS === 'web' && typeof navigator !== 'undefined' && Boolean(navigator.clipboard);

  const copy = () => {
    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <View
      style={{
        backgroundColor: colors.background.secondary,
        borderRadius: radius.md,
        borderWidth: borderWidth.thin,
        borderColor: colors.border.default,
        padding: space[3],
        gap: space[2],
      }}
    >
      <ScrollView horizontal accessibilityLabel="Code">
        <Text variant="code" selectable>
          {code}
        </Text>
      </ScrollView>
      {canCopy ? (
        <View style={{ alignItems: 'flex-start' }}>
          <Button label={copied ? 'Copied' : 'Copy code'} size="small" variant="tertiary" onPress={copy} />
        </View>
      ) : null}
    </View>
  );
}
