import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Platform, Pressable, TextInput, type TextInputProps } from 'react-native';

import { Icon, Row, Stack, Text } from '@/components/core';
import { TextBase } from '@/components/core/Text';
import { useLocale, useStrings } from '@/i18n';
import { useTheme } from '@/theme';
import { currencyDigits, currencySymbol, parseMoney, sanitizeAmountInput, type Money } from '@/utils/money';

export interface AmountInputProps
  extends Omit<TextInputProps, 'value' | 'onChangeText' | 'style' | 'keyboardType' | 'inputMode' | 'editable'> {
  label: string;
  /** ISO 4217 code. Sets the symbol and how many decimals can be typed. */
  currency: string;
  /** What the user has typed, in MAJOR units: "12.50". The app owns this state. */
  value: string;
  /**
   * Called with cleaned text (digits and one decimal point) and the same text
   * parsed to exact `Money` (null while empty). The app decides what is valid.
   */
  onValueChange: (text: string, amount: Money | null) => void;
  helperText?: string;
  /**
   * Show an error by passing its message. The component does NOT decide what
   * is valid (balance, limits, fees): that is the app's job.
   */
  errorText?: string;
  disabled?: boolean;
  /** BCP 47 override. Normally set once via <LocaleProvider>. */
  locale?: string;
}

export function AmountInput({
  label,
  currency,
  value,
  onValueChange,
  helperText,
  errorText,
  disabled = false,
  locale: localeOverride,
  placeholder,
  onFocus,
  onBlur,
  ...rest
}: AmountInputProps) {
  const { name, colors, space, radius, typography, borderWidth, controlHeight } = useTheme();
  const locale = useLocale(localeOverride);
  const strings = useStrings();
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const digits = currencyDigits(currency, locale);
  const symbol = currencySymbol(currency, locale);
  const hasError = Boolean(errorText);

  // A new error must be HEARD, not just seen. iOS needs an explicit announcement;
  // Android does it through the live region on the error row below.
  useEffect(() => {
    if (errorText && Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(errorText);
  }, [errorText]);

  // maxFontSizeMultiplier is a prop, not a style, so pull it out.
  const { maxFontSizeMultiplier, ...inputType } = typography.moneyLarge;

  // Priority: error > focus > default. Error and focus also thicken the border,
  // so state never depends on colour alone.
  const borderColor = hasError ? colors.status.danger.text : focused ? colors.border.focus : colors.border.strong;
  const borderW = hasError || focused ? borderWidth.medium : borderWidth.thin;

  return (
    <Stack gap={2}>
      {/* Hidden from screen readers: the input's own label already says this. Otherwise it is read twice. */}
      <Text variant="label" color={disabled ? 'disabled' : 'primary'} accessibilityElementsHidden importantForAccessibility="no">
        {label}
      </Text>

      {/* Tapping anywhere in the box focuses the field, not just the digits. */}
      <Pressable
        accessible={false}
        disabled={disabled}
        onPress={() => inputRef.current?.focus()}
        style={{
          minHeight: controlHeight.large,
          flexDirection: 'row',
          alignItems: 'center',
          gap: space[2],
          paddingHorizontal: space[4],
          borderRadius: radius.md,
          borderWidth: borderW,
          borderColor,
          backgroundColor: disabled ? colors.action.disabled : colors.surface.primary,
        }}
      >
        <TextBase
          variant="heading2"
          colorValue={colors.text.secondary}
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          {symbol}
        </TextBase>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={(text) => {
            const cleaned = sanitizeAmountInput(text, digits, locale);
            onValueChange(cleaned, parseMoney(cleaned, currency, locale));
          }}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          editable={!disabled}
          keyboardAppearance={name}
          inputMode={digits === 0 ? 'numeric' : 'decimal'}
          keyboardType={digits === 0 ? 'number-pad' : 'decimal-pad'}
          placeholder={placeholder ?? (digits === 0 ? '0' : `0.${'0'.repeat(digits)}`)}
          placeholderTextColor={colors.text.secondary}
          selectionColor={colors.action.primary}
          maxFontSizeMultiplier={maxFontSizeMultiplier}
          // The error lives in the LABEL, not the hint: users can switch hints off.
          accessibilityLabel={`${label}, ${currency}${hasError ? `, ${strings.input.error}: ${errorText}` : ''}`}
          accessibilityHint={helperText}
          autoCorrect={false}
          autoComplete="off"
          spellCheck={false}
          accessibilityState={{ disabled }}
          // minWidth 0 lets the field shrink with its box; otherwise a browser's built-in input width forces overflow on narrow screens.
          style={[inputType, { flex: 1, minWidth: 0, color: disabled ? colors.text.disabled : colors.text.primary, paddingVertical: space[3] }]}
          {...rest}
        />
      </Pressable>

      {hasError ? (
        <Row gap={1} accessible accessibilityRole="alert" accessibilityLiveRegion="polite">
          <Icon name="alert-circle" size="small" tone="danger" />
          <Text variant="bodySmall" tone="danger" style={{ flex: 1 }}>
            {errorText}
          </Text>
        </Row>
      ) : helperText ? (
        <Text variant="bodySmall" color="secondary">
          {helperText}
        </Text>
      ) : null}
    </Stack>
  );
}
