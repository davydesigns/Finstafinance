/**
 * Minimum interactive size in points.
 * 48 satisfies both Apple (44pt) and Material (48dp) touch-target guidance.
 */
export const touchTarget = 48;

/** Visual height of interactive controls. Small controls get extra tap area (hitSlop) to reach `touchTarget`. */
export const controlHeight = {
  small: 36,
  medium: 48,
  large: 56,
} as const;

export type ControlSize = keyof typeof controlHeight;

/** Icon glyph sizes in points. */
export const iconSize = {
  small: 16,
  medium: 20,
  large: 24,
} as const;

export type IconSize = keyof typeof iconSize;
