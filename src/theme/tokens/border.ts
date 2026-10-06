/** Border widths in points. */
export const borderWidth = {
  none: 0,
  thin: 1,
  medium: 2,
} as const;

export type BorderWidthToken = keyof typeof borderWidth;
