import { SegmentedControl, Stack, Text } from '@/components/core';
import { useStylePreference, useThemePreference, type StyleName, type ThemePreference } from '@/theme';

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const STYLE_OPTIONS: { value: StyleName; label: string }[] = [
  { value: 'clean', label: 'Clean' },
  { value: 'soft', label: 'Soft' },
];

/** Light or dark, and Clean (v1) or Soft (v2). The two choices are independent: four themes. */
export function ThemeSwitcher() {
  const { preference, setPreference } = useThemePreference();
  const { stylePreference, setStylePreference, yielded } = useStylePreference();
  return (
    <Stack gap={3}>
      <SegmentedControl options={THEME_OPTIONS} value={preference} onValueChange={setPreference} accessibilityLabel="Theme" />
      <SegmentedControl options={STYLE_OPTIONS} value={stylePreference} onValueChange={setStylePreference} accessibilityLabel="Style" />
      {yielded ? (
        <Text variant="caption" color="secondary" accessibilityRole="alert">
          Soft is paused: your device asks for more contrast, and Soft relies on shadows. Showing Clean instead.
        </Text>
      ) : null}
    </Stack>
  );
}
