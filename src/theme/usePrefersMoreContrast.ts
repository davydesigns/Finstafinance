import { useSyncExternalStore } from 'react';
import { AccessibilityInfo } from 'react-native';

let current = false;
let started = false;
const listeners = new Set<() => void>();

function set(value: boolean) {
  if (value === current) return;
  current = value;
  listeners.forEach((listener) => listener());
}

function start() {
  if (started) return;
  started = true;
  // iOS "Increase Contrast" (Darker System Colors). Android has no equivalent flag we can read, so it stays false there.
  AccessibilityInfo.isDarkerSystemColorsEnabled?.()
    .then(set)
    .catch(() => undefined);
  AccessibilityInfo.addEventListener?.('darkerSystemColorsChanged', set);
}

function subscribe(listener: () => void) {
  start();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * True when the device asks for more contrast (iOS "Increase Contrast"; on web, `prefers-contrast: more`
 * or Windows forced colours). The Soft style steps aside then, because it leans on shadows and shadows
 * are the first thing a high-contrast mode removes. See docs/soft/01-accessible-neumorphism.md.
 */
export function usePrefersMoreContrast(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => false,
  );
}
