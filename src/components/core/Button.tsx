import { useEffect } from 'react';
import { AccessibilityInfo, ActivityIndicator, Platform, Pressable, type PressableProps, type ViewStyle } from 'react-native';

import { useStrings } from '@/i18n';
import { depthWhen, useTheme, type ControlSize, type TextVariant } from '@/theme';

import { TextBase } from './Text';
import { useFocusRing } from './useFocusRing';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive';
export type ButtonSize = ControlSize;

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style' | 'disabled'> {
  /** The visible text. Also the screen-reader label unless `accessibilityLabel` is set. */
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  /** Shows a spinner and ignores presses. The label stays so the width doesn't jump. */
  loading?: boolean;
  /** Spans the width of its parent. Otherwise the parent decides (use `<Stack align="start">` to hug content). */
  fullWidth?: boolean;
}

const LABEL_VARIANT: Record<ButtonSize, TextVariant> = {
  small: 'label',
  medium: 'bodyStrong',
  large: 'bodyStrong',
};

export function Button({
  label,
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
  const { colors, space, radius, touchTarget, controlHeight, borderWidth, depth } = useTheme();
  const { handlers, ringStyle } = useFocusRing(onFocus, onBlur);
  const strings = useStrings();
  const spokenLabel = accessibilityLabel ?? label;

  // A spinner means nothing to a screen reader, so say it once when loading starts (iOS; Android reads the busy state).
  useEffect(() => {
    if (loading && Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(`${spokenLabel}, ${strings.button.loading}`);
  }, [loading, spokenLabel, strings.button.loading]);

  const height = controlHeight[size];
  // Small buttons look compact but still get a 48pt tappable area.
  const slop = Math.max(0, (touchTarget - height) / 2);
  const solid = variant === 'primary' || variant === 'destructive';

  // One colour per variant, shared by label, border and spinner so they can never disagree.
  const accent = variant === 'destructive' ? colors.action.destructive : colors.action.primary;
  const onSolid = variant === 'destructive' ? colors.action.onDestructive : colors.action.onPrimary;
  const labelColor = disabled ? colors.text.disabled : solid ? onSolid : accent;

  const background = (pressed: boolean): string => {
    if (disabled) return solid ? colors.action.disabled : 'transparent';
    if (variant === 'destructive') return pressed ? colors.action.destructivePressed : colors.action.destructive;
    if (variant === 'primary') return pressed ? colors.action.primaryPressed : colors.action.primary;
    return pressed ? colors.action.subtle : 'transparent';
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={spokenLabel}
      accessibilityState={{ ...accessibilityState, disabled, busy: loading }}
      disabled={disabled}
      hitSlop={hitSlop ?? { top: slop, bottom: slop }}
      onPress={loading ? undefined : onPress}
      {...handlers}
      style={({ pressed }): ViewStyle => ({
        // minHeight, not height: at large text sizes the button must grow, not clip its label.
        minHeight: height,
        minWidth: touchTarget,
        width: fullWidth ? '100%' : undefined,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: space[2],
        paddingVertical: space[2],
        paddingHorizontal: size === 'small' ? space[4] : size === 'medium' ? space[6] : space[8],
        borderRadius: radius.md,
        backgroundColor: background(pressed),
        borderWidth: variant === 'secondary' ? borderWidth.medium : borderWidth.none,
        borderColor: disabled ? colors.border.default : accent,
        // Soft raises the button; pressing pushes it in. Disabled and tertiary stay flat.
        ...(disabled || variant === 'tertiary' ? null : depthWhen(pressed, depth.control, depth, solid ? 'solid' : 'tint')),
        ...ringStyle,
      })}
      {...rest}
    >
      {loading ? <ActivityIndicator color={labelColor} /> : null}
      <TextBase variant={LABEL_VARIANT[size]} colorValue={labelColor} style={{ flexShrink: 1, textAlign: 'center' }}>
        {label}
      </TextBase>
    </Pressable>
  );
}
