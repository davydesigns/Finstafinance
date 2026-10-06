import { palette as p } from './tokens/color';
import { elevation } from './tokens/elevation';
import { focusRingWidth, touchTarget } from './tokens/layout';
import { radius } from './tokens/radius';
import { space } from './tokens/spacing';
import { typography } from './tokens/typography';

interface StatusColors {
  /** Text / icon colour. Readable on both `bg` and the page surface. */
  fg: string;
  /** Soft background tint for badges and banners. */
  bg: string;
}

/**
 * SEMANTIC colour tokens: named by ROLE, not by hue. Components use these
 * only. Light and dark map the same names to different palette values.
 */
export interface SemanticColors {
  background: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  /** For input outlines and other boundaries that must be clearly visible (3:1). */
  borderStrong: string;

  textPrimary: string;
  textSecondary: string;

  primary: string;
  primaryPressed: string;
  onPrimary: string;
  primarySubtle: string;
  onPrimarySubtle: string;

  status: {
    success: StatusColors;
    warning: StatusColors;
    danger: StatusColors;
    info: StatusColors;
  };

  focusRing: string;
  /** Disabled controls are exempt from WCAG contrast rules, but stay legible. */
  disabledBg: string;
  disabledText: string;
  overlay: string;
}

const light: SemanticColors = {
  background: p.neutral50,
  surface: p.white,
  surfaceRaised: p.white,
  border: p.neutral200,
  borderStrong: p.neutral500,

  textPrimary: p.neutral900,
  textSecondary: p.neutral600,

  primary: p.blue600,
  primaryPressed: p.blue700,
  onPrimary: p.white,
  primarySubtle: p.blue50,
  onPrimarySubtle: p.blue800,

  status: {
    success: { fg: p.green700, bg: p.green50 },
    warning: { fg: p.amber800, bg: p.amber50 },
    danger: { fg: p.red700, bg: p.red50 },
    info: { fg: p.blue700, bg: p.blue50 },
  },

  focusRing: p.blue600,
  disabledBg: p.neutral100,
  disabledText: p.neutral400,
  overlay: 'rgba(14, 18, 26, 0.5)',
};

const dark: SemanticColors = {
  background: p.neutral950,
  surface: p.neutral900,
  surfaceRaised: p.neutral800,
  border: p.neutral700,
  borderStrong: p.neutral400,

  textPrimary: p.neutral50,
  textSecondary: p.neutral300,

  primary: p.blue400,
  primaryPressed: p.blue300,
  onPrimary: p.blue950,
  primarySubtle: p.blue900,
  onPrimarySubtle: p.blue100,

  status: {
    success: { fg: p.green300, bg: p.green950 },
    warning: { fg: p.amber300, bg: p.amber950 },
    danger: { fg: p.red300, bg: p.red900 },
    info: { fg: p.blue200, bg: p.blue900 },
  },

  focusRing: p.blue300,
  disabledBg: p.neutral800,
  disabledText: p.neutral500,
  overlay: 'rgba(0, 0, 0, 0.65)',
};

export type ThemeName = 'light' | 'dark';

export interface Theme {
  name: ThemeName;
  colors: SemanticColors;
  space: typeof space;
  radius: typeof radius;
  typography: typeof typography;
  elevation: typeof elevation;
  touchTarget: number;
  focusRingWidth: number;
}

const shared = { space, radius, typography, elevation, touchTarget, focusRingWidth };

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
  { label: 'Primary text on background', fg: (c) => c.textPrimary, bg: (c) => c.background, min: 4.5 },
  { label: 'Primary text on surface', fg: (c) => c.textPrimary, bg: (c) => c.surface, min: 4.5 },
  { label: 'Primary text on raised surface', fg: (c) => c.textPrimary, bg: (c) => c.surfaceRaised, min: 4.5 },
  { label: 'Secondary text on background', fg: (c) => c.textSecondary, bg: (c) => c.background, min: 4.5 },
  { label: 'Secondary text on surface', fg: (c) => c.textSecondary, bg: (c) => c.surface, min: 4.5 },
  { label: 'Secondary text on raised surface', fg: (c) => c.textSecondary, bg: (c) => c.surfaceRaised, min: 4.5 },
  { label: 'Button label on primary', fg: (c) => c.onPrimary, bg: (c) => c.primary, min: 4.5 },
  { label: 'Button label on primary (pressed)', fg: (c) => c.onPrimary, bg: (c) => c.primaryPressed, min: 4.5 },
  { label: 'Text on primary tint', fg: (c) => c.onPrimarySubtle, bg: (c) => c.primarySubtle, min: 4.5 },
  { label: 'Primary as text on surface', fg: (c) => c.primary, bg: (c) => c.surface, min: 4.5 },
  { label: 'Success on its tint', fg: (c) => c.status.success.fg, bg: (c) => c.status.success.bg, min: 4.5 },
  { label: 'Success on surface', fg: (c) => c.status.success.fg, bg: (c) => c.surface, min: 4.5 },
  { label: 'Warning on its tint', fg: (c) => c.status.warning.fg, bg: (c) => c.status.warning.bg, min: 4.5 },
  { label: 'Warning on surface', fg: (c) => c.status.warning.fg, bg: (c) => c.surface, min: 4.5 },
  { label: 'Danger on its tint', fg: (c) => c.status.danger.fg, bg: (c) => c.status.danger.bg, min: 4.5 },
  { label: 'Danger on surface', fg: (c) => c.status.danger.fg, bg: (c) => c.surface, min: 4.5 },
  { label: 'Info on its tint', fg: (c) => c.status.info.fg, bg: (c) => c.status.info.bg, min: 4.5 },
  { label: 'Info on surface', fg: (c) => c.status.info.fg, bg: (c) => c.surface, min: 4.5 },
  { label: 'Input border on surface', fg: (c) => c.borderStrong, bg: (c) => c.surface, min: 3 },
  { label: 'Focus ring on surface', fg: (c) => c.focusRing, bg: (c) => c.surface, min: 3 },
];
