import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { useTheme, type SemanticColors, type TypeVariant } from '@/theme';

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'disabled'
  | 'inverse'
  | 'onPrimary'
  | 'link'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

/** Map a role name to the actual colour for the current theme. */
function resolveColor(colors: SemanticColors, color: TextColor): string {
  switch (color) {
    case 'primary':
      return colors.text.primary;
    case 'secondary':
      return colors.text.secondary;
    case 'disabled':
      return colors.text.disabled;
    case 'inverse':
      return colors.text.inverse;
    case 'onPrimary':
      return colors.action.onPrimary;
    case 'link':
      return colors.text.link;
    default:
      return colors.status[color].text;
  }
}

export interface TextProps extends RNTextProps {
  /** Which style from the type scale to use. */
  variant?: TypeVariant;
  /** A colour ROLE, never a hex value. */
  color?: TextColor;
}

/**
 * The only way text should be rendered in this design system.
 * It applies the type scale, a themed colour, and a cap on how far the
 * user's system text-size setting can scale it (so layouts don't break).
 */
export function Text({ variant = 'body', color = 'primary', style, maxFontSizeMultiplier, ...rest }: TextProps) {
  const { colors, typography } = useTheme();
  // `maxFontSizeMultiplier` is a Text prop, not a style, so we pull it out.
  const { maxFontSizeMultiplier: defaultCap, ...typeStyle } = typography[variant];

  return (
    <RNText
      maxFontSizeMultiplier={maxFontSizeMultiplier ?? defaultCap}
      style={[typeStyle, { color: resolveColor(colors, color) }, style]}
      {...rest}
    />
  );
}
