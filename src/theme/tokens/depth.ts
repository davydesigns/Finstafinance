import type { ViewStyle } from 'react-native';

import { elevation } from './elevation';

export type DepthStyle = Pick<ViewStyle, 'boxShadow'>;

/**
 * DEPTH tokens: how a surface relates to the page it sits on, named by ROLE.
 * Components say "I am a control" or "I am a field"; the style (Clean or Soft)
 * decides what that looks like. Same idea as colour: the role is the contract.
 *
 * Depth is never the only signal. Clean uses little of it; Soft uses a lot, so
 * Soft components also keep a real edge or a solid fill wherever an edge or fill
 * carries meaning (see docs/soft/01-accessible-neumorphism.md).
 */
export interface Depth {
  /** A container resting on the page: cards, rows, panels. */
  surface: DepthStyle;
  /** A container that floats above others: elevated cards, menus, sheets. */
  floating: DepthStyle;
  /** A small control that can be pressed: secondary buttons, chips, unselected segments. */
  control: DepthStyle;
  /** A well the user types into, or a track that holds something: inputs. */
  field: DepthStyle;
  /**
   * What any pressable surface looks like while pressed or selected: pressed IN to the page.
   * `null` means depth does not change on press (Clean changes colour only).
   */
  pressed: DepthStyle | null;
}

/** One shadow ink: a colour and how strongly it shows. Kept as numbers so tests can measure it. */
export interface Ink {
  color: string;
  alpha: number;
}

/** Soft lights its objects from the top left: a pale highlight on that side, a darker shade opposite. */
export interface DepthInk {
  light: Ink;
  shade: Ink;
}

/** `#7C8EAB` + 0.5 becomes `rgba(124, 142, 171, 0.5)`. */
export function withAlpha({ color, alpha }: Ink): string {
  const n = parseInt(color.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

const none: DepthStyle = { boxShadow: [] };

/** Clean: flat by default. Only things that float get a shadow. */
export const cleanDepth: Depth = {
  surface: none,
  floating: elevation.medium,
  control: none,
  field: none,
  pressed: null,
};

/** Pushed OUT of the page: highlight up-left, shade down-right. */
function raised(distance: number, blur: number, ink: DepthInk): DepthStyle {
  return { boxShadow: `${-distance}px ${-distance}px ${blur}px ${withAlpha(ink.light)}, ${distance}px ${distance}px ${blur}px ${withAlpha(ink.shade)}` };
}

/** Pressed INTO the page: the same two shadows, turned inside out. */
function pressedIn(distance: number, blur: number, ink: DepthInk): DepthStyle {
  return { boxShadow: `inset ${distance}px ${distance}px ${blur}px ${withAlpha(ink.shade)}, inset ${-distance}px ${-distance}px ${blur}px ${withAlpha(ink.light)}` };
}

/** Soft: surfaces are pushed out of, or pressed into, the page. */
export function softDepth(ink: DepthInk): Depth {
  return {
    surface: raised(6, 14, ink),
    floating: raised(10, 24, ink),
    control: raised(4, 8, ink),
    field: pressedIn(3, 7, ink),
    pressed: pressedIn(3, 6, ink),
  };
}

/**
 * The depth to draw. While `pressed`, a Soft control pushes IN. On a `solid` fill (a saturated button)
 * pressed-in shadows only muddy the colour, so it goes flat instead: pushed down to the page.
 * Clean has no pressed depth, so it always keeps `resting`.
 */
export function depthWhen(pressed: boolean, resting: DepthStyle, depth: Depth, fill: 'tint' | 'solid' = 'tint'): DepthStyle {
  if (!pressed || !depth.pressed) return resting;
  return fill === 'solid' ? none : depth.pressed;
}
