import { Switch, View } from 'react-native';

import { Button, Stack, Text } from '@/components/core';
import { useStrings } from '@/i18n';
import { useTheme } from '@/theme';

export interface DataUseRowProps {
  title: string;
  description: string;
  /** What the data is used for, in plain words. Always shown, never tucked away. */
  usedFor: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  /** Lets the customer erase what this feature learned. */
  onRemoveData?: () => void;
}

/**
 * A consent control: what, why, on/off, and a way to erase it. State is shown in WORDS beside the
 * switch ("On"/"Off"), so it never depends on the colour of a track.
 */
export function DataUseRow({ title, description, usedFor, value, onValueChange, onRemoveData }: DataUseRowProps) {
  const { colors, space, touchTarget } = useTheme();
  const strings = useStrings();

  return (
    <Stack gap={2}>
      <View style={{ minHeight: touchTarget, flexDirection: 'row', alignItems: 'center', gap: space[3] }}>
        <Stack gap={1} style={{ flex: 1 }}>
          <Text variant="bodyStrong">{title}</Text>
          <Text variant="bodySmall" color="secondary">
            {description}
          </Text>
          <Text variant="caption" color="secondary">
            {`${strings.ai.data.scope}: ${usedFor}`}
          </Text>
        </Stack>
        <View style={{ alignItems: 'center', gap: space[1] }}>
          <Switch
            value={value}
            onValueChange={onValueChange}
            accessibilityLabel={title}
            accessibilityHint={description}
            trackColor={{ false: colors.border.strong, true: colors.action.primary }}
            thumbColor={colors.surface.primary}
            ios_backgroundColor={colors.border.strong}
          />
          <Text variant="caption" color="secondary" accessibilityElementsHidden importantForAccessibility="no">
            {value ? strings.ai.data.on : strings.ai.data.off}
          </Text>
        </View>
      </View>
      {onRemoveData ? (
        <Stack align="start">
          <Button label={strings.ai.data.remove} variant="tertiary" size="small" onPress={onRemoveData} />
        </Stack>
      ) : null}
    </Stack>
  );
}
