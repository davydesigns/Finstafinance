import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBreakpoint, useTheme } from '@/theme';

interface ScreenProps {
  /**
   * `readable` (default): one comfortable column, for forms and lists.
   * `wide`: room for multi-column layouts. Either way content is centred and never stretches across a monitor.
   */
  width?: 'readable' | 'wide';
  children: ReactNode;
}

/**
 * The page container every screen starts from: scrolls, centres, caps its width,
 * pads the edges (more on bigger windows) and keeps clear of notches and home indicators.
 */
export function Screen({ width = 'readable', children }: ScreenProps) {
  const { space, size } = useTheme();
  const insets = useSafeAreaInsets();
  const gutter = useBreakpoint() === 'compact' ? space[4] : space[6];

  return (
    <ScrollView
      // The iOS decimal keypad has no Done key, so dragging must dismiss it.
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        alignItems: 'center',
        paddingTop: gutter,
        paddingBottom: space[16] + insets.bottom,
        paddingLeft: gutter + insets.left,
        paddingRight: gutter + insets.right,
      }}
    >
      <View style={{ width: '100%', maxWidth: width === 'wide' ? size.maxWideWidth : size.maxReadableWidth }}>{children}</View>
    </ScrollView>
  );
}
