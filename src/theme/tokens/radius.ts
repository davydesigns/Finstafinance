export const radius = {
  none: 0,
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  /** Large enough to make any box a pill or circle. */
  full: 9999,
} as const;

export type RadiusToken = keyof typeof radius;
