import { createContext, useContext, useMemo, useReducer, useState, type Dispatch, type ReactNode } from 'react';

import { demoReducer, initialState, type DemoAction, type DemoState } from './state';

interface DemoContextValue {
  state: DemoState;
  dispatch: Dispatch<DemoAction>;
  /** False until the demo has "fetched" its data once. Drives the loading skeletons, and only the first time. */
  ready: boolean;
  markReady: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

/** Holds the demo's accounts and activity for as long as the demo app is open, so a transfer sent on one screen shows on the others. */
export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, initialState);
  const [ready, setReady] = useState(false);
  const value = useMemo<DemoContextValue>(() => ({ state, dispatch, ready, markReady: () => setReady(true) }), [state, ready]);
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const value = useContext(DemoContext);
  if (!value) throw new Error('useDemo must be used inside <DemoProvider>');
  return value;
}
