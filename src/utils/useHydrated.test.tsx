import { renderHook } from '@testing-library/react-native';
import { renderToString } from 'react-dom/server';

import { useHydrated } from './useHydrated';

function Probe() {
  return <>{String(useHydrated())}</>;
}

describe('useHydrated()', () => {
  it('is false when rendered on a server (so the browser can match the static HTML)', () => {
    expect(renderToString(<Probe />)).toBe('false');
  });

  it('is true when rendered on a client (phones, and browser-only renders)', () => {
    const { result } = renderHook(() => useHydrated());
    expect(result.current).toBe(true);
  });
});
