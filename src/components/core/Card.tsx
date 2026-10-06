import { View, type StyleProp, type ViewProps } from 'react-native';

import { useTheme } from '@/theme';

import type { LayoutStyle } from './layoutStyle';

export type CardVariant = 'default' | 'elevated' | 'outlined';
export type CardPadding = 'sm' | 'md' | 'lg' | 'xl';

const PADDING = { sm: 2, md: 4, lg: 6, xl: 8 } as const;

export interface CardProps extends Omit<ViewProps, 'style'> {
  /**
   * `default`: filled surface, no border or shadow.
   * `elevated`: floats above the page with a shadow (lighter surface in dark mode).
   * `outlined`: flat with a border. Good for lists.
   */
  variant?: CardVariant;
  /** `sm` 8pt, `md` 16pt (default), `lg` 24pt, `xl` 32pt. */
  padding?: CardPadding;
  /** Show the pressed look. Set by interactive wrappers, not by hand. */
  pressed?: boolean;
  /** Layout only (margin, flex). Colour, radius and border come from tokens. */
  style?: StyleProp<LayoutStyle>;
}

/** A themed container for grouping related content. */
export function Card({ variant = 'default', padding = 'md', pressed = false, style, ...rest }: CardProps) {
  const { colors, radius, space, elevation, borderWidth } = useTheme();
  const base = variant === 'elevated' ? colors.surface.elevated : colors.surface.primary;

  return (
    <View
      style={[
        {
          padding: space[PADDING[padding]],
          borderRadius: radius.lg,
          backgroundColor: pressed ? colors.surface.pressed : base,
          borderWidth: variant === 'outlined' ? borderWidth.thin : borderWidth.none,
          borderColor: colors.border.default,
        },
        variant === 'elevated' ? elevation.medium : elevation.none,
        style,
      ]}
      {...rest}
    />
  );
}
