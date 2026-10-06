/**
 * Interaction sizing: how big things must be to be operable.
 * 48 satisfies both Apple (44pt) and Material (48dp) touch-target guidance.
 */
export const touchTarget = 48;

/** Visual height of interactive controls. `small` gets extra tap area (hitSlop) to still reach `touchTarget`. */
export const controlHeight = {
  small: 36,
  medium: touchTarget,
  large: 56,
} as const;

export type ControlSize = keyof typeof controlHeight;
