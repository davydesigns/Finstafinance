import { View, type ViewProps } from 'react-native';

import { useTheme, type SpaceToken } from '@/theme';

import type { LayoutStyle } from './layoutStyle';

type Align = 'stretch' | 'start' | 'center' | 'end';
const ALIGN = { stretch: 'stretch', start: 'flex-start', center: 'center', end: 'flex-end' } as const;

interface StackProps extends Omit<ViewProps, 'style'> {
  /** Space between children: a spacing token key. */
  gap?: SpaceToken;
  /** Cross-axis alignment. `start` makes children hug their content instead of stretching. */
  align?: Align;
  style?: LayoutStyle;
}

/** Lays children out in a column. Components don't position themselves; their parent does. */
export function Stack({ gap = 3, align = 'stretch', style, ...rest }: StackProps) {
  const { space } = useTheme();
  return <View style={[{ gap: space[gap], alignItems: ALIGN[align] }, style]} {...rest} />;
}

interface RowProps extends StackProps {
  /** Let children wrap onto the next line instead of squeezing. */
  wrap?: boolean;
}

/** Lays children out in a row. */
export function Row({ gap = 3, align = 'center', wrap = false, style, ...rest }: RowProps) {
  const { space } = useTheme();
  return (
    <View
      style={[{ flexDirection: 'row', gap: space[gap], alignItems: ALIGN[align], flexWrap: wrap ? 'wrap' : 'nowrap' }, style]}
      {...rest}
    />
  );
}
