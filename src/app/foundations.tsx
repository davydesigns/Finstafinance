import { View } from 'react-native';

import { Card, Row, Stack, Text } from '@/components/core';
import { TextBase } from '@/components/core/Text';
import { contrastPairs } from '@/dev/contrastPairs';
import { GalleryScreen, Section } from '@/gallery/GalleryScreen';
import { ThemeSwitcher } from '@/gallery/ThemeSwitcher';
import { typographyVariants, useTheme } from '@/theme';
import { contrastRatio, wcagLevel } from '@/utils/contrast';

/** Foundations gallery, built from the design system's own components and tokens. */

function ContrastTable() {
  const { colors, space, radius, borderWidth } = useTheme();
  return (
    <Stack gap={2}>
      {contrastPairs.map((pair) => {
        const fg = pair.fg(colors);
        const bg = pair.bg(colors);
        const ratio = contrastRatio(fg, bg);
        const pass = ratio >= pair.min;
        // The cell must show the pair itself, so these two colours are the data being demonstrated.
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
              borderWidth: borderWidth.thin,
              borderColor: colors.border.default,
            }}
          >
            <Text variant="bodySmall" style={{ flex: 1 }} color="primary" accessibilityElementsHidden>
              {pair.label}
            </Text>
            {/* Status is conveyed by the word, never colour alone. */}
            <Text variant="caption" accessibilityElementsHidden>
              {ratio.toFixed(1)}:1 {pass ? (pair.min === 3 ? 'UI ✓' : wcagLevel(ratio)) : 'FAIL'}
            </Text>
          </View>
        );
      })}
    </Stack>
  );
}

function Swatch({ label, color, onColor }: { label: string; color: string; onColor: string }) {
  const { space, radius, borderWidth, colors, size } = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={`${label}, ${color}`}
      style={{
        width: '48%',
        minHeight: size.minActionWidth - space[6],
        padding: space[3],
        borderRadius: radius.md,
        backgroundColor: color,
        borderWidth: borderWidth.thin,
        borderColor: colors.border.default,
        justifyContent: 'flex-end',
      }}
    >
      {/* A swatch label sits on arbitrary colours, so its colour is passed explicitly. */}
      <TextBase variant="caption" colorValue={onColor}>
        {label}
      </TextBase>
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
      <Swatch label="surface.pressed" color={c.surface.pressed} onColor={c.text.primary} />
      <Swatch label="surface.accent" color={c.surface.accent} onColor={c.text.link} />
      <Swatch label="action.primary" color={c.action.primary} onColor={c.action.onPrimary} />
      <Swatch label="action.destructive" color={c.action.destructive} onColor={c.action.onDestructive} />
      <Swatch label="status.success" color={c.status.success.background} onColor={c.status.success.text} />
      <Swatch label="status.warning" color={c.status.warning.background} onColor={c.status.warning.text} />
      <Swatch label="status.danger" color={c.status.danger.background} onColor={c.status.danger.text} />
      <Swatch label="status.info" color={c.status.info.background} onColor={c.status.info.text} />
      <Swatch label="status.neutral" color={c.status.neutral.background} onColor={c.status.neutral.text} />
    </View>
  );
}

function TypeScale() {
  const { typography } = useTheme();
  return (
    <Stack gap={4}>
      {typographyVariants.map((variant) => {
        const { fontSize, lineHeight, fontWeight } = typography[variant];
        const isMoney = variant === 'money' || variant === 'moneyLarge';
        return (
          <Stack key={variant} gap={0}>
            <Text variant="caption" color="secondary">
              {variant} · {fontSize}/{lineHeight} · {fontWeight}
            </Text>
            {isMoney ? (
              <Text variant="body">$12,480.50 (see MoneyText)</Text>
            ) : (
              <Text variant={variant}>Your balance is safe</Text>
            )}
          </Stack>
        );
      })}
    </Stack>
  );
}

function SpacingRamp() {
  const { colors, space, radius } = useTheme();
  return (
    <Stack gap={2}>
      {Object.entries(space).map(([key, value]) => (
        <Row key={key} gap={3}>
          <Text variant="caption" color="secondary" style={{ width: space[16] + space[4] }}>
            space[{key}] {value}
          </Text>
          {/* Bar length IS the token value: that is the demonstration. */}
          <View style={{ width: Math.max(value, 1), height: space[3], backgroundColor: colors.action.primary, borderRadius: radius.sm }} />
        </Row>
      ))}
    </Stack>
  );
}

function RadiusAndElevation() {
  const { colors, radius, elevation, space, borderWidth, controlHeight, size } = useTheme();
  return (
    <Stack gap={6}>
      <Row gap={3} wrap align="start">
        {Object.entries(radius).map(([key, value]) => (
          <Stack key={key} gap={1} align="center">
            <View
              style={{
                width: controlHeight.large,
                height: controlHeight.large,
                borderRadius: value,
                backgroundColor: colors.surface.accent,
                borderWidth: borderWidth.medium,
                borderColor: colors.action.primary,
              }}
            />
            <Text variant="caption" color="secondary">
              {key}
            </Text>
          </Stack>
        ))}
      </Row>
      <Row gap={4} wrap>
        {Object.entries(elevation).map(([key, style]) => (
          <View
            key={key}
            style={[
              style,
              {
                width: size.minActionWidth - space[6],
                height: size.minActionWidth - space[6],
                borderRadius: radius.md,
                backgroundColor: colors.surface.elevated,
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
          >
            <Text variant="caption">{key}</Text>
          </View>
        ))}
      </Row>
    </Stack>
  );
}

export default function Foundations() {
  return (
    <GalleryScreen>
      <Section title="Theme">
        <ThemeSwitcher />
      </Section>
      <Section title="Colour roles">
        <Palette />
      </Section>
      <Section title="Contrast (WCAG)" note="Defined in src/dev/contrastPairs.ts and enforced by npm test.">
        <ContrastTable />
      </Section>
      <Section title="Typography">
        <TypeScale />
      </Section>
      <Section title="Spacing">
        <SpacingRamp />
      </Section>
      <Section title="Radius and elevation">
        <Card variant="default">
          <RadiusAndElevation />
        </Card>
      </Section>
    </GalleryScreen>
  );
}
