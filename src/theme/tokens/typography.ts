import type { TextStyle } from 'react-native';

/**
 * Type scale. Uses the platform system font (San Francisco / Roboto) for now.
 * Custom fonts can be added later by changing `fontFamily` in one place.
 *
 * `maxFontSizeMultiplier` limits how far the user's system text-size setting
 * can scale each style. Large display text caps lower because it is already
 * big; body copy scales a lot because it matters most for readability.
 */
export interface TypeStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: NonNullable<TextStyle['fontWeight']>;
  letterSpacing?: number;
  fontVariant?: TextStyle['fontVariant'];
  maxFontSizeMultiplier: number;
}

const tabular: TextStyle['fontVariant'] = ['tabular-nums'];

export const typography = {
  display: { fontSize: 36, lineHeight: 44, fontWeight: '700', letterSpacing: -0.5, maxFontSizeMultiplier: 1.2 },
  title1: { fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.3, maxFontSizeMultiplier: 1.3 },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: '600', maxFontSizeMultiplier: 1.4 },
  title3: { fontSize: 18, lineHeight: 24, fontWeight: '600', maxFontSizeMultiplier: 1.5 },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400', maxFontSizeMultiplier: 1.8 },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: '600', maxFontSizeMultiplier: 1.8 },
  callout: { fontSize: 14, lineHeight: 20, fontWeight: '400', maxFontSizeMultiplier: 1.8 },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500', letterSpacing: 0.2, maxFontSizeMultiplier: 1.6 },
  /** Money: tabular numerals keep digits aligned in columns. */
  moneyLarge: { fontSize: 36, lineHeight: 44, fontWeight: '700', letterSpacing: -0.5, fontVariant: tabular, maxFontSizeMultiplier: 1.2 },
  money: { fontSize: 16, lineHeight: 24, fontWeight: '600', fontVariant: tabular, maxFontSizeMultiplier: 1.8 },
} as const satisfies Record<string, TypeStyle>;

export type TypeVariant = keyof typeof typography;
