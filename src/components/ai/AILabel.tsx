import { View } from 'react-native';

import { IconBase } from '@/components/core/Icon';
import { TextBase } from '@/components/core/Text';
import { useStrings } from '@/i18n';
import { useTheme } from '@/theme';

export interface AILabelProps {
  /** `compact` shows the short form ("AI"). It is still announced in full. */
  variant?: 'default' | 'compact';
  /** Override the wording, e.g. "Flagged automatically". */
  label?: string;
}

/**
 * Marks content that came from an AI system. It is always words plus an icon, never an
 * icon alone, and screen readers always hear the full wording even in the compact form.
 */
export function AILabel({ variant = 'default', label }: AILabelProps) {
  const { colors, space, radius } = useTheme();
  const strings = useStrings();
  const full = label ?? strings.ai.label;
  const shown = variant === 'compact' && !label ? strings.ai.labelShort : full;

  return (
    <View
      accessible
      accessibilityLabel={full}
      style={{
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: space[1],
        paddingVertical: space[1],
        paddingHorizontal: space[2],
        borderRadius: radius.full,
        backgroundColor: colors.ai.subtle,
      }}
    >
      <IconBase name="sparkles" size="small" colorValue={colors.ai.accent} />
      <TextBase variant="caption" colorValue={colors.ai.accent}>
        {shown}
      </TextBase>
    </View>
  );
}
