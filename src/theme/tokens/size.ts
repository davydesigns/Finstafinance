/** Fixed sizes for non-interactive building blocks, in points. */
export const size = {
  /** Diameter of the icon-in-a-circle that leads rows and cards. */
  avatar: 36,
  /** Narrowest an action button should get before a row of them wraps. */
  minActionWidth: 96,
  /** Narrowest a text column should get before its neighbour wraps below it. */
  minContentWidth: 128,
} as const;

/** Icon glyph sizes. */
export const iconSize = {
  small: 16,
  medium: 20,
  large: 24,
} as const;

export type IconSize = keyof typeof iconSize;
