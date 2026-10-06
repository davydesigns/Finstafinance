import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useTheme, type LogoSize } from '@/theme';

import { LOGO_HEIGHT, LOGO_PATH, LOGO_WIDTH } from './logoPath';
import { Text, type TextProps } from './Text';

/**
 * Which colour the mark is drawn in. Every option adapts to light and dark mode and
 * has been contrast-checked against the surface it is meant for:
 *  - `primary`:   ink on the page or a card (near-black in light, near-white in dark). The default.
 *  - `brand`:     the brand blue, for hero areas and headers on the page background.
 *  - `secondary`: a quieter grey, for footers and tertiary placements.
 *  - `inverse`:   for sitting ON a brand-blue or other filled action surface.
 */
export type LogoColor = 'primary' | 'brand' | 'secondary' | 'inverse';

export const BRAND_NAME = 'Davy Designs';

export interface LogoProps {
  size?: LogoSize;
  color?: LogoColor;
  /** Show the brand name beside the mark. */
  showName?: boolean;
  /**
   * Spoken name. Defaults to the brand name. Set `decorative` instead when
   * the brand name is already announced right next to it.
   */
  label?: string;
  /** Hide from screen readers. */
  decorative?: boolean;
}

const NAME_VARIANT: Record<LogoSize, NonNullable<TextProps['variant']>> = {
  small: 'bodyStrong',
  medium: 'heading3',
  large: 'heading2',
};

/** The Davy Designs mark as a crisp vector that recolours for any theme or background. */
export function Logo({ size = 'medium', color = 'primary', showName = false, label = BRAND_NAME, decorative = false }: LogoProps) {
  const { colors, logoHeight, space } = useTheme();

  const fill = {
    primary: colors.text.primary,
    brand: colors.action.primary,
    secondary: colors.text.secondary,
    inverse: colors.text.inverse,
  }[color];
  const nameColor = ({ primary: 'primary', brand: 'link', secondary: 'secondary', inverse: 'inverse' } as const)[color];

  const height = logoHeight[size];
  const width = (height * LOGO_WIDTH) / LOGO_HEIGHT;

  return (
    <View
      accessible={!decorative}
      accessibilityRole={decorative ? undefined : 'image'}
      accessibilityLabel={decorative ? undefined : label}
      accessibilityElementsHidden={decorative}
      importantForAccessibility={decorative ? 'no-hide-descendants' : 'auto'}
      style={{ flexDirection: 'row', alignItems: 'center', gap: space[3] }}
    >
      <Svg width={width} height={height} viewBox={`0 0 ${LOGO_WIDTH} ${LOGO_HEIGHT}`}>
        <Path d={LOGO_PATH} fill={fill} />
      </Svg>
      {/* The group above carries the spoken name once, so the visible text is not read again. */}
      {showName ? (
        <Text variant={NAME_VARIANT[size]} color={nameColor} accessibilityElementsHidden importantForAccessibility="no">
          {BRAND_NAME}
        </Text>
      ) : null}
    </View>
  );
}
