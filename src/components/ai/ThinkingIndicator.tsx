import { useEffect, useState } from 'react';
import { Animated, Platform, View } from 'react-native';

import { TextBase } from '@/components/core/Text';
import { useStrings } from '@/i18n';
import { useReducedMotion, useTheme } from '@/theme';

/**
 * "The assistant is working." Three pulsing dots plus WORDS, so it still communicates
 * when motion is off. With reduced motion the dots are static.
 */
export function ThinkingIndicator({ label }: { label?: string }) {
  const { colors, space, motion } = useTheme();
  const strings = useStrings();
  const reduced = useReducedMotion();
  const text = label ?? strings.ai.thinking;
  const [values] = useState(() => [new Animated.Value(0.35), new Animated.Value(0.35), new Animated.Value(0.35)]);

  useEffect(() => {
    if (reduced) {
      values.forEach((v) => v.setValue(0.7));
      return;
    }
    const step = motion.duration.pulse / 3;
    const loops = values.map((value, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * (step / 2)),
          Animated.timing(value, { toValue: 1, duration: step, useNativeDriver: Platform.OS !== 'web' }),
          Animated.timing(value, { toValue: 0.35, duration: step, useNativeDriver: Platform.OS !== 'web' }),
        ]),
      ),
    );
    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
  }, [reduced, values, motion.duration.pulse]);

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={text}
      accessibilityLiveRegion="polite"
      style={{ flexDirection: 'row', alignItems: 'center', gap: space[2] }}
    >
      <View style={{ flexDirection: 'row', gap: space[1] }}>
        {values.map((value, index) => (
          <Animated.View
            key={index}
            style={{ width: space[2], height: space[2], borderRadius: space[1], backgroundColor: colors.ai.accent, opacity: value }}
          />
        ))}
      </View>
      <TextBase variant="bodySmall" colorValue={colors.text.secondary}>
        {text}
      </TextBase>
    </View>
  );
}
