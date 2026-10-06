import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { Icon, Text } from '@/components/core';
import { useTheme } from '@/theme';
import { currencyDigits, currencySymbol, sanitizeAmountInput } from '@/utils/money';

export interface AmountInputProps
  extends Omit<TextInputProps, 'value' | 'onChangeText' | 'style' | 'keyboardType' | 'inputMode'> {
  label: string;
  /** ISO 4217 code. Sets the symbol and how many decimals can be typed. */
  currency: string;
  /** What the user has typed, in MAJOR units: "12.50". The app owns this state. */
  value: string;
  /** Receives already-cleaned text (digits and one decimal point). */
  onChangeText: (text: string) => void;
  helperText?: string;
  /**
   * Show an error by passing its message. The component does NOT decide what
   * is valid (balance, limits, fees): that is the app's job.
   */
  errorText?: string;
  locale?: string;
}

export function AmountInput({
  label,
  currency,
  value,
  onChangeText,
  helperText,
  errorText,
  locale,
  editable = true,
  placeholder,
  onFocus,
  onBlur,
  ...rest
}: AmountInputProps) {
  const { colors, space, radius, typography, borderWidth, controlHeight } = useTheme();
  const [focused, setFocused] = useState(false);

  const digits = currencyDigits(currency, locale);
  const symbol = currencySymbol(currency, locale);
  const hasError = Boolean(errorText);
  // maxFontSizeMultiplier is a prop, not a style, so pull it out.
  const { maxFontSizeMultiplier, ...inputType } = typography.moneyLarge;

  // Priority: error > focus > default. Error and focus also thicken the border,
  // so state never depends on colour alone.
  const borderColor = hasError ? colors.status.danger.text : focused ? colors.border.focus : colors.border.strong;
  const borderW = hasError || focused ? borderWidth.medium : borderWidth.thin;

  return (
    <View style={{ gap: space[2] }}>
      <Text variant="label" color={editable ? 'primary' : 'disabled'}>
        {label}
      </Text>

      <View
        style={{
          minHeight: controlHeight.large,
          flexDirection: 'row',
          alignItems: 'center',
          gap: space[2],
          paddingHorizontal: space[4],
          borderRadius: radius.md,
          borderWidth: borderW,
          borderColor,
          backgroundColor: editable ? colors.surface.primary : colors.action.disabled,
        }}
      >
        <Text variant="heading2" color="secondary" accessibilityElementsHidden importantForAccessibility="no">
          {symbol}
        </Text>
        <TextInput
          value={value}
          onChangeText={(text) => onChangeText(sanitizeAmountInput(text, digits))}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          editable={editable}
          inputMode={digits === 0 ? 'numeric' : 'decimal'}
          keyboardType={digits === 0 ? 'number-pad' : 'decimal-pad'}
          placeholder={placeholder ?? (digits === 0 ? '0' : `0.${'0'.repeat(digits)}`)}
          placeholderTextColor={colors.text.secondary}
          selectionColor={colors.action.primary}
          maxFontSizeMultiplier={maxFontSizeMultiplier}
          accessibilityLabel={`${label}, ${currency}`}
          accessibilityHint={errorText ?? helperText}
          accessibilityState={{ disabled: !editable }}
          style={[inputType, { flex: 1, color: editable ? colors.text.primary : colors.text.disabled, paddingVertical: space[3] }]}
          {...rest}
        />
      </View>

      {hasError ? (
        <View accessibilityRole="alert" style={{ flexDirection: 'row', alignItems: 'center', gap: space[1] }}>
          <Icon name="alert-circle" size="small" color="danger" />
          <Text variant="bodySmall" color="danger" style={{ flex: 1 }}>
            {errorText}
          </Text>
        </View>
      ) : helperText ? (
        <Text variant="bodySmall" color="secondary">
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}
