import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/** True when the user has asked their device to reduce motion. Updates live. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled?.()
      .then((enabled) => {
        // Only update when motion IS reduced: the default is already false, so there is nothing to change otherwise.
        if (active && enabled) setReduced(true);
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
