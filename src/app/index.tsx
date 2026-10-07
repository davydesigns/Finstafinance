import { Link, useRouter, type Href } from 'expo-router';
import { Linking, Pressable, View } from 'react-native';

import { Sparkline } from '@/components/charts';
import { Button, Card, DesignedBy, Icon, ProgressBar, Row, Screen, Stack, Text } from '@/components/core';
import { MoneyText, TransactionRow } from '@/components/fintech';
import { contrastPairs } from '@/dev/contrastPairs';
import { BUDGETS, INITIAL_TRANSACTIONS } from '@/demo/data';
import { rowProps } from '@/demo/rowProps';
import { balanceTrend, spentByCategory } from '@/demo/selectors';
import { ThemeSwitcher } from '@/gallery/ThemeSwitcher';
import { allThemes, useBreakpoint, useTheme } from '@/theme';
import { formatMoney, money } from '@/utils/money';

const SOURCE_URL = 'https://github.com/davydesigns/Finstafinance';

interface Entry {
  href: Href;
  title: string;
  subtitle: string;
}

const DEMO: Entry[] = [
  { href: '/accounts', title: 'Overview', subtitle: 'Balance, spending chart, budgets, an AI insight' },
  { href: '/send', title: 'Send money', subtitle: 'Four steps, with an extra check for larger amounts' },
  { href: '/activity', title: 'Activity', subtitle: 'Search, filters, details, an empty state that helps' },
  { href: '/assistant', title: 'Assistant', subtitle: 'AI disclosure, streaming, proposals, a person one tap away' },
  { href: '/fraud', title: 'Security', subtitle: 'A specific fraud alert, balanced, with a human exit' },
];

const SYSTEM: Entry[] = [
  { href: '/foundations', title: 'Foundations', subtitle: 'Colour roles, type, spacing, radius, depth, the contrast contract' },
  { href: '/gallery', title: 'Design System Gallery', subtitle: 'Text, Button and Card: every variation' },
  { href: '/fintech', title: 'Fintech components', subtitle: 'Money, accounts, transactions, amount input, status' },
  { href: '/charts', title: 'Charts and states', subtitle: 'Charts with text alternatives, progress, loading, empty, fields' },
  { href: '/ai', title: 'AI components', subtitle: 'AI tokens, primitives and fintech components' },
  { href: '/soft', title: 'Soft: Finsta 2.0', subtitle: 'A second visual style: accessible neumorphism' },
  { href: '/playground', title: 'Playground', subtitle: 'Change a component\'s props; see the code and the accessibility facts' },
];

const TOUR: { title: string; body: string; href: Href; action: string }[] = [
  {
    title: 'Open the overview',
    body: 'A chart that states its point in words, budgets that never rely on colour alone, and an AI insight that explains itself.',
    href: '/accounts',
    action: 'Open the demo',
  },
  {
    title: 'Send $1,200 to Sam Rivera',
    body: 'Larger amounts ask you to type the recipient\'s name. On the review step, switch on "Simulate a bank error" to see the recovery.',
    href: '/send',
    action: 'Try a transfer',
  },
  {
    title: 'Switch to Soft, then dark',
    body: 'Soft is the 2.0 style: depth without losing edges. Use the switchers on this page, or open the full explanation.',
    href: '/soft',
    action: 'See Soft',
  },
  {
    title: 'Break a component',
    body: 'Change a button\'s props in the playground and watch the code and the accessibility facts update with it.',
    href: '/playground',
    action: 'Open the playground',
  },
];

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <Card variant="outlined" padding="md" style={{ flexGrow: 1, flexBasis: 200 }}>
      <Stack gap={1} accessible accessibilityLabel={`${value} ${label}`}>
        <Text variant="heading1">{value}</Text>
        <Text variant="bodySmall" color="secondary">
          {label}
        </Text>
      </Stack>
    </Card>
  );
}

function LinkCard({ entry }: { entry: Entry }) {
  const { radius, touchTarget } = useTheme();
  return (
    <Link href={entry.href} asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`${entry.title}: ${entry.subtitle}`}
        style={{ minHeight: touchTarget, borderRadius: radius.lg }}
      >
        {({ pressed }) => (
          <Card pressed={pressed} padding="md">
            <Row gap={3}>
              <Stack gap={0} style={{ flex: 1 }}>
                <Text variant="bodyStrong">{entry.title}</Text>
                <Text variant="bodySmall" color="secondary">
                  {entry.subtitle}
                </Text>
              </Stack>
              <Icon name="chevron-forward" size="small" color="secondary" />
            </Row>
          </Card>
        )}
      </Pressable>
    </Link>
  );
}

/** A small, real slice of the product, drawn from the same components and data as the demo. */
function Preview() {
  const { space } = useTheme();
  const total = 2482042;
  const trend = balanceTrend(total);
  const dining = spentByCategory(INITIAL_TRANSACTIONS).dining;
  const usd = (minor: number) => formatMoney(money(minor, 'USD'), { locale: 'en-US' });
  const recent = INITIAL_TRANSACTIONS.filter((t) => ['t3', 't5'].includes(t.id));

  return (
    <Card variant="elevated" padding="lg">
      <Stack gap={4}>
        <Stack gap={1}>
          <Text variant="bodySmall" color="secondary">
            Total balance
          </Text>
          <MoneyText variant="moneyLarge" amount={money(total, 'USD')} />
        </Stack>
        <Row gap={3} wrap>
          <Sparkline values={trend.values} label={`Balance up ${trend.percent.toFixed(1)}% over 30 days`} />
          <Row gap={1}>
            <Icon name="trending-up" size="small" tone="success" />
            <Text variant="bodySmall" tone="success">
              {`Up ${trend.percent.toFixed(1)}% in 30 days`}
            </Text>
          </Row>
        </Row>
        <ProgressBar
          label="Dining"
          value={dining}
          max={BUDGETS.dining}
          valueLabel={`${usd(dining)} of ${usd(BUDGETS.dining)}`}
          tone="danger"
          statusLabel={`Over budget by ${usd(dining - BUDGETS.dining)}`}
        />
        <View style={{ marginHorizontal: -space[2] }}>
          {recent.map((t) => (
            <TransactionRow key={t.id} {...rowProps(t)} />
          ))}
        </View>
      </Stack>
    </Card>
  );
}

export default function Landing() {
  const router = useRouter();
  const { space } = useTheme();
  const expanded = useBreakpoint() === 'expanded';
  const checks = contrastPairs.length * allThemes.length;

  const hero = (
    <Stack gap={5} style={{ flex: 1 }}>
      <Text variant="label" color="link">
        FINSTA · FINTECH DESIGN SYSTEM · VERSION 2.0
      </Text>
      <Text variant="display" accessibilityRole="header" aria-level={1}>
        A banking design system you can actually use.
      </Text>
      <Text color="secondary">
        Tokens, accessible components, AI patterns and a working demo app, built in React Native. Two visual styles, light and dark, with contrast checked on every change.
      </Text>
      <Row gap={3} wrap>
        <Button label="Open the demo app" onPress={() => router.push('/accounts')} />
        <Button label="Explore the system" variant="secondary" onPress={() => router.push('/foundations')} />
      </Row>
      <Stack gap={2}>
        <Text variant="label">Change the look</Text>
        <ThemeSwitcher />
      </Stack>
    </Stack>
  );

  return (
    <Screen width="wide">
      <Stack gap={10}>
        {expanded ? (
          <Row gap={10} align="center">
            {hero}
            <View style={{ flex: 1, maxWidth: 420 }}>
              <Preview />
            </View>
          </Row>
        ) : (
          <Stack gap={8}>
            {hero}
            <Preview />
          </Stack>
        )}

        <Stack gap={3}>
          <Row gap={3} wrap align="stretch">
            <Stat value="4" label="themes: Clean and Soft, each in light and dark" />
            <Stat value={String(checks)} label="contrast checks, run on every change" />
            <Stat value="35+" label="components, from buttons to charts and AI patterns" />
            <Stat value="9" label="AI principles, each traced to evidence" />
          </Row>
          <Text variant="caption" color="secondary">
            Built to WCAG 2.2 AA. That is a self-assessment backed by automated checks, not a certification. It has not yet been tested on physical devices or with screen readers.
          </Text>
        </Stack>

        <Stack gap={4}>
          <Text variant="heading2">A three-minute tour</Text>
          <Row gap={3} wrap align="stretch">
            {TOUR.map((step, index) => (
              <Card key={step.title} variant="outlined" padding="lg" style={{ flexGrow: 1, flexBasis: 240 }}>
                <Stack gap={3} style={{ flex: 1 }}>
                  <Text variant="label" color="link">{`Step ${index + 1}`}</Text>
                  <Text variant="heading3">{step.title}</Text>
                  <Text variant="bodySmall" color="secondary" style={{ flex: 1 }}>
                    {step.body}
                  </Text>
                  <Button label={step.action} variant="secondary" size="small" onPress={() => router.push(step.href)} />
                </Stack>
              </Card>
            ))}
          </Row>
        </Stack>

        <Row gap={8} wrap align="start">
          <Stack gap={3} style={{ flex: 1, flexBasis: 320 }}>
            <Text variant="heading2">The demo app</Text>
            <Text variant="bodySmall" color="secondary">
              A working banking app on sample data. Nothing is real; everything is built from the system.
            </Text>
            {DEMO.map((entry) => (
              <LinkCard key={entry.title} entry={entry} />
            ))}
          </Stack>
          <Stack gap={3} style={{ flex: 1, flexBasis: 320 }}>
            <Text variant="heading2">The system</Text>
            <Text variant="bodySmall" color="secondary">
              Every token and component, documented where you can use it.
            </Text>
            {SYSTEM.map((entry) => (
              <LinkCard key={entry.title} entry={entry} />
            ))}
          </Stack>
        </Row>

        <Stack gap={3}>
          <Button label="View the source on GitHub" variant="secondary" onPress={() => void Linking.openURL(SOURCE_URL)} />
          {/* The credit lives here, in the footer: quiet, and away from every product screen. */}
          <Stack style={{ marginTop: space[4] }}>
            <DesignedBy />
          </Stack>
        </Stack>
      </Stack>
    </Screen>
  );
}
