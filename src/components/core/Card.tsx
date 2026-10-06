import { View, type ViewProps } from 'react-native';

import { useTheme, type SpaceToken } from '@/theme';

export type CardVariant = 'default' | 'elevated' | 'outlined';

export interface CardProps extends ViewProps {
  /**
   * `default`: filled surface, no border or shadow.
   * `elevated`: floats above the page with a shadow (lighter surface in dark mode).
   * `outlined`: flat with a border. Good for lists.
   */
  variant?: CardVariant;
  /** A spacing token key: 4 = 16pt. */
  padding?: SpaceToken;
}

/** A themed container for grouping related content. */
export function Card({ variant = 'default', padding = 4, style, ...rest }: CardProps) {
  const { colors, radius, space, elevation, borderWidth } = useTheme();

  return (
    <View
      style={[
        {
          padding: space[padding],
          borderRadius: radius.lg,
          backgroundColor: variant === 'elevated' ? colors.surface.elevated : colors.surface.primary,
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
