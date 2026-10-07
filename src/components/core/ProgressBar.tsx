import { View } from 'react-native';

import { useStrings } from '@/i18n';
import { useTheme } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Row, Stack } from './Stack';
import { Text, TextBase } from './Text';

interface Base {
  /** What is being measured, e.g. "Dining". */
  label: string;
  value: number;
  max: number;
  /** The figures in words, formatted by the app: "$312 of $250". Spoken and shown. */
  valueLabel: string;
}

/**
 * A plain bar needs no status. Any other tone REQUIRES a word (`statusLabel`), because a bar
 * that only turns red means nothing to someone who cannot see red.
 */
export type ProgressBarProps = Base &
  (
    | { tone?: 'default'; statusLabel?: string }
    | { tone: 'success' | 'warning' | 'danger'; statusLabel: string }
  );

const STATUS_ICON: Record<'success' | 'warning' | 'danger', IconName> = {
  success: 'checkmark-circle',
  warning: 'warning',
  danger: 'alert-circle',
};

/** How far along something is: a labelled bar with its figures and, if it needs attention, a word and an icon. */
export function ProgressBar({ label, value, max, valueLabel, tone = 'default', statusLabel }: ProgressBarProps) {
  const { colors, space, radius, depth } = useTheme();
  const strings = useStrings();

  const ratio = max > 0 ? value / max : 0;
  const percent = Math.round(ratio * 100);
  const fill = tone === 'default' ? colors.action.primary : colors.status[tone].text;
  const spoken = [label, valueLabel, statusLabel, strings.progress.percent.replace('{percent}', String(percent))].filter(Boolean).join(', ');

  return (
    <Stack
      gap={2}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={spoken}
      accessibilityValue={{ min: 0, max: 100, now: Math.min(100, Math.max(0, percent)) }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: space[3] }}>
        <Text variant="bodyStrong" style={{ flexShrink: 1 }}>
          {label}
        </Text>
        <Text variant="bodySmall" color="secondary" style={{ flexShrink: 1, textAlign: 'right' }}>
          {valueLabel}
        </Text>
      </View>
      <View
        style={[
          { height: space[3], borderRadius: radius.full, backgroundColor: colors.background.secondary, overflow: 'hidden' },
          depth.field,
        ]}
      >
        <View style={{ width: `${Math.min(100, Math.max(0, ratio * 100))}%`, height: '100%', borderRadius: radius.full, backgroundColor: fill }} />
      </View>
      {statusLabel && tone !== 'default' ? (
        <Row gap={1}>
          <Icon name={STATUS_ICON[tone]} size="small" tone={tone} />
          <TextBase variant="caption" colorValue={colors.status[tone].text}>
            {statusLabel}
          </TextBase>
        </Row>
      ) : null}
    </Stack>
  );
}
