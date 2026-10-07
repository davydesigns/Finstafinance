/**
 * PRIMITIVE colour tokens: raw palette values with no meaning attached.
 * Components must never import these directly. They use the semantic
 * tokens in `themes.ts`, which point at these values.
 */
export const palette = {
  white: '#FFFFFF',
  black: '#000000',

  // Calm blue: brand / primary actions
  blue50: '#EEF4FF',
  blue100: '#DCE8FF',
  blue200: '#BCD2FF',
  blue300: '#8FB2F7',
  blue400: '#6A96F0',
  blue500: '#3B6FD9',
  blue600: '#2557BD',
  blue700: '#1C4499',
  blue800: '#173875',
  blue900: '#122B58',
  blue950: '#0C1D3B',

  // Violet: reserved for AI-originated content, so it is always recognisable and never confused
  // with the brand blue (actions) or the status colours.
  violet50: '#F4F1FF',
  violet100: '#E8E1FF',
  violet200: '#D2C6FF',
  violet300: '#B5A3FF',
  violet400: '#9A83F5',
  violet600: '#5B3FD9',
  violet700: '#4A2FB8',
  violet800: '#3B2590',
  violet900: '#2A1B6B',
  violet950: '#1B1145',

  // Green: money in, success, confirmation
  green50: '#ECF8F1',
  green100: '#D2F0DE',
  green300: '#6FCB9A',
  green400: '#47BA82',
  green600: '#1B7A4E',
  green700: '#176141',
  green800: '#134D35',
  green950: '#0A2A1C',

  // Cool-tinted neutrals
  neutral50: '#F6F8FB',
  neutral100: '#EDF0F5',
  neutral200: '#DDE2EA',
  neutral300: '#C3CBD7',
  neutral400: '#9AA5B5',
  neutral500: '#6B778A',
  neutral600: '#4F5A6C',
  neutral700: '#3A4455',
  neutral800: '#262E3C',
  neutral900: '#171C27',
  neutral950: '#0E121A',

  // Mist: the one cool blue-grey the Soft style (2.0) is made from. Page and surfaces share it,
  // so cards read as pushed out of the page rather than laid on it. Measured, not eyeballed:
  // see `src/dev/depthLegibility.test.ts`.
  mist100: '#E0E6EF',
  mist200: '#D2DAE6',
  mist300: '#C2CCDC',
  /** The ink of Soft's dark shadow. Used with an alpha, never as a fill. */
  mistShade: '#7C8EAB',

  // Red: errors, failed payments
  red50: '#FDECEC',
  red300: '#F59A92',
  red400: '#F2796F',
  red700: '#A32A23',
  red900: '#5A1612',

  // Amber: pending, caution
  amber50: '#FFF4DB',
  amber300: '#F2C04D',
  amber800: '#7A5000',
  amber950: '#3D2A00',
} as const;

export type PaletteColor = keyof typeof palette;
