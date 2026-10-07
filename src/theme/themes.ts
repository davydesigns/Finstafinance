import { palette as p } from './tokens/color';
import { cleanDepth, softDepth, type Depth, type DepthInk } from './tokens/depth';
import { elevation } from './tokens/elevation';
import { borderWidth } from './tokens/border';
import { controlHeight, touchTarget } from './tokens/interaction';
import { radius, softRadius, type RadiusToken } from './tokens/radius';
import { motion } from './tokens/motion';
import { iconSize, logoHeight, size } from './tokens/size';
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
  /** Everything that originates from an AI system. One hue, so it is always recognisable. */
  ai: {
    /** AI label text and icons. */
    accent: string;
    /** Soft fill behind AI-generated content. */
    subtle: string;
    /** Text on `subtle`. */
    onSubtle: string;
    /** A visible edge for AI surfaces (non-text, 3:1 against the page). */
    border: string;
  };
  /** How sure an AI output is, in three categories. Always paired with a word and a shape. */
  confidence: {
    high: StatusColors;
    medium: StatusColors;
    low: StatusColors;
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
  ai: { accent: p.violet700, subtle: p.violet50, onSubtle: p.violet800, border: p.violet600 },
  confidence: {
    high: { text: p.green700, background: p.green50 },
    medium: { text: p.blue700, background: p.blue50 },
    low: { text: p.amber800, background: p.amber50 },
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
  ai: { accent: p.violet300, subtle: p.violet950, onSubtle: p.violet100, border: p.violet400 },
  confidence: {
    high: { text: p.green300, background: p.green950 },
    medium: { text: p.blue200, background: p.blue900 },
    low: { text: p.amber300, background: p.amber950 },
  },
  status: {
    success: { text: p.green300, background: p.green950 },
    warning: { text: p.amber300, background: p.amber950 },
    danger: { text: p.red300, background: p.red900 },
    info: { text: p.blue200, background: p.blue900 },
    neutral: { text: p.neutral200, background: p.neutral800 },
  },
};

/**
 * SOFT colours (2.0). Soft is a second STYLE, not a second brand: it keeps every role, hue and
 * contrast pair of Clean and changes only the material. Page and surfaces share one colour
 * (that is what makes a card look pushed out of the page), and the pressed surface is a notch
 * darker (pressed in). Status, action and AI colours are untouched, so meaning never changes.
 */
const softLight: SemanticColors = {
  ...light,
  background: { primary: p.mist100, secondary: p.mist200 },
  surface: { primary: p.mist100, elevated: p.mist100, pressed: p.mist200, accent: p.blue50 },
  border: { ...light.border, default: p.mist300 },
};

const softDark: SemanticColors = {
  ...dark,
  background: { primary: p.neutral800, secondary: p.neutral900 },
  surface: { primary: p.neutral800, elevated: p.neutral800, pressed: p.neutral900, accent: p.blue900 },
  // The neutral badge would otherwise match the page exactly.
  status: { ...dark.status, neutral: { text: p.neutral200, background: p.neutral900 } },
};

/**
 * The two inks of Soft's shadows. Light mode: a near-white highlight and a blue-grey shade.
 * Dark mode: a faint white highlight and a black shade (the highlight can only be subtle there).
 * Alphas are tuned so each ink clears the legibility floor in `src/dev/depthLegibility.test.ts`.
 */
const softLightInk: DepthInk = {
  light: { color: p.white, alpha: 0.9 },
  shade: { color: p.mistShade, alpha: 0.5 },
};
const softDarkInk: DepthInk = {
  light: { color: p.white, alpha: 0.08 },
  shade: { color: p.black, alpha: 0.55 },
};

/** `light` / `dark`: the colour scheme. */
export type ThemeName = 'light' | 'dark';
/** `clean` / `soft`: the visual style. Independent of the scheme, so there are four themes. */
export type StyleName = 'clean' | 'soft';

export interface Theme {
  name: ThemeName;
  style: StyleName;
  colors: SemanticColors;
  space: typeof space;
  radius: Record<RadiusToken, number>;
  typography: typeof typography;
  borderWidth: typeof borderWidth;
  elevation: typeof elevation;
  /** How surfaces sit on the page, by role. Components read this instead of branching on `style`. */
  depth: Depth;
  /** The shadow inks behind `depth`, kept as numbers so they can be measured. `null` in Clean. */
  depthInk: DepthInk | null;
  touchTarget: number;
  controlHeight: typeof controlHeight;
  size: typeof size;
  iconSize: typeof iconSize;
  logoHeight: typeof logoHeight;
  motion: typeof motion;
}

const shared = { space, typography, borderWidth, elevation, touchTarget, controlHeight, size, iconSize, logoHeight, motion };

export const lightTheme: Theme = { name: 'light', style: 'clean', colors: light, radius, depth: cleanDepth, depthInk: null, ...shared };
export const darkTheme: Theme = { name: 'dark', style: 'clean', colors: dark, radius, depth: cleanDepth, depthInk: null, ...shared };
export const softLightTheme: Theme = { name: 'light', style: 'soft', colors: softLight, radius: softRadius, depth: softDepth(softLightInk), depthInk: softLightInk, ...shared };
export const softDarkTheme: Theme = { name: 'dark', style: 'soft', colors: softDark, radius: softRadius, depth: softDepth(softDarkInk), depthInk: softDarkInk, ...shared };

/** All four themes. The contrast contract runs against every one of them. */
export const allThemes: readonly Theme[] = [lightTheme, darkTheme, softLightTheme, softDarkTheme];

export function themeFor(name: ThemeName, style: StyleName): Theme {
  if (style === 'soft') return name === 'dark' ? softDarkTheme : softLightTheme;
  return name === 'dark' ? darkTheme : lightTheme;
}
