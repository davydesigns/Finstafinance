import { Pressable, ScrollView, Text, View } from 'react-native';

import {
  contrastPairs,
  useTheme,
  useThemePreference,
  type ThemePreference,
  type TypeVariant,
} from '@/theme';
import { contrastRatio, wcagLevel } from '@/utils/contrast';

/**
 * Foundations gallery. Uses plain React Native <Text>/<View> on purpose:
 * the design system's own Text and Card components don't exist yet (Phase 2).
 */

function SectionTitle({ children }: { children: string }) {
  const { colors, typography: t, space } = useTheme();
  return (
    <Text
      accessibilityRole="header"
      maxFontSizeMultiplier={t.title2.maxFontSizeMultiplier}
      style={[t.title2, { color: colors.textPrimary, marginTop: space[8], marginBottom: space[3] }]}
    >
      {children}
    </Text>
  );
}

const PREFERENCES: ThemePreference[] = ['system', 'light', 'dark'];

function ThemeSwitcher() {
  const { colors, radius, space, typography: t, touchTarget } = useTheme();
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
              backgroundColor: selected ? colors.primary : colors.surface,
              borderWidth: 1,
              borderColor: selected ? colors.primary : colors.borderStrong,
            }}
          >
            <Text
              maxFontSizeMultiplier={t.bodyStrong.maxFontSizeMultiplier}
              style={[t.bodyStrong, { color: selected ? colors.onPrimary : colors.textPrimary }]}
            >
              {option[0].toUpperCase() + option.slice(1)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ContrastTable() {
  const { colors, typography: t, space, radius } = useTheme();
  return (
    <View style={{ gap: space[2] }}>
      {contrastPairs.map((pair) => {
        const fg = pair.fg(colors);
        const bg = pair.bg(colors);
        const ratio = contrastRatio(fg, bg);
        const pass = ratio >= pair.min;
        return (
          <View
            key={pair.label}
            accessible
            accessibilityLabel={`${pair.label}. Contrast ${ratio.toFixed(1)} to 1. ${pass ? 'Passes' : 'Fails'} the ${pair.min} to 1 requirement.`}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: space[3],
              padding: space[3],
              borderRadius: radius.md,
              backgroundColor: bg,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text maxFontSizeMultiplier={t.callout.maxFontSizeMultiplier} style={[t.callout, { flex: 1, color: fg }]}>
              {pair.label}
            </Text>
            {/* Status is conveyed by the word, never colour alone. */}
            <Text maxFontSizeMultiplier={t.caption.maxFontSizeMultiplier} style={[t.caption, { color: fg }]}>
              {ratio.toFixed(1)}:1 {pass ? (pair.min === 3 ? 'UI ✓' : wcagLevel(ratio)) : 'FAIL'}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function Swatch({ label, color, onColor }: { label: string; color: string; onColor: string }) {
  const { typography: t, space, radius, colors } = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={`${label}, ${color}`}
      style={{
        width: '48%',
        minHeight: 72,
        padding: space[3],
        borderRadius: radius.md,
        backgroundColor: color,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'flex-end',
      }}
    >
      <Text maxFontSizeMultiplier={t.caption.maxFontSizeMultiplier} style={[t.caption, { color: onColor }]}>
        {label}
      </Text>
    </View>
  );
}

function Palette() {
  const { colors: c, space } = useTheme();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[2], justifyContent: 'space-between' }}>
      <Swatch label="background" color={c.background} onColor={c.textPrimary} />
      <Swatch label="surface" color={c.surface} onColor={c.textPrimary} />
      <Swatch label="surfaceRaised" color={c.surfaceRaised} onColor={c.textPrimary} />
      <Swatch label="primary" color={c.primary} onColor={c.onPrimary} />
      <Swatch label="primarySubtle" color={c.primarySubtle} onColor={c.onPrimarySubtle} />
      <Swatch label="success" color={c.status.success.bg} onColor={c.status.success.fg} />
      <Swatch label="warning" color={c.status.warning.bg} onColor={c.status.warning.fg} />
      <Swatch label="danger" color={c.status.danger.bg} onColor={c.status.danger.fg} />
      <Swatch label="info" color={c.status.info.bg} onColor={c.status.info.fg} />
    </View>
  );
}

function TypeScale() {
  const { colors, typography, space } = useTheme();
  const variants = Object.keys(typography) as TypeVariant[];
  return (
    <View style={{ gap: space[4] }}>
      {variants.map((variant) => {
        const style = typography[variant];
        return (
          <View key={variant}>
            <Text maxFontSizeMultiplier={typography.caption.maxFontSizeMultiplier} style={[typography.caption, { color: colors.textSecondary }]}>
              {variant} · {style.fontSize}/{style.lineHeight} · {style.fontWeight}
            </Text>
            <Text maxFontSizeMultiplier={style.maxFontSizeMultiplier} style={[style, { color: colors.textPrimary }]}>
              {variant.startsWith('money') ? '$12,480.50' : 'Your balance is safe'}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function SpacingRamp() {
  const { colors, space, typography: t } = useTheme();
  return (
    <View style={{ gap: space[2] }}>
      {Object.entries(space).map(([key, value]) => (
        <View key={key} style={{ flexDirection: 'row', alignItems: 'center', gap: space[3] }}>
          <Text maxFontSizeMultiplier={t.caption.maxFontSizeMultiplier} style={[t.caption, { width: 72, color: colors.textSecondary }]}>
            space[{key}] {value}
          </Text>
          <View style={{ width: Math.max(value, 1), height: 12, backgroundColor: colors.primary, borderRadius: 2 }} />
        </View>
      ))}
    </View>
  );
}

function RadiusAndElevation() {
  const { colors, radius, elevation, space, typography: t } = useTheme();
  return (
    <>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
        {Object.entries(radius).map(([key, value]) => (
          <View key={key} style={{ alignItems: 'center', gap: space[1] }}>
            <View style={{ width: 56, height: 56, borderRadius: value, backgroundColor: colors.primarySubtle, borderWidth: 2, borderColor: colors.primary }} />
            <Text maxFontSizeMultiplier={t.caption.maxFontSizeMultiplier} style={[t.caption, { color: colors.textSecondary }]}>
              {key}
            </Text>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[4], marginTop: space[6] }}>
        {Object.entries(elevation).map(([key, style]) => (
          <View
            key={key}
            style={[
              style,
              { width: 72, height: 72, borderRadius: radius.md, backgroundColor: colors.surfaceRaised, alignItems: 'center', justifyContent: 'center' },
            ]}
          >
            <Text maxFontSizeMultiplier={t.caption.maxFontSizeMultiplier} style={[t.caption, { color: colors.textPrimary }]}>
              {key}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}

export default function Foundations() {
  const { space } = useTheme();
  return (
    <ScrollView contentContainerStyle={{ padding: space[4], paddingBottom: space[16] }}>
      <SectionTitle>Theme</SectionTitle>
      <ThemeSwitcher />
      <SectionTitle>Colour roles</SectionTitle>
      <Palette />
      <SectionTitle>Contrast (WCAG)</SectionTitle>
      <ContrastTable />
      <SectionTitle>Typography</SectionTitle>
      <TypeScale />
      <SectionTitle>Spacing</SectionTitle>
      <SpacingRamp />
      <SectionTitle>Radius and elevation</SectionTitle>
      <RadiusAndElevation />
    </ScrollView>
  );
}
