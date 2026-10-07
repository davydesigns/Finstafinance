import { View } from 'react-native';

import { Icon, Text, type IconName, type Tone } from '@/components/core';
import { useTheme } from '@/theme';

export type BadgeStatus = 'success' | 'warning' | 'danger' | 'neutral' | 'pending';

/**
 * Each status has its own colour AND its own icon shape AND a text label,
 * so it still reads for colour-blind users and in greyscale.
 */
const CONFIG: Record<BadgeStatus, { icon: IconName; tone: Exclude<Tone, 'ai'> }> = {
  success: { icon: 'checkmark-circle', tone: 'success' },
  warning: { icon: 'warning', tone: 'warning' },
  danger: { icon: 'close-circle', tone: 'danger' },
  neutral: { icon: 'remove-circle', tone: 'neutral' },
  pending: { icon: 'time', tone: 'info' },
};

export interface StatusBadgeProps {
  status: BadgeStatus;
  /** Required. The word is what makes the status accessible, e.g. "Active", "Failed". */
  label: string;
}

/** Hugs its content; its parent decides where it sits (see `<Stack align="start">`). */
export function StatusBadge({ status, label }: StatusBadgeProps) {
  const { colors, space, radius } = useTheme();
  const { icon, tone } = CONFIG[status];

  return (
    <View
      accessible
      accessibilityLabel={label}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: space[1],
        paddingVertical: space[1],
        paddingHorizontal: space[2],
        borderRadius: radius.full,
        backgroundColor: colors.status[tone].background,
      }}
    >
      <Icon name={icon} size="small" tone={tone} />
      <Text variant="caption" tone={tone}>
        {label}
      </Text>
    </View>
  );
}
