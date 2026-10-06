/**
 * Spacing on a 4pt grid. The key is the multiplier: `space[4]` = 4 * 4 = 16.
 * Values are density-independent points, not pixels.
 */
export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export type SpaceToken = keyof typeof space;
