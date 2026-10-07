import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { useTheme, type LogoSize } from '@/theme';

import { FINSTA_MARK, FINSTA_STACKED, FINSTA_WORDMARK } from './finstaLogoPath';

/**
 * Which colour the logo is drawn in. Every option adapts to light and dark mode and has been
 * contrast-checked against the surface it is meant for:
 *  - `primary`:   ink on the page or a card (near-black in light, near-white in dark). The default.
 *  - `brand`:     the brand blue, for hero areas on the page background.
 *  - `secondary`: a quieter grey, for footers and tertiary placements.
 *  - `inverse`:   for sitting ON a brand-blue or other filled action surface.
 */
export type LogoColor = 'primary' | 'brand' | 'secondary' | 'inverse';

/**
 *  - `horizontal`: mark and wordmark side by side. For headers and toolbars.
 *  - `stacked`:    mark above wordmark, as originally designed. For hero areas and cards.
 *  - `mark`:       the symbol alone. For tight spaces such as app icons and avatars.
 */
export type LogoVariant = 'horizontal' | 'stacked' | 'mark';

export const BRAND_NAME = 'Finsta';

export interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  color?: LogoColor;
  /** Spoken name. Defaults to the brand name. Use `decorative` when the name is announced next to it. */
  label?: string;
  /** Hide from screen readers. */
  decorative?: boolean;
}

// In the horizontal lockup the wordmark is half the mark's height, matching the stacked artwork's proportions.
const WORDMARK_SCALE = (0.5 * FINSTA_MARK.height) / FINSTA_WORDMARK.height;
const GAP = FINSTA_MARK.width * 0.17;
const HORIZONTAL = {
  width: FINSTA_MARK.width + GAP + FINSTA_WORDMARK.width * WORDMARK_SCALE,
  height: FINSTA_MARK.height,
};

/** The Finsta logo as a crisp vector that recolours for any theme or background. */
export function Logo({ variant = 'horizontal', size = 'medium', color = 'primary', label = BRAND_NAME, decorative = false }: LogoProps) {
  const { colors, logoHeight } = useTheme();

  const fill = {
    primary: colors.text.primary,
    brand: colors.action.primary,
    secondary: colors.text.secondary,
    inverse: colors.text.inverse,
  }[color];

  const box = variant === 'mark' ? FINSTA_MARK : variant === 'stacked' ? FINSTA_STACKED : HORIZONTAL;
  const height = logoHeight[size];
  const width = (height * box.width) / box.height;

  return (
    <View
      accessible={!decorative}
      accessibilityRole={decorative ? undefined : 'image'}
      accessibilityLabel={decorative ? undefined : label}
      accessibilityElementsHidden={decorative}
      importantForAccessibility={decorative ? 'no-hide-descendants' : 'auto'}
    >
      <Svg width={width} height={height} viewBox={`0 0 ${box.width} ${box.height}`}>
        {variant === 'mark' ? <Path d={FINSTA_MARK.path} fill={fill} fillRule="evenodd" /> : null}
        {variant === 'stacked' ? <Path d={FINSTA_STACKED.path} fill={fill} fillRule="evenodd" /> : null}
        {variant === 'horizontal' ? (
          <>
            <Path d={FINSTA_MARK.path} fill={fill} fillRule="evenodd" />
            <G transform={`translate(${FINSTA_MARK.width + GAP} ${(FINSTA_MARK.height - FINSTA_WORDMARK.height * WORDMARK_SCALE) / 2}) scale(${WORDMARK_SCALE})`}>
              <Path d={FINSTA_WORDMARK.path} fill={fill} fillRule="evenodd" />
            </G>
          </>
        ) : null}
      </Svg>
    </View>
  );
}
