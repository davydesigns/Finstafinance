import { View } from 'react-native';

import { useTheme } from '@/theme';

import { TextBase } from './Text';

/** Up to two initials from a name: "Sam Rivera" becomes "SR". */
export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return `${first}${last}`.toUpperCase();
}

/**
 * A person or payee shown as initials. Decorative: the name is always written next to it,
 * so screen readers skip it. One colour on purpose: colour-coding people by hue would carry meaning that
 * colour-blind users cannot read.
 */
export function Avatar({ name }: { name: string }) {
  const { colors, size, depth } = useTheme();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        { width: size.avatar, height: size.avatar, borderRadius: size.avatar / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface.accent },
        depth.control,
      ]}
    >
      <TextBase variant="label" colorValue={colors.text.link}>
        {initialsOf(name)}
      </TextBase>
    </View>
  );
}
