/**
 * Depth legibility floors for the Soft style.
 *
 * These are NOT WCAG requirements. WCAG has nothing to say about decorative shadows, and that is
 * exactly the trap: a designer can tune a shadow until it is "elegant" and invisible. The floors
 * below are the design team's own minimums, chosen after measuring what reads as depth on a
 * normal screen, so a later tweak cannot quietly flatten the style.
 *
 * Meaning never depends on them. Edges, fills and labels carry the meaning (see
 * `softEdges.test.tsx`); depth is the feel.
 */
export const DEPTH_FLOOR = {
  /** The dark shadow, as seen over the surface. */
  shade: 1.3,
  /** The light highlight, as seen over the surface. */
  light: 1.2,
} as const;
