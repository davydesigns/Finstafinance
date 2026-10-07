import { TextBase, resolveTextColor, type TextColor } from '@/components/core/Text';
import { useTheme, type TextVariant } from '@/theme';

import { useReveal } from './useReveal';

export interface StreamingTextProps {
  /** The COMPLETE text. It is revealed gradually when `animate` is true. */
  text: string;
  animate?: boolean;
  variant?: TextVariant;
  color?: TextColor;
  /** Used when the colour is not a text role (e.g. text on a filled bubble). */
  colorValue?: string;
  onComplete?: () => void;
}

/**
 * Text that appears progressively. Sighted users see it type out; screen-reader users get the
 * complete text immediately as one label, so they never hear it character by character.
 */
export function StreamingText({ text, animate = false, variant = 'body', color, colorValue, onComplete }: StreamingTextProps) {
  const { colors } = useTheme();
  const shown = useReveal(text, animate, onComplete);
  return (
    <TextBase variant={variant} colorValue={colorValue ?? resolveTextColor(colors, { color })} accessibilityLabel={text}>
      {shown}
    </TextBase>
  );
}
