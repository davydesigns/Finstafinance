import { View } from 'react-native';

import { AILabel } from '@/components/ai';
import { Banner, Button, Card, Chip, Row, Screen, Stack, Text } from '@/components/core';
import { AmountInput, MoneyText } from '@/components/fintech';
import { contrastPairs } from '@/dev/contrastPairs';
import { DEPTH_FLOOR } from '@/dev/depthFloor';
import { DepthRoles } from '@/gallery/DepthRoles';
import { Section } from '@/gallery/GalleryScreen';
import { ThemeSwitcher } from '@/gallery/ThemeSwitcher';
import { allThemes, softDarkTheme, softLightTheme, ThemeScope, useBreakpoint, usePrefersMoreContrast, useTheme, type StyleName } from '@/theme';
import { compositeOver, contrastRatio } from '@/utils/contrast';
import { money } from '@/utils/money';

const noop = () => undefined;

/** One small, real screen's worth of components. Drawn twice, once per style, so the only difference is the style. */
function Sample({ style }: { style: StyleName }) {
  const { colors, space, radius, borderWidth } = useTheme();
  return (
    <View
      style={{
        backgroundColor: colors.background.primary,
        borderRadius: radius.xl,
        borderWidth: borderWidth.thin,
        borderColor: colors.border.default,
        padding: space[5],
        gap: space[4],
        flex: 1,
      }}
    >
      <Text variant="heading3">{style === 'soft' ? 'Soft (2.0)' : 'Clean (1.x)'}</Text>
      <Card variant="elevated" padding="lg">
        <Stack gap={3}>
          <Text variant="bodySmall" color="secondary">
            Available balance
          </Text>
          <MoneyText amount={money(824012, 'USD')} variant="moneyLarge" />
          <Row gap={3} wrap>
            <Button label="Transfer" size="small" onPress={noop} />
            <Button label="Pay" size="small" variant="secondary" onPress={noop} />
          </Row>
        </Stack>
      </Card>
      <AmountInput label="Amount" currency="USD" locale="en-US" value="125.00" onValueChange={noop} />
      <Row gap={2} wrap>
        <Chip label="This month" selected onPress={noop} />
        <Chip label="Last month" onPress={noop} />
        <Chip label="Ask about it" tone="ai" icon="sparkles" onPress={noop} />
      </Row>
      <Card tone="ai" variant="outlined">
        <Stack gap={2}>
          <AILabel />
          <Text>Dining is 18% higher than your usual. Want to see the three biggest charges?</Text>
        </Stack>
      </Card>
    </View>
  );
}

function SideBySide() {
  const compact = useBreakpoint() === 'compact';
  return (
    <View style={{ flexDirection: compact ? 'column' : 'row', gap: 16 }}>
      <ThemeScope style="clean">
        <Sample style="clean" />
      </ThemeScope>
      <ThemeScope style="soft">
        <Sample style="soft" />
      </ThemeScope>
    </View>
  );
}

function SoftFrame() {
  const { colors, space, radius } = useTheme();
  return (
    <View style={{ backgroundColor: colors.background.primary, borderRadius: radius.xl, padding: space[5] }}>
      <DepthRoles />
    </View>
  );
}

function SoftRoles() {
  return (
    <ThemeScope style="soft">
      <SoftFrame />
    </ThemeScope>
  );
}

/** The numbers behind the claims, measured from the real tokens each time this page renders. */
function useMeasured() {
  const soft = [softLightTheme, softDarkTheme];
  const lowest = (min: 3 | 4.5) => {
    let worst = { ratio: Infinity, label: '' };
    for (const theme of soft) {
      for (const pair of contrastPairs) {
        if (pair.min !== min) continue;
        const ratio = contrastRatio(pair.fg(theme.colors), pair.bg(theme.colors));
        if (ratio < worst.ratio) worst = { ratio, label: `${pair.label}, ${theme.name}` };
      }
    }
    return worst;
  };
  const depth = (theme: (typeof soft)[number]) => {
    const surface = theme.colors.surface.primary;
    const ink = theme.depthInk!;
    return {
      shade: contrastRatio(compositeOver(ink.shade.color, ink.shade.alpha, surface), surface),
      light: contrastRatio(compositeOver(ink.light.color, ink.light.alpha, surface), surface),
    };
  };
  return {
    text: lowest(4.5),
    edge: lowest(3),
    checks: contrastPairs.length * allThemes.length,
    light: depth(softLightTheme),
    dark: depth(softDarkTheme),
  };
}

const ratio = (n: number) => `${n.toFixed(2)}:1`;

function Rule({ title, children }: { title: string; children: string }) {
  return (
    <Stack gap={1}>
      <Text variant="bodyStrong">{title}</Text>
      <Text variant="bodySmall" color="secondary">
        {children}
      </Text>
    </Stack>
  );
}

function Contract() {
  const m = useMeasured();
  return (
    <Card variant="outlined" padding="lg">
      <Stack gap={5}>
        <Rule title="1. Shadows are never the only signal">
          {`Every control keeps a real edge or a solid fill. Buttons, chips, segments and inputs carry a border at 3:1 or better; "selected" is a solid colour, not a shadow; AI content keeps its violet edge. Enforced by src/dev/softEdges.test.tsx.`}
        </Rule>
        <Rule title="2. The text contract is unchanged">
          {`All ${contrastPairs.length} text and boundary pairs are checked in all four themes (${m.checks} checks). Lowest text pair in Soft: ${ratio(m.text.ratio)} (${m.text.label}), against a 4.5:1 requirement.`}
        </Rule>
        <Rule title="3. Edges meet non-text contrast">
          {`Lowest boundary or focus pair in Soft: ${ratio(m.edge.ratio)} (${m.edge.label}), against a 3:1 requirement (WCAG 1.4.11).`}
        </Rule>
        <Rule title="4. Depth has a measured floor">
          {`Not a WCAG rule, so the design team set its own: the dark shadow must read at ${DEPTH_FLOOR.shade}:1 or better over the surface and the highlight at ${DEPTH_FLOOR.light}:1. Light mode measures ${ratio(m.light.shade)} and ${ratio(m.light.light)}; dark mode ${ratio(m.dark.shade)} and ${ratio(m.dark.light)}. A later tweak that flattens the style fails the build.`}
        </Rule>
        <Rule title="5. State is never shadow alone">
          {`Pressing also changes colour. A solid button goes flat and darker; a tinted control presses in and changes fill. Focus is a 2pt ring in the focus colour, drawn outside the shadow.`}
        </Rule>
        <Rule title="6. Soft steps aside when asked">
          {`If the device asks for more contrast (iOS Increase Contrast, prefers-contrast: more) or forces colours (Windows high contrast), Soft pauses and Clean is shown. Shadows are the first thing those modes remove.`}
        </Rule>
      </Stack>
    </Card>
  );
}

function DeviceStatus() {
  const more = usePrefersMoreContrast();
  return (
    <Banner tone={more ? 'warning' : 'info'} title={more ? 'Your device asks for more contrast' : 'Your device is not asking for more contrast'}>
      {more ? 'Soft is paused for you and Clean is showing.' : 'Soft is available. If you turn on a high-contrast mode, this page will switch to Clean by itself.'}
    </Banner>
  );
}

export default function SoftStyle() {
  return (
    <Screen width="wide">
      <Text variant="heading1">Soft: Finsta 2.0</Text>
      <Text color="secondary">
        A second visual style. Same roles, same colours, same contrast contract; a different material. Soft pushes surfaces out of the page and presses fields into it, and keeps an edge or a fill wherever meaning depends on one.
      </Text>

      <Section title="Try it" note="This switches the whole app, every screen. The choice also works as a link: add ?style=soft to any address.">
        <Stack gap={4} style={{ maxWidth: 480 }}>
          <ThemeSwitcher />
        </Stack>
        <DeviceStatus />
      </Section>

      <Section title="Same product, two materials" note="The two panels render the same components. The only difference is the style.">
        <SideBySide />
      </Section>

      <Section title="Five depth roles" note="Components ask for a role, not a shadow. The style decides what the role looks like. Clean keeps most roles flat; Soft gives each one a shape.">
        <SoftRoles />
        <Text variant="caption" color="secondary">
          Shown in Soft. In Clean, surface, control and field are flat, floating is a single soft shadow, and pressed changes colour only.
        </Text>
      </Section>

      <Section title="The accessibility contract" note="Neumorphism's known problem is that edges disappear. These rules are how Soft avoids it. The numbers below are measured from the live tokens.">
        <Contract />
      </Section>

      <Section title="Honest limits">
        <Card variant="inset" padding="lg">
          <Stack gap={3}>
            <Text variant="bodySmall">Soft is not the choice for dense data tables, where edges and rules do more work than depth.</Text>
            <Text variant="bodySmall">In dark mode the highlight can only be faint, so depth there is quieter and the edges do more of the work.</Text>
            <Text variant="bodySmall">Inset shadows in React Native need Android 10 or newer. On older Android, fields and pressed states lose their depth but keep every border and colour change, which is the design working as intended.</Text>
            <Text variant="bodySmall">Soft has been checked in a desktop browser. It has not yet been tested on a physical iPhone or Android device, with a screen reader, or for scroll performance in very long lists of shadowed rows.</Text>
            <Text variant="bodySmall">Nobody has yet been asked whether they prefer it. Whether Soft reads as calm and trustworthy for a bank is a hypothesis for user research, not a result.</Text>
          </Stack>
        </Card>
      </Section>
    </Screen>
  );
}
