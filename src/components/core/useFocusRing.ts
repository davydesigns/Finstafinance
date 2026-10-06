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
export function useFocusRing(onFocus?: PressableProps['onFocus'], onBlur?: PressableProps['onBlur']) {
  const { colors, borderWidth } = useTheme();
  const [focused, setFocused] = useState(false);

  const handleFocus: FocusHandler = (event) => {
    setFocused(true);
    onFocus?.(event);
  };
  const handleBlur: FocusHandler = (event) => {
    setFocused(false);
    onBlur?.(event);
  };

  const ringStyle: ViewStyle = {
    outlineWidth: focused ? borderWidth.medium : borderWidth.none,
    outlineColor: colors.border.focus,
    outlineOffset: 2,
    outlineStyle: 'solid',
  };

  return { handlers: { onFocus: handleFocus, onBlur: handleBlur }, ringStyle };
}
