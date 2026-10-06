import { useState } from 'react';
import type { PressableProps, ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

type FocusHandler = NonNullable<PressableProps['onFocus']>;

/**
 * Keyboard / switch-control focus indicator, shared by every pressable.
 * Spread `handlers` onto the Pressable and add `ringStyle` to its style.
 * A touch-only phone user never sees it; keyboard, Switch Control and
 * external-keyboard users depend on it to know where they are.
 */
export function useFocusRing(onFocus?: FocusHandler | null, onBlur?: FocusHandler | null) {
  const { colors, borderWidth } = useTheme();
  const [focused, setFocused] = useState(false);

  const handlers = {
    onFocus: ((e) => {
      setFocused(true);
      onFocus?.(e);
    }) as FocusHandler,
    onBlur: ((e) => {
      setFocused(false);
      onBlur?.(e);
    }) as FocusHandler,
  };

  const ringStyle: ViewStyle = {
    outlineWidth: focused ? borderWidth.medium : borderWidth.none,
    outlineColor: colors.border.focus,
    outlineOffset: 2,
    outlineStyle: 'solid',
  };

  return { handlers, ringStyle };
}
