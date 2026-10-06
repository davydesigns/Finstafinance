/**
 * PRIMITIVE colour tokens: raw palette values with no meaning attached.
 * Components must never import these directly. They use the semantic
 * tokens in `themes.ts`, which point at these values.
 */
export const palette = {
  white: '#FFFFFF',

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
