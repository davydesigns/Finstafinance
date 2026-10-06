import { useWindowDimensions } from 'react-native';

import { breakpointFor, type Breakpoint } from './tokens/size';

/** The current layout size class. Re-renders when the window resizes or the device rotates. */
export function useBreakpoint(): Breakpoint {
  return breakpointFor(useWindowDimensions().width);
}
