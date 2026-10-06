import type { ViewStyle } from 'react-native';

/**
 * Elevation. iOS draws shadows from the `shadow*` props; Android uses the
 * single `elevation` number. Each level sets both so it looks right everywhere.
 * In dark mode, shadows are barely visible, so surfaces get lighter instead
 * (see `surfaceRaised` in themes.ts).
 */
type Elevation = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

export const elevation = {
  none: { shadowColor: '#000000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
  low: { shadowColor: '#0C1D3B', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 1 },
  medium: { shadowColor: '#0C1D3B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 4 },
  high: { shadowColor: '#0C1D3B', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.18, shadowRadius: 24, elevation: 10 },
} as const satisfies Record<string, Elevation>;

export type ElevationToken = keyof typeof elevation;
