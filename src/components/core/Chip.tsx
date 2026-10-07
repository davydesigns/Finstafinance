import { Pressable } from 'react-native';

import { useTheme } from '@/theme';

import { IconBase, type IconName } from './Icon';
import { TextBase } from './Text';
import { useFocusRing } from './useFocusRing';

export interface ChipProps {
  label: string;
  icon?: IconName;
  /** For toggles and choices. Reported to screen readers. */
  selected?: boolean;
  /** `ai` tints it violet: for suggestions the assistant offers. */
  tone?: 'default' | 'ai';
  disabled?: boolean;
  onPress: () => void;
  accessibilityHint?: string;
}

/** A compact pressable pill for suggestions and choices. 36pt tall with a 48pt tap area. */
export function Chip({ label, icon, selected = false, tone = 'default', disabled = false, onPress, accessibilityHint }: ChipProps) {
  const { colors, space, radius, controlHeight, touchTarget, borderWidth } = useTheme();
  const { handlers, ringStyle } = useFocusRing();
  const ai = tone === 'ai';
  const slop = (touchTarget - controlHeight.small) / 2;

  const background = disabled ? colors.action.disabled : selected && !ai ? colors.action.subtle : ai ? colors.ai.subtle : colors.surface.primary;
  const border = disabled ? colors.border.default : ai ? colors.ai.border : selected ? colors.action.primary : colors.border.strong;
  const text = disabled ? colors.text.disabled : ai ? colors.ai.onSubtle : selected ? colors.action.onSubtle : colors.text.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      hitSlop={{ top: slop, bottom: slop }}
      onPress={onPress}
      {...handlers}
      style={({ pressed }) => ({
        minHeight: controlHeight.small,
        flexDirection: 'row',
        alignItems: 'center',
        gap: space[2],
        alignSelf: 'flex-start',
        paddingHorizontal: space[3],
        borderRadius: radius.full,
        backgroundColor: background,
        borderWidth: pressed || selected ? borderWidth.medium : borderWidth.thin,
        borderColor: border,
        ...ringStyle,
      })}
    >
      {icon ? <IconBase name={icon} size="small" colorValue={text} /> : null}
      <TextBase variant="label" colorValue={text}>
        {label}
      </TextBase>
    </Pressable>
  );
}
