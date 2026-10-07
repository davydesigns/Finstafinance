import { Platform, type TextStyle } from 'react-native';

/**
 * Shared behaviour for figures (money amounts and ranges): a number must never wrap, because
 * a split number can be misread. On iOS/Android it shrinks to fit; on web, which can't shrink
 * text, it stays on one line instead of being cut with an ellipsis.
 */
export const FIGURE_PROPS =
  Platform.OS === 'web'
    ? ({} as const)
    : ({ numberOfLines: 1, adjustsFontSizeToFit: true, minimumFontScale: 0.6 } as const);

// `whiteSpace` is a web-only style, so React Native's types don't list it.
export const WEB_NO_WRAP = (Platform.OS === 'web' ? { whiteSpace: 'nowrap' } : undefined) as TextStyle | undefined;
