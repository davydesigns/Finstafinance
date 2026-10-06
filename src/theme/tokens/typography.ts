import type { TextStyle } from 'react-native';

/**
 * Three small scales, then named text styles built from them.
 * Uses the platform system font (San Francisco / Roboto) for now; a custom
 * typeface can be added later by setting `fontFamily` in one place.
 */

/** Font sizes in points. Key = the size. */
export const fontSize = {
  12: 12,
  14: 14,
  16: 16,
  18: 18,
  22: 22,
  28: 28,
  36: 36,
} as const;

/** Line heights in points, paired 1:1 with the font sizes above. */
export const lineHeight = {
  12: 16,
  14: 20,
  16: 24,
  18: 24,
  22: 28,
  28: 34,
  36: 44,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const satisfies Record<string, NonNullable<TextStyle['fontWeight']>>;

export interface TypeStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: NonNullable<TextStyle['fontWeight']>;
  letterSpacing?: number;
  fontVariant?: TextStyle['fontVariant'];
  /**
   * Caps how far the user's system text-size setting can scale this style.
   * Big display text caps low (it is already large); body copy scales a lot.
   */
  maxFontSizeMultiplier: number;
}

const tabular: TextStyle['fontVariant'] = ['tabular-nums'];

/** Named text styles. Components pick one of these, never raw sizes. */
export const typography = {
  display: { fontSize: fontSize[36], lineHeight: lineHeight[36], fontWeight: fontWeight.bold, letterSpacing: -0.5, maxFontSizeMultiplier: 1.2 },
  heading1: { fontSize: fontSize[28], lineHeight: lineHeight[28], fontWeight: fontWeight.bold, letterSpacing: -0.3, maxFontSizeMultiplier: 1.3 },
  heading2: { fontSize: fontSize[22], lineHeight: lineHeight[22], fontWeight: fontWeight.semibold, maxFontSizeMultiplier: 1.4 },
  heading3: { fontSize: fontSize[18], lineHeight: lineHeight[18], fontWeight: fontWeight.semibold, maxFontSizeMultiplier: 1.5 },
  body: { fontSize: fontSize[16], lineHeight: lineHeight[16], fontWeight: fontWeight.regular, maxFontSizeMultiplier: 1.8 },
  bodyStrong: { fontSize: fontSize[16], lineHeight: lineHeight[16], fontWeight: fontWeight.semibold, maxFontSizeMultiplier: 1.8 },
  bodySmall: { fontSize: fontSize[14], lineHeight: lineHeight[14], fontWeight: fontWeight.regular, maxFontSizeMultiplier: 1.8 },
  label: { fontSize: fontSize[14], lineHeight: lineHeight[14], fontWeight: fontWeight.semibold, maxFontSizeMultiplier: 1.8 },
  caption: { fontSize: fontSize[12], lineHeight: lineHeight[12], fontWeight: fontWeight.medium, letterSpacing: 0.2, maxFontSizeMultiplier: 1.6 },
  /** Money: tabular numerals keep digits aligned in columns. */
  moneyLarge: { fontSize: fontSize[36], lineHeight: lineHeight[36], fontWeight: fontWeight.bold, letterSpacing: -0.5, fontVariant: tabular, maxFontSizeMultiplier: 1.2 },
  money: { fontSize: fontSize[16], lineHeight: lineHeight[16], fontWeight: fontWeight.semibold, fontVariant: tabular, maxFontSizeMultiplier: 1.8 },
} as const satisfies Record<string, TypeStyle>;

export type TypeVariant = keyof typeof typography;
