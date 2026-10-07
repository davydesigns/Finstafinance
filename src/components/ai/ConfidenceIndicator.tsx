import { View } from 'react-native';

import { TextBase } from '@/components/core/Text';
import { useStrings } from '@/i18n';
import { useTheme } from '@/theme';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

const FILLED: Record<ConfidenceLevel, number> = { high: 3, medium: 2, low: 1 };

/**
 * How sure the system is, in three CATEGORIES (never a percentage: people over-read precise
 * numbers). Shown as filled bars plus words, so it never depends on colour.
 *
 * Use it only where it can change a decision. If the user would act the same either way,
 * leave it out: unneeded confidence displays teach people to over-trust "High".
 */
export function ConfidenceIndicator({ level }: { level: ConfidenceLevel }) {
  const { colors, space, radius } = useTheme();
  const strings = useStrings();
  const palette = colors.confidence[level];
  const text = strings.ai.confidence[level];

  return (
    <View accessible accessibilityLabel={text} style={{ flexDirection: 'row', alignItems: 'center', gap: space[2] }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: space[1] }}>
        {[1, 2, 3].map((bar) => (
          <View
            key={bar}
            style={{
              width: space[2],
              height: space[1] + space[1] * bar,
              borderRadius: radius.sm,
              backgroundColor: bar <= FILLED[level] ? palette.text : colors.border.default,
            }}
          />
        ))}
      </View>
      <TextBase variant="caption" colorValue={palette.text}>
        {text}
      </TextBase>
    </View>
  );
}
