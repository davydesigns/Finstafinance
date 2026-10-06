import { View } from 'react-native';

import { Icon, Text, type IconName } from '@/components/core';
import { useTheme } from '@/theme';

export type BadgeStatus = 'success' | 'warning' | 'error' | 'neutral' | 'pending';

/** Which semantic status colour family each badge status uses. */
type Tone = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

/**
 * Each status has its own colour AND its own icon shape AND a text label,
 * so it still reads for colour-blind users and in greyscale.
 */
const CONFIG: Record<BadgeStatus, { icon: IconName; tone: Tone }> = {
  success: { icon: 'checkmark-circle', tone: 'success' },
  warning: { icon: 'warning', tone: 'warning' },
  error: { icon: 'close-circle', tone: 'danger' },
  neutral: { icon: 'remove-circle', tone: 'neutral' },
  pending: { icon: 'time', tone: 'info' },
};

export interface StatusBadgeProps {
  status: BadgeStatus;
  /** Required. The word is what makes the status accessible, e.g. "Active", "Failed". */
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const { colors, space, radius } = useTheme();
  const { icon, tone } = CONFIG[status];

  return (
    <View
      accessible
      accessibilityLabel={label}
      style={{
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: space[1],
        paddingVertical: space[1],
        paddingHorizontal: space[2],
        borderRadius: radius.full,
        backgroundColor: colors.status[tone].background,
      }}
    >
      <Icon name={icon} size="small" color={tone} />
      <Text variant="caption" color={tone}>
        {label}
      </Text>
    </View>
  );
}
