import { useWindowDimensions } from 'react-native';

import { useHydrated } from '@/utils/useHydrated';

import { breakpointFor, type Breakpoint } from './tokens/size';

/**
 * The current layout size class. Re-renders when the window resizes or the device rotates.
 * On web the first render is always `compact` (what the server built), then it switches.
 */
export function useBreakpoint(): Breakpoint {
  const width = useWindowDimensions().width;
  return useHydrated() ? breakpointFor(width) : 'compact';
}
