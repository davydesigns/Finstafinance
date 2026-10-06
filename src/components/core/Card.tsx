import { View, type ViewProps } from 'react-native';

import { useTheme, type SpaceToken } from '@/theme';

export interface CardProps extends ViewProps {
  /** `outlined` sits flat with a border. `raised` floats with a soft shadow. */
  variant?: 'outlined' | 'raised';
  padding?: SpaceToken;
}

/** A themed container for grouping related content. */
export function Card({ variant = 'outlined', padding = 4, style, ...rest }: CardProps) {
  const { colors, radius, space, elevation } = useTheme();
  const raised = variant === 'raised';

  return (
    <View
      style={[
        {
          padding: space[padding],
          borderRadius: radius.lg,
          backgroundColor: raised ? colors.surface.elevated : colors.surface.primary,
          borderWidth: raised ? 0 : 1,
          borderColor: colors.border.default,
        },
        raised ? elevation.medium : elevation.none,
        style,
      ]}
      {...rest}
    />
  );
}
