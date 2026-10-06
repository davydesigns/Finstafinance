import type { TextStyle, ViewStyle } from 'react-native';

/**
 * The only style props consumers may pass to design-system components:
 * where a thing sits, never how it looks. Colour, type, border and radius
 * come from tokens, and the compiler rejects attempts to override them.
 */
export type LayoutStyle = Pick<
  ViewStyle,
  | 'margin'
  | 'marginTop'
  | 'marginBottom'
  | 'marginLeft'
  | 'marginRight'
  | 'marginHorizontal'
  | 'marginVertical'
  | 'flex'
  | 'flexGrow'
  | 'flexShrink'
  | 'flexBasis'
  | 'alignSelf'
  | 'width'
  | 'minWidth'
  | 'maxWidth'
>;

export type TextLayoutStyle = LayoutStyle & Pick<TextStyle, 'textAlign'>;
