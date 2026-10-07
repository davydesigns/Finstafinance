import { useSyncExternalStore } from 'react';

const QUERIES = ['(prefers-contrast: more)', '(forced-colors: active)'];

function matches(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && QUERIES.some((query) => window.matchMedia(query).matches);
}

function subscribe(listener: () => void) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => undefined;
  const lists = QUERIES.map((query) => window.matchMedia(query));
  lists.forEach((list) => list.addEventListener('change', listener));
  return () => lists.forEach((list) => list.removeEventListener('change', listener));
}

/**
 * True when the visitor's system asks for more contrast (`prefers-contrast: more`) or has forced colours on.
 * The Soft style steps aside then, because it leans on shadows and forced colours removes them.
 * On the server this is false; the real value arrives right after hydration.
 */
export function usePrefersMoreContrast(): boolean {
  return useSyncExternalStore(
    subscribe,
    matches,
    () => false,
  );
}
