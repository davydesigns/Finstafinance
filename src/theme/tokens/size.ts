/** Fixed sizes for non-interactive building blocks, in points. */
export const size = {
  /** Diameter of the icon-in-a-circle that leads rows and cards. */
  avatar: 36,
  /** Narrowest an action button should get before a row of them wraps. */
  minActionWidth: 96,
  /** Narrowest a text column should get before its neighbour wraps below it. */
  minContentWidth: 128,
  /** Narrowest a card should get before a row of cards wraps to a new line. */
  minCardWidth: 280,
  /** Widest a column of reading content gets (forms, lists): longer lines are hard to read. */
  maxReadableWidth: 640,
  /** Widest a multi-column layout gets, so it never stretches across a huge monitor. */
  maxWideWidth: 1040,
} as const;

/**
 * Window widths (points) where layouts change.
 * compact: phones. medium: large phones, tablets, small windows. expanded: desktop.
 */
export const breakpoint = {
  medium: 600,
  expanded: 960,
} as const;

export type Breakpoint = 'compact' | 'medium' | 'expanded';

export function breakpointFor(width: number): Breakpoint {
  if (width >= breakpoint.expanded) return 'expanded';
  if (width >= breakpoint.medium) return 'medium';
  return 'compact';
}

/** Logo heights in points. Width follows from the artwork's proportions. */
export const logoHeight = {
  small: 24,
  medium: 40,
  large: 64,
} as const;

export type LogoSize = keyof typeof logoHeight;

/** Icon glyph sizes. */
export const iconSize = {
  small: 16,
  medium: 20,
  large: 24,
} as const;

export type IconSize = keyof typeof iconSize;
