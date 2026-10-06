import { SegmentedControl } from '@/components/core';
import { useThemePreference, type ThemePreference } from '@/theme';

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function ThemeSwitcher() {
  const { preference, setPreference } = useThemePreference();
  return <SegmentedControl options={OPTIONS} value={preference} onValueChange={setPreference} accessibilityLabel="Theme" />;
}
