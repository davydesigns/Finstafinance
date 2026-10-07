import { Platform, Text as RNText, type StyleProp, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { useTheme, type MoneyVariant, type SemanticColors, type TextVariant, type TypeStyle, type TypeVariant } from '@/theme';

import type { TextLayoutStyle } from './layoutStyle';

/** Text colour ROLES. Status meaning is a separate prop, `tone`. */
export type TextColor = 'primary' | 'secondary' | 'disabled' | 'inverse' | 'link';
export type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'ai';

export interface ColorChoice {
  color?: TextColor;
  /** Status tone. Wins over `color`. Must always be paired with a word or icon. */
  tone?: Tone;
}

const ROLE: Record<TextColor, (c: SemanticColors) => string> = {
  primary: (c) => c.text.primary,
  secondary: (c) => c.text.secondary,
  disabled: (c) => c.text.disabled,
  inverse: (c) => c.text.inverse,
  link: (c) => c.text.link,
};

export function resolveTextColor(colors: SemanticColors, { color = 'primary', tone }: ColorChoice): string {
  if (tone === 'ai') return colors.ai.accent;
  return tone ? colors.status[tone].text : ROLE[color](colors);
}

/**
 * INTERNAL building block (not exported from the package index). Applies a
 * type style and an already-resolved colour. `Text` and `MoneyText` are the
 * public faces; `Button` uses it for colours that are not text roles.
 */
/** The platform's monospaced face, for code and identifiers. */
const MONO = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'ui-monospace, Menlo, Consolas, monospace' });

export interface TextBaseProps extends Omit<RNTextProps, 'style'> {
  variant: TypeVariant;
  colorValue: string;
  style?: StyleProp<TextStyle>;
}

export function TextBase({ variant, colorValue, style, maxFontSizeMultiplier, ...rest }: TextBaseProps) {
  const { typography } = useTheme();
  // `maxFontSizeMultiplier` is a Text prop, not a style, so we pull it out.
  const { maxFontSizeMultiplier: defaultCap, family, ...typeStyle } = typography[variant] as TypeStyle;

  return (
    <RNText
      maxFontSizeMultiplier={maxFontSizeMultiplier ?? defaultCap}
      style={[typeStyle, family === 'mono' ? { fontFamily: MONO } : null, { color: colorValue }, style]}
      {...rest}
    />
  );
}

export interface TextProps extends Omit<RNTextProps, 'style'>, ColorChoice {
  /** Which style from the type scale to use. */
  variant?: TextVariant;
  /** Layout only (margin, flex, alignment). Colour and type come from tokens. */
  style?: StyleProp<TextLayoutStyle>;
}

const HEADINGS: TextVariant[] = ['heading1', 'heading2', 'heading3'];

/**
 * The only way text should be rendered in this design system.
 * Applies the type scale, a themed colour and a cap on how far the user's
 * system text-size setting can scale it (so layouts don't break).
 */
export function Text({ variant = 'body', color, tone, ...rest }: TextProps) {
  const { colors } = useTheme();
  return (
    <TextBase
      variant={variant}
      colorValue={resolveTextColor(colors, { color, tone })}
      // Headings are announced as headings so screen-reader users can jump between them.
      accessibilityRole={HEADINGS.includes(variant) ? 'header' : undefined}
      {...rest}
    />
  );
}

export type { TextVariant, MoneyVariant };
