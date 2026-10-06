import { ActivityIndicator, Pressable, type PressableProps, type ViewStyle } from 'react-native';

import { useTheme, type ControlSize } from '@/theme';

import { Text, type TextColor, type TextProps } from './Text';
import { useFocusRing } from './useFocusRing';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive';
export type ButtonSize = ControlSize;

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style' | 'disabled'> {
  /** The visible label. Also used as the screen-reader label unless `accessibilityLabel` is set. */
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  /** Shows a spinner and ignores presses. The label stays so the width doesn't jump. */
  loading?: boolean;
  fullWidth?: boolean;
}

const LABEL_VARIANT: Record<ButtonSize, NonNullable<TextProps['variant']>> = {
  small: 'label',
  medium: 'bodyStrong',
  large: 'bodyStrong',
};

export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  onPress,
  onFocus,
  onBlur,
  hitSlop,
  accessibilityLabel,
  accessibilityState,
  ...rest
}: ButtonProps) {
  const { colors, space, radius, touchTarget, controlHeight, borderWidth } = useTheme();
  const { handlers, ringStyle } = useFocusRing(onFocus, onBlur);

  const height = controlHeight[size];
  // Small buttons look compact but still get a 48pt tappable area.
  const slop = Math.max(0, (touchTarget - height) / 2);
  const solid = variant === 'primary' || variant === 'destructive';

  const labelColor: TextColor = disabled
    ? 'disabled'
    : variant === 'primary'
      ? 'onPrimary'
      : variant === 'destructive'
        ? 'inverse'
        : 'link';

  const solidFill = (pressed: boolean): string => {
    if (variant === 'destructive') return pressed ? colors.action.destructivePressed : colors.action.destructive;
    return pressed ? colors.action.primaryPressed : colors.action.primary;
  };

  const background = (pressed: boolean): string => {
    if (disabled) return solid ? colors.action.disabled : 'transparent';
    if (solid) return solidFill(pressed);
    return pressed ? colors.action.subtle : 'transparent';
  };

  const outlineColor = variant === 'destructive' ? colors.action.destructive : colors.action.primary;
  const spinnerColor = variant === 'primary' ? colors.action.onPrimary : variant === 'destructive' ? colors.action.onDestructive : colors.action.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ ...accessibilityState, disabled, busy: loading }}
      disabled={disabled}
      hitSlop={hitSlop ?? { top: slop, bottom: slop }}
      onPress={loading ? undefined : onPress}
      {...handlers}
      style={({ pressed }): ViewStyle => ({
        // minHeight, not height: at large text sizes the button must grow, not clip its label.
        minHeight: height,
        minWidth: touchTarget,
        alignSelf: fullWidth ? 'stretch' : 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: space[2],
        paddingVertical: space[2],
        paddingHorizontal: size === 'small' ? space[4] : size === 'medium' ? space[6] : space[8],
        borderRadius: radius.md,
        backgroundColor: background(pressed),
        borderWidth: variant === 'secondary' ? borderWidth.medium : borderWidth.none,
        borderColor: disabled ? colors.border.default : outlineColor,
        ...ringStyle,
      })}
      {...rest}
    >
      {loading ? <ActivityIndicator color={spinnerColor} /> : null}
      <Text variant={LABEL_VARIANT[size]} color={labelColor} style={{ flexShrink: 1, textAlign: 'center' }}>
        {title}
      </Text>
    </Pressable>
  );
}
