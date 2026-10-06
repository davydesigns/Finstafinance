import { Pressable, View } from 'react-native';

import { Text, useFocusRing } from '@/components/core';
import { useTheme, useThemePreference, type ThemePreference } from '@/theme';

const PREFERENCES: ThemePreference[] = ['system', 'light', 'dark'];

function ThemeOption({ option, selected, onPress }: { option: ThemePreference; selected: boolean; onPress: () => void }) {
  const { colors, radius, touchTarget, borderWidth } = useTheme();
  const { handlers, ringStyle } = useFocusRing();
  return (
    <Pressable
      accessibilityRole="radio"
      // Radio buttons report `checked`; `selected` is kept for platforms that read it.
      accessibilityState={{ checked: selected, selected }}
      aria-checked={selected}
      accessibilityLabel={`${option} theme`}
      onPress={onPress}
      {...handlers}
      style={{
        flex: 1,
        minHeight: touchTarget,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.full,
        backgroundColor: selected ? colors.action.primary : colors.surface.primary,
        borderWidth: borderWidth.thin,
        borderColor: selected ? colors.action.primary : colors.border.strong,
        ...ringStyle,
      }}
    >
      <Text variant="bodyStrong" color={selected ? 'onPrimary' : 'primary'}>
        {option[0].toUpperCase() + option.slice(1)}
      </Text>
    </Pressable>
  );
}

export function ThemeSwitcher() {
  const { space } = useTheme();
  const { preference, setPreference } = useThemePreference();
  return (
    <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', gap: space[2] }}>
      {PREFERENCES.map((option) => (
        <ThemeOption key={option} option={option} selected={option === preference} onPress={() => setPreference(option)} />
      ))}
    </View>
  );
}
