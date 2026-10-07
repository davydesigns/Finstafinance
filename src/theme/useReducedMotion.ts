import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/** True when the user has asked their device to reduce motion. Updates live. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled?.()
      .then((enabled) => {
        if (active) setReduced(enabled);
      })
      .catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener?.('reduceMotionChanged', setReduced);
    return () => {
      active = false;
      subscription?.remove();
    };
  }, []);

  return reduced;
}
