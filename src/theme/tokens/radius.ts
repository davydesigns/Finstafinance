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

/** Soft is rounder: soft shadows look wrong around tight corners. Same names, bigger values. */
export const softRadius: Record<RadiusToken, number> = {
  none: 0,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
};
