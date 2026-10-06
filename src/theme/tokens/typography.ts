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
   * WCAG asks for text to reach 200%. Everything up to 22pt allows 2x. Only
   * 28pt+ text caps lower (it is already large text) so layouts survive.
   */
  maxFontSizeMultiplier: number;
}

const tabular: TextStyle['fontVariant'] = ['tabular-nums'];

/** Named text styles. Components pick one of these, never raw sizes. */
export const typography = {
  display: { fontSize: fontSize[36], lineHeight: lineHeight[36], fontWeight: fontWeight.bold, letterSpacing: -0.5, maxFontSizeMultiplier: 1.5 },
  heading1: { fontSize: fontSize[28], lineHeight: lineHeight[28], fontWeight: fontWeight.bold, letterSpacing: -0.3, maxFontSizeMultiplier: 1.75 },
  heading2: { fontSize: fontSize[22], lineHeight: lineHeight[22], fontWeight: fontWeight.semibold, maxFontSizeMultiplier: 2 },
  heading3: { fontSize: fontSize[18], lineHeight: lineHeight[18], fontWeight: fontWeight.semibold, maxFontSizeMultiplier: 2 },
  body: { fontSize: fontSize[16], lineHeight: lineHeight[16], fontWeight: fontWeight.regular, maxFontSizeMultiplier: 2 },
  bodyStrong: { fontSize: fontSize[16], lineHeight: lineHeight[16], fontWeight: fontWeight.semibold, maxFontSizeMultiplier: 2 },
  bodySmall: { fontSize: fontSize[14], lineHeight: lineHeight[14], fontWeight: fontWeight.regular, maxFontSizeMultiplier: 2 },
  label: { fontSize: fontSize[14], lineHeight: lineHeight[14], fontWeight: fontWeight.semibold, maxFontSizeMultiplier: 2 },
  caption: { fontSize: fontSize[12], lineHeight: lineHeight[12], fontWeight: fontWeight.medium, letterSpacing: 0.2, maxFontSizeMultiplier: 2 },
  /** Money: tabular numerals keep digits aligned in columns. */
  moneyLarge: { fontSize: fontSize[36], lineHeight: lineHeight[36], fontWeight: fontWeight.bold, letterSpacing: -0.5, fontVariant: tabular, maxFontSizeMultiplier: 1.5 },
  money: { fontSize: fontSize[16], lineHeight: lineHeight[16], fontWeight: fontWeight.semibold, fontVariant: tabular, maxFontSizeMultiplier: 2 },
} as const satisfies Record<string, TypeStyle>;

export type TypeVariant = keyof typeof typography;

/** Every variant name, typed once here so callers don't cast `Object.keys`. */
export const typographyVariants = Object.keys(typography) as TypeVariant[];
/** Variants for general text. Money styles belong to `MoneyText`, not `Text`. */
export type MoneyVariant = 'money' | 'moneyLarge';
export type TextVariant = Exclude<TypeVariant, MoneyVariant>;
