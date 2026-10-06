import { palette as p } from './tokens/color';
import { elevation } from './tokens/elevation';
import { borderWidth } from './tokens/border';
import { controlHeight, iconSize, touchTarget } from './tokens/layout';
import { radius } from './tokens/radius';
import { space } from './tokens/spacing';
import { fontSize, fontWeight, lineHeight, typography } from './tokens/typography';

interface StatusColors {
  /** Text / icon colour. Readable on both `background` and the page surface. */
  text: string;
  /** Soft tint for badges and banners. */
  background: string;
}

/**
 * SEMANTIC colour tokens: named by ROLE, not by hue. Components use only
 * these. Light and dark map the same names to different palette values.
 * Read them as paths: `colors.text.primary`, `colors.action.primary`.
 */
export interface SemanticColors {
  background: {
    /** The page behind everything. */
    primary: string;
    /** A quieter band or grouped region on the page. */
    secondary: string;
  };
  surface: {
    /** Cards, sheets, inputs. */
    primary: string;
    /** Content that floats above `primary` (raised cards, menus). */
    elevated: string;
  };
  text: {
    primary: string;
    secondary: string;
    /** Text on a dark-on-light-inverted fill, e.g. over `action.primary` in light mode. */
    inverse: string;
    link: string;
    disabled: string;
  };
  border: {
    default: string;
    /** Input outlines and boundaries that must be clearly visible (3:1). */
    strong: string;
    focus: string;
  };
  action: {
    primary: string;
    primaryPressed: string;
    /** Label or icon on top of `primary`. */
    onPrimary: string;
    /** Light tint: pressed state for secondary/tertiary actions, selected rows. */
    subtle: string;
    onSubtle: string;
    /** Disabled controls are exempt from WCAG contrast rules but stay legible. */
    /** Solid fill for irreversible or risky actions (cancel transfer, delete). */
    destructive: string;
    destructivePressed: string;
    onDestructive: string;
    disabled: string;
  };
  status: {
    success: StatusColors;
    warning: StatusColors;
    danger: StatusColors;
    info: StatusColors;
    /** No judgement: inactive, closed, unknown. */
    neutral: StatusColors;
  };
  overlay: string;
}

const light: SemanticColors = {
  background: { primary: p.neutral50, secondary: p.neutral100 },
  surface: { primary: p.white, elevated: p.white },
  text: {
    primary: p.neutral900,
    secondary: p.neutral600,
    inverse: p.white,
    link: p.blue600,
    disabled: p.neutral400,
  },
  border: { default: p.neutral200, strong: p.neutral500, focus: p.blue600 },
  action: {
    primary: p.blue600,
    primaryPressed: p.blue700,
    onPrimary: p.white,
    subtle: p.blue50,
    onSubtle: p.blue800,
    destructive: p.red700,
    destructivePressed: p.red900,
    onDestructive: p.white,
    disabled: p.neutral100,
  },
  status: {
    success: { text: p.green700, background: p.green50 },
    warning: { text: p.amber800, background: p.amber50 },
    danger: { text: p.red700, background: p.red50 },
    info: { text: p.blue700, background: p.blue50 },
    neutral: { text: p.neutral700, background: p.neutral100 },
  },
  overlay: 'rgba(14, 18, 26, 0.5)',
};

const dark: SemanticColors = {
  background: { primary: p.neutral950, secondary: p.neutral900 },
  // In dark mode "higher" means lighter, because shadows are hard to see.
  surface: { primary: p.neutral900, elevated: p.neutral800 },
  text: {
    primary: p.neutral50,
    secondary: p.neutral300,
    inverse: p.neutral950,
    link: p.blue300,
    disabled: p.neutral500,
  },
  border: { default: p.neutral700, strong: p.neutral400, focus: p.blue300 },
  action: {
    primary: p.blue400,
    primaryPressed: p.blue300,
    onPrimary: p.blue950,
    subtle: p.blue900,
    onSubtle: p.blue100,
    destructive: p.red300,
    destructivePressed: p.red400,
    onDestructive: p.neutral950,
    disabled: p.neutral800,
  },
  status: {
    success: { text: p.green300, background: p.green950 },
    warning: { text: p.amber300, background: p.amber950 },
    danger: { text: p.red300, background: p.red900 },
    info: { text: p.blue200, background: p.blue900 },
    neutral: { text: p.neutral200, background: p.neutral800 },
  },
  overlay: 'rgba(0, 0, 0, 0.65)',
};

export type ThemeName = 'light' | 'dark';

export interface Theme {
  name: ThemeName;
  colors: SemanticColors;
  space: typeof space;
  radius: typeof radius;
  fontSize: typeof fontSize;
  lineHeight: typeof lineHeight;
  fontWeight: typeof fontWeight;
  typography: typeof typography;
  borderWidth: typeof borderWidth;
  elevation: typeof elevation;
  touchTarget: number;
  controlHeight: typeof controlHeight;
  iconSize: typeof iconSize;
}

const shared = { space, radius, fontSize, lineHeight, fontWeight, typography, borderWidth, elevation, touchTarget, controlHeight, iconSize };

export const lightTheme: Theme = { name: 'light', colors: light, ...shared };
export const darkTheme: Theme = { name: 'dark', colors: dark, ...shared };

/**
 * Contrast contract. Each row is a foreground/background pair that real UI
 * will use, and the WCAG ratio it must meet: 4.5 for text, 3 for UI
 * boundaries and focus indicators. The foundations screen displays these,
 * and `npm run check:contrast` fails if any pair regresses.
 */
export interface ContrastPair {
  label: string;
  fg: (c: SemanticColors) => string;
  bg: (c: SemanticColors) => string;
  min: 3 | 4.5;
}

export const contrastPairs: ContrastPair[] = [
  { label: 'Primary text on background', fg: (c) => c.text.primary, bg: (c) => c.background.primary, min: 4.5 },
  { label: 'Primary text on background (secondary)', fg: (c) => c.text.primary, bg: (c) => c.background.secondary, min: 4.5 },
  { label: 'Primary text on surface', fg: (c) => c.text.primary, bg: (c) => c.surface.primary, min: 4.5 },
  { label: 'Primary text on elevated surface', fg: (c) => c.text.primary, bg: (c) => c.surface.elevated, min: 4.5 },
  { label: 'Secondary text on background', fg: (c) => c.text.secondary, bg: (c) => c.background.primary, min: 4.5 },
  { label: 'Secondary text on surface', fg: (c) => c.text.secondary, bg: (c) => c.surface.primary, min: 4.5 },
  { label: 'Secondary text on elevated surface', fg: (c) => c.text.secondary, bg: (c) => c.surface.elevated, min: 4.5 },
  { label: 'Link on surface', fg: (c) => c.text.link, bg: (c) => c.surface.primary, min: 4.5 },
  { label: 'Link on background', fg: (c) => c.text.link, bg: (c) => c.background.primary, min: 4.5 },
  { label: 'Action label on primary', fg: (c) => c.action.onPrimary, bg: (c) => c.action.primary, min: 4.5 },
  { label: 'Action label on primary (pressed)', fg: (c) => c.action.onPrimary, bg: (c) => c.action.primaryPressed, min: 4.5 },
  { label: 'Inverse text on primary action', fg: (c) => c.text.inverse, bg: (c) => c.action.primary, min: 4.5 },
  { label: 'Label on destructive action', fg: (c) => c.action.onDestructive, bg: (c) => c.action.destructive, min: 4.5 },
  { label: 'Label on destructive action (pressed)', fg: (c) => c.action.onDestructive, bg: (c) => c.action.destructivePressed, min: 4.5 },
  { label: 'Text on subtle action tint', fg: (c) => c.action.onSubtle, bg: (c) => c.action.subtle, min: 4.5 },
  { label: 'Action as text on surface', fg: (c) => c.action.primary, bg: (c) => c.surface.primary, min: 4.5 },
  { label: 'Success on its tint', fg: (c) => c.status.success.text, bg: (c) => c.status.success.background, min: 4.5 },
  { label: 'Success on surface', fg: (c) => c.status.success.text, bg: (c) => c.surface.primary, min: 4.5 },
  { label: 'Warning on its tint', fg: (c) => c.status.warning.text, bg: (c) => c.status.warning.background, min: 4.5 },
  { label: 'Warning on surface', fg: (c) => c.status.warning.text, bg: (c) => c.surface.primary, min: 4.5 },
  { label: 'Danger on its tint', fg: (c) => c.status.danger.text, bg: (c) => c.status.danger.background, min: 4.5 },
  { label: 'Danger on surface', fg: (c) => c.status.danger.text, bg: (c) => c.surface.primary, min: 4.5 },
  { label: 'Info on its tint', fg: (c) => c.status.info.text, bg: (c) => c.status.info.background, min: 4.5 },
  { label: 'Info on surface', fg: (c) => c.status.info.text, bg: (c) => c.surface.primary, min: 4.5 },
  { label: 'Neutral on its tint', fg: (c) => c.status.neutral.text, bg: (c) => c.status.neutral.background, min: 4.5 },
  { label: 'Neutral on surface', fg: (c) => c.status.neutral.text, bg: (c) => c.surface.primary, min: 4.5 },
  { label: 'Input border on surface', fg: (c) => c.border.strong, bg: (c) => c.surface.primary, min: 3 },
  { label: 'Focus ring on surface', fg: (c) => c.border.focus, bg: (c) => c.surface.primary, min: 3 },
  { label: 'Focus ring on background', fg: (c) => c.border.focus, bg: (c) => c.background.primary, min: 3 },
];
