import { useState } from 'react';
import { ActivityIndicator, Pressable, type PressableProps, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

import { Text, type TextColor } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  title: string;
  variant?: ButtonVariant;
  /** Shows a spinner and ignores presses. The label stays so the width doesn't jump. */
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled: disabledProp,
  fullWidth = false,
  onPress,
  onFocus,
  onBlur,
  accessibilityLabel,
  accessibilityState,
  ...rest
}: ButtonProps) {
  const disabled = disabledProp ?? false;
  const { colors, space, radius, touchTarget, borderWidth } = useTheme();
  // Focus ring: shown for keyboard / switch-control users (web, Android, iPad keyboards).
  const [focused, setFocused] = useState(false);

  const labelColor: TextColor = disabled
    ? 'disabled'
    : variant === 'primary'
      ? 'onPrimary'
      : 'link';

  const background = (pressed: boolean): string => {
    if (disabled) return variant === 'primary' ? colors.action.disabled : 'transparent';
    if (variant === 'primary') return pressed ? colors.action.primaryPressed : colors.action.primary;
    return pressed ? colors.action.subtle : 'transparent';
  };

  const spinnerColor = variant === 'primary' ? colors.action.onPrimary : colors.action.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ ...accessibilityState, disabled, busy: loading }}
      disabled={disabled}
      onPress={loading ? undefined : onPress}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      style={({ pressed }): ViewStyle => ({
        minHeight: touchTarget,
        minWidth: touchTarget,
        alignSelf: fullWidth ? 'stretch' : 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: space[2],
        paddingHorizontal: space[6],
        paddingVertical: space[2],
        borderRadius: radius.md,
        backgroundColor: background(pressed),
        borderWidth: variant === 'secondary' ? borderWidth.medium : borderWidth.none,
        borderColor: disabled ? colors.border.default : colors.action.primary,
        outlineWidth: focused ? borderWidth.medium : borderWidth.none,
        outlineColor: colors.border.focus,
        outlineOffset: 2,
        outlineStyle: 'solid',
      })}
      {...rest}
    >
      {loading ? <ActivityIndicator color={spinnerColor} /> : null}
      <Text variant="bodyStrong" color={labelColor}>
        {title}
      </Text>
    </Pressable>
  );
}
