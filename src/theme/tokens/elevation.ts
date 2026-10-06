import type { ViewStyle } from 'react-native';

/**
 * Elevation, expressed with React Native's `boxShadow` (works on iOS and Android).
 * In dark mode shadows are barely visible, so surfaces get lighter instead
 * (see `surface.elevated` in themes.ts).
 */
type Elevation = Pick<ViewStyle, 'boxShadow'>;

export const elevation = {
  none: { boxShadow: [] },
  low: { boxShadow: '0 1px 3px rgba(12, 29, 59, 0.08)' },
  medium: { boxShadow: '0 4px 10px rgba(12, 29, 59, 0.12)' },
  high: { boxShadow: '0 12px 24px rgba(12, 29, 59, 0.18)' },
} as const satisfies Record<string, Elevation>;

export type ElevationToken = keyof typeof elevation;
