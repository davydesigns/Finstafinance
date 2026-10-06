import { Pressable, View } from 'react-native';

import { Text } from '@/components/core';
import { useTheme, useThemePreference, type ThemePreference } from '@/theme';

const PREFERENCES: ThemePreference[] = ['system', 'light', 'dark'];

export function ThemeSwitcher() {
  const { colors, radius, space, touchTarget, borderWidth } = useTheme();
  const { preference, setPreference } = useThemePreference();
  return (
    <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', gap: space[2] }}>
      {PREFERENCES.map((option) => {
        const selected = option === preference;
        return (
          <Pressable
            key={option}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`${option} theme`}
            onPress={() => setPreference(option)}
            style={{
              flex: 1,
              minHeight: touchTarget,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: radius.full,
              backgroundColor: selected ? colors.action.primary : colors.surface.primary,
              borderWidth: borderWidth.thin,
              borderColor: selected ? colors.action.primary : colors.border.strong,
            }}
          >
            <Text variant="bodyStrong" color={selected ? 'onPrimary' : 'primary'}>
              {option[0].toUpperCase() + option.slice(1)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
