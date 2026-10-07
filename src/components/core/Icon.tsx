import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { useTheme, type IconSize } from '@/theme';
import { useHydrated } from '@/utils/useHydrated';

import { resolveTextColor, type ColorChoice } from './Text';

/**
 * The icons the design system ships. A closed list, so the underlying icon
 * library can change without breaking consumers. Add a name here to add an icon.
 */
const GLYPHS = {
  'checkmark-circle': 'checkmark-circle',
  warning: 'warning',
  'close-circle': 'close-circle',
  'remove-circle': 'remove-circle',
  time: 'time',
  'alert-circle': 'alert-circle',
  'chevron-forward': 'chevron-forward',
  'bag-handle': 'bag-handle',
  'swap-horizontal': 'swap-horizontal',
  'arrow-down-circle': 'arrow-down-circle',
  'arrow-up-circle': 'arrow-up-circle',
  receipt: 'receipt',
  'return-up-back': 'return-up-back',
  wallet: 'wallet',
  card: 'card',
  'trending-up': 'trending-up',
  repeat: 'repeat',
} as const satisfies Record<string, React.ComponentProps<typeof Ionicons>['name']>;

export type IconName = keyof typeof GLYPHS;

// Start loading the font as soon as the design system loads, so icons rarely appear late.
// Fire and forget: nothing waits on it, and a failure just means icons stay blank.
// Skipped while the static web build renders on a server, where there is no window to load into.
if (typeof window !== 'undefined') void Ionicons.loadFont?.()?.catch(() => undefined);

export interface IconProps extends ColorChoice {
  name: IconName;
  size?: IconSize;
}

/**
 * Decorative icon. It is hidden from screen readers on purpose: the meaning
 * must always be carried by nearby text, so nobody depends on the glyph.
 * The font loads on first use; nothing in the app needs to wait for it.
 */
export function Icon({ name, size = 'medium', color, tone }: IconProps) {
  const { colors, iconSize } = useTheme();
  // The server can't load the icon font, so it builds an empty box. The browser's first render must match it.
  if (!useHydrated()) return <View style={{ width: iconSize[size], height: iconSize[size] }} />;
  return (
    <Ionicons
      name={GLYPHS[name]}
      size={iconSize[size]}
      color={resolveTextColor(colors, { color, tone })}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}
