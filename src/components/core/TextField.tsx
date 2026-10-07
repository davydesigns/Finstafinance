import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Platform, Pressable, TextInput, type TextInputProps } from 'react-native';

import { useTheme } from '@/theme';

import { Icon, IconBase, type IconName } from './Icon';
import { Row, Stack } from './Stack';
import { Text, TextBase } from './Text';

export interface TextFieldProps
  extends Omit<TextInputProps, 'value' | 'onChangeText' | 'style' | 'editable' | 'placeholderTextColor' | 'accessibilityLabel' | 'accessibilityHint'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  helperText?: string;
  /**
   * Show an error by passing its message. The component does NOT decide what is valid:
   * that is the app's job, because only the app knows the rules.
   */
  errorText?: string;
  /** A leading icon, e.g. a magnifier for search. Decorative: the label names the field. */
  icon?: IconName;
  disabled?: boolean;
}

/**
 * A single-line text field. Same behaviour as `AmountInput`, for words: a visible label, a border that
 * always meets 3:1 (and thickens on focus or error, so state never depends on colour), an error that is
 * announced when it appears, and a tap target that is the whole box.
 */
export function TextField({ label, value, onChangeText, helperText, errorText, icon, disabled = false, onFocus, onBlur, ...rest }: TextFieldProps) {
  const { name, colors, space, radius, typography, borderWidth, controlHeight, depth } = useTheme();
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const hasError = Boolean(errorText);

  // A new error must be HEARD, not just seen. iOS needs an explicit announcement; Android uses the live region below.
  useEffect(() => {
    if (errorText && Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(errorText);
  }, [errorText]);

  const { maxFontSizeMultiplier, ...inputType } = typography.body;
  const borderColor = hasError ? colors.status.danger.text : focused ? colors.border.focus : colors.border.strong;

  return (
    <Stack gap={2}>
      {/* Hidden from screen readers: the input's own label already says this. Otherwise it is read twice. */}
      <Text variant="label" color={disabled ? 'disabled' : 'primary'} aria-hidden>
        {label}
      </Text>

      <Pressable
        accessible={false}
        disabled={disabled}
        onPress={() => inputRef.current?.focus()}
        style={{
          minHeight: controlHeight.medium,
          flexDirection: 'row',
          alignItems: 'center',
          gap: space[2],
          paddingHorizontal: space[4],
          borderRadius: radius.md,
          borderWidth: hasError || focused ? borderWidth.medium : borderWidth.thin,
          borderColor,
          backgroundColor: disabled ? colors.action.disabled : colors.surface.primary,
          // Soft presses the field into the page; the 3:1 border above stays, so a field is findable without shadows.
          ...(disabled ? null : depth.field),
        }}
      >
        {icon ? <IconBase name={icon} colorValue={colors.text.secondary} /> : null}
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          editable={!disabled}
          keyboardAppearance={name}
          placeholderTextColor={colors.text.secondary}
          selectionColor={colors.action.primary}
          maxFontSizeMultiplier={maxFontSizeMultiplier}
          // The error lives in the LABEL, not the hint: users can switch hints off.
          accessibilityLabel={hasError ? `${label}, error: ${errorText}` : label}
          accessibilityHint={helperText}
          accessibilityState={{ disabled }}
          // minWidth 0 lets the field shrink with its box; otherwise a browser's built-in input width forces overflow on narrow screens.
          // outlineWidth 0: the box around it already shows focus (a thicker border in the focus colour), so the browser's own outline would be a second, clashing ring.
          style={[inputType, { flex: 1, minWidth: 0, color: disabled ? colors.text.disabled : colors.text.primary, paddingVertical: space[3], outlineWidth: 0 }]}
          {...rest}
        />
      </Pressable>

      {hasError ? (
        <Row gap={1} accessible accessibilityRole="alert" accessibilityLiveRegion="polite">
          <Icon name="alert-circle" size="small" tone="danger" />
          <TextBase variant="bodySmall" colorValue={colors.status.danger.text} style={{ flex: 1 }}>
            {errorText}
          </TextBase>
        </Row>
      ) : helperText ? (
        <Text variant="bodySmall" color="secondary">
          {helperText}
        </Text>
      ) : null}
    </Stack>
  );
}
