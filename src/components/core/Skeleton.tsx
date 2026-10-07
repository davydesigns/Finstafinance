import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Platform, View, type DimensionValue } from 'react-native';

import { useStrings } from '@/i18n';
import { useReducedMotion, useTheme } from '@/theme';

export interface SkeletonProps {
  /** A line of text, a block (card, chart) or a circle (avatar). */
  shape?: 'line' | 'block' | 'circle';
  width?: DimensionValue;
  /** Points. Defaults suit each shape. */
  height?: number;
}

/**
 * A placeholder shaped like the content that is coming, so the page does not jump when it arrives.
 * It pulses gently, and holds still when the user asks for reduced motion.
 * Decorative: wrap a group in `LoadingRegion` so screen readers hear one "Loading".
 */
export function Skeleton({ shape = 'line', width, height }: SkeletonProps) {
  const { colors, radius, space, size, motion } = useTheme();
  const reduced = useReducedMotion();
  const [opacity] = useState(() => new Animated.Value(0.6));

  useEffect(() => {
    if (reduced) {
      opacity.setValue(0.8);
      return;
    }
    const half = motion.duration.pulse / 2;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: half, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(opacity, { toValue: 0.5, duration: half, useNativeDriver: Platform.OS !== 'web' }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduced, opacity, motion.duration.pulse]);

  const h = height ?? (shape === 'circle' ? size.avatar : shape === 'block' ? space[16] : space[4]);
  const w: DimensionValue = width ?? (shape === 'circle' ? h : '100%');

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        width: w,
        height: h,
        borderRadius: shape === 'circle' ? radius.full : shape === 'block' ? radius.lg : radius.sm,
        backgroundColor: colors.background.secondary,
        opacity,
      }}
    />
  );
}

export interface LoadingRegionProps {
  /** What is loading, e.g. "Loading accounts". Defaults to "Loading". */
  label?: string;
  children: ReactNode;
}

/** Groups skeletons so a screen reader says "Loading" once, and the group is marked busy. */
export function LoadingRegion({ label, children }: LoadingRegionProps) {
  const strings = useStrings();
  return (
    <View accessible accessibilityLabel={label ?? strings.loading.label} accessibilityState={{ busy: true }} aria-busy>
      {children}
    </View>
  );
}
