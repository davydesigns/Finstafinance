import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { useTheme, type RadiusToken } from '@/theme';

import { useFocusRing } from './useFocusRing';

interface PressableSurfaceProps {
  /** One spoken sentence describing the whole thing. Children are merged into it. */
  label: string;
  /** Present => tappable (role "button"); absent => a plain, static group. */
  onPress?: () => void;
  /** What happens on press, e.g. "Opens account". Only used when tappable. */
  hint?: string;
  /** Match the child's corner radius so the focus ring hugs it. */
  radius?: RadiusToken;
  /** Render the content; `pressed` is true while a finger is down. */
  children: (pressed: boolean) => ReactNode;
}

/**
 * Shared behaviour for rows and cards that may or may not be tappable:
 * one combined screen-reader label, a button role, a keyboard focus ring and
 * pressed state. Components own the look; this owns the interaction.
 */
export function PressableSurface({ label, onPress, hint, radius: radiusToken = 'md', children }: PressableSurfaceProps) {
  const { radius } = useTheme();
  const { handlers, ringStyle } = useFocusRing();

  if (!onPress) {
    return (
      <View accessible accessibilityLabel={label}>
        {children(false)}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      onPress={onPress}
      style={[{ borderRadius: radius[radiusToken] }, ringStyle]}
      {...handlers}
    >
      {({ pressed }) => children(pressed)}
    </Pressable>
  );
}
