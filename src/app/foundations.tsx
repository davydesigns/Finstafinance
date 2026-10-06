import { ScrollView, Text, View } from 'react-native';

import {
  contrastPairs,
  useTheme,
  type TypeVariant,
} from '@/theme';
import { ThemeSwitcher } from '@/gallery/ThemeSwitcher';
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
      maxFontSizeMultiplier={t.heading2.maxFontSizeMultiplier}
      style={[t.heading2, { color: colors.text.primary, marginTop: space[8], marginBottom: space[3] }]}
    >
      {children}
    </Text>
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
              borderColor: colors.border.default,
            }}
          >
            <Text maxFontSizeMultiplier={t.bodySmall.maxFontSizeMultiplier} style={[t.bodySmall, { flex: 1, color: fg }]}>
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
        borderColor: colors.border.default,
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
      <Swatch label="background.primary" color={c.background.primary} onColor={c.text.primary} />
      <Swatch label="background.secondary" color={c.background.secondary} onColor={c.text.primary} />
      <Swatch label="surface.primary" color={c.surface.primary} onColor={c.text.primary} />
      <Swatch label="surface.elevated" color={c.surface.elevated} onColor={c.text.primary} />
      <Swatch label="action.primary" color={c.action.primary} onColor={c.action.onPrimary} />
      <Swatch label="action.subtle" color={c.action.subtle} onColor={c.action.onSubtle} />
      <Swatch label="status.success" color={c.status.success.background} onColor={c.status.success.text} />
      <Swatch label="status.warning" color={c.status.warning.background} onColor={c.status.warning.text} />
      <Swatch label="status.danger" color={c.status.danger.background} onColor={c.status.danger.text} />
      <Swatch label="status.info" color={c.status.info.background} onColor={c.status.info.text} />
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
            <Text maxFontSizeMultiplier={typography.caption.maxFontSizeMultiplier} style={[typography.caption, { color: colors.text.secondary }]}>
              {variant} · {style.fontSize}/{style.lineHeight} · {style.fontWeight}
            </Text>
            <Text maxFontSizeMultiplier={style.maxFontSizeMultiplier} style={[style, { color: colors.text.primary }]}>
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
          <Text maxFontSizeMultiplier={t.caption.maxFontSizeMultiplier} style={[t.caption, { width: 72, color: colors.text.secondary }]}>
            space[{key}] {value}
          </Text>
          <View style={{ width: Math.max(value, 1), height: 12, backgroundColor: colors.action.primary, borderRadius: 2 }} />
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
            <View style={{ width: 56, height: 56, borderRadius: value, backgroundColor: colors.action.subtle, borderWidth: 2, borderColor: colors.action.primary }} />
            <Text maxFontSizeMultiplier={t.caption.maxFontSizeMultiplier} style={[t.caption, { color: colors.text.secondary }]}>
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
              { width: 72, height: 72, borderRadius: radius.md, backgroundColor: colors.surface.elevated, alignItems: 'center', justifyContent: 'center' },
            ]}
          >
            <Text maxFontSizeMultiplier={t.caption.maxFontSizeMultiplier} style={[t.caption, { color: colors.text.primary }]}>
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
