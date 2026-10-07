import { useSyncExternalStore } from 'react';

const subscribe = () => () => undefined;

/**
 * False while a page is hydrating from server-built HTML, true everywhere else
 * (phones, and web pages rendered in the browser).
 *
 * The static web build is rendered on a server that has no screen size, colour scheme or
 * locale. If the browser's first render used the real values, it would disagree with that
 * HTML and React would leave stale styles behind. So anything that depends on the
 * visitor's environment starts from a fixed default and switches right after hydration.
 * React picks the "server" snapshot (false) during hydration and the client one (true) after.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
