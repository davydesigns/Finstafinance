import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useTheme } from '@/theme';

export default function GalleryHome() {
  const { colors, space, radius, typography, touchTarget } = useTheme();
  const t = typography;

  return (
    <ScrollView contentContainerStyle={{ padding: space[4], gap: space[3] }}>
      <Text style={[t.title1, { color: colors.textPrimary }]} accessibilityRole="header" maxFontSizeMultiplier={t.title1.maxFontSizeMultiplier}>
        Fintech design system
      </Text>
      <Text style={[t.body, { color: colors.textSecondary }]} maxFontSizeMultiplier={t.body.maxFontSizeMultiplier}>
        React Native + Expo. Tokens first, then components.
      </Text>

      <View style={{ gap: space[2], marginTop: space[4] }}>
        <Link href="/foundations" asChild>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Foundations: colour, type, spacing, radius and elevation"
            style={({ pressed }) => ({
              minHeight: touchTarget,
              justifyContent: 'center',
              padding: space[4],
              borderRadius: radius.md,
              backgroundColor: pressed ? colors.primarySubtle : colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
            })}
          >
            <Text style={[t.bodyStrong, { color: colors.textPrimary }]} maxFontSizeMultiplier={t.bodyStrong.maxFontSizeMultiplier}>
              Foundations
            </Text>
            <Text style={[t.callout, { color: colors.textSecondary }]} maxFontSizeMultiplier={t.callout.maxFontSizeMultiplier}>
              Colour, type, spacing, radius, elevation
            </Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}
