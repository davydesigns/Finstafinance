import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import { useTheme, type IconSize } from '@/theme';

import { resolveTextColor, type TextColor } from './Text';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export interface IconProps {
  name: IconName;
  size?: IconSize;
  /** A colour role, same as `Text`. */
  color?: TextColor;
}

/**
 * Decorative icon. It is hidden from screen readers on purpose: the meaning
 * must always be carried by nearby text, so nobody depends on the glyph.
 */
export function Icon({ name, size = 'medium', color = 'primary' }: IconProps) {
  const { colors, iconSize } = useTheme();
  return (
    <Ionicons
      name={name}
      size={iconSize[size]}
      color={resolveTextColor(colors, color)}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}
