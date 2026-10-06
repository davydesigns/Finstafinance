import { palette as p } from './tokens/color';
import { elevation } from './tokens/elevation';
import { borderWidth } from './tokens/border';
import { controlHeight, touchTarget } from './tokens/interaction';
import { radius } from './tokens/radius';
import { iconSize, size } from './tokens/size';
import { space } from './tokens/spacing';
import { typography } from './tokens/typography';

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
    /** A row or card while it is being pressed. */
    pressed: string;
    /** Soft accent fill behind icons and highlights. */
    accent: string;
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
    /** Light tint behind secondary/tertiary actions while pressed. */
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
}

const light: SemanticColors = {
  background: { primary: p.neutral50, secondary: p.neutral100 },
  surface: { primary: p.white, elevated: p.white, pressed: p.blue50, accent: p.blue50 },
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
};

const dark: SemanticColors = {
  background: { primary: p.neutral950, secondary: p.neutral900 },
  // In dark mode "higher" means lighter, because shadows are hard to see.
  surface: { primary: p.neutral900, elevated: p.neutral800, pressed: p.blue900, accent: p.blue900 },
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
};

export type ThemeName = 'light' | 'dark';

export interface Theme {
  name: ThemeName;
  colors: SemanticColors;
  space: typeof space;
  radius: typeof radius;
  typography: typeof typography;
  borderWidth: typeof borderWidth;
  elevation: typeof elevation;
  touchTarget: number;
  controlHeight: typeof controlHeight;
  size: typeof size;
  iconSize: typeof iconSize;
}

const shared = { space, radius, typography, borderWidth, elevation, touchTarget, controlHeight, size, iconSize };

export const lightTheme: Theme = { name: 'light', colors: light, ...shared };
export const darkTheme: Theme = { name: 'dark', colors: dark, ...shared };
