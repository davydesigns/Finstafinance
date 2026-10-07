import { useState } from 'react';

import { BarChart, Sparkline } from '@/components/charts';
import { Avatar, Button, Card, EmptyState, LoadingRegion, ProgressBar, Row, Skeleton, Stack, Stepper, Text, TextField } from '@/components/core';
import { GalleryScreen, Section } from '@/gallery/GalleryScreen';
import { ThemeSwitcher } from '@/gallery/ThemeSwitcher';
import { useTheme } from '@/theme';

const WEEK = [
  { label: 'Thu', value: 15759, valueLabel: '$157.59' },
  { label: 'Fri', value: 25975, valueLabel: '$259.75' },
  { label: 'Sat', value: 7119, valueLabel: '$71.19' },
  { label: 'Sun', value: 9224, valueLabel: '$92.24' },
  { label: 'Mon', value: 4630, valueLabel: '$46.30' },
  { label: 'Tue', value: 9639, valueLabel: '$96.39' },
  { label: 'Wed', value: 2390, valueLabel: '$23.90' },
];

const noop = () => undefined;

export default function ChartsAndStates() {
  const { space } = useTheme();
  const [step, setStep] = useState(1);
  const [value, setValue] = useState('');

  return (
    <GalleryScreen>
      <Text variant="heading1">Charts and states</Text>
      <Text color="secondary">Showing data, and the moments between: loading, empty, in progress, and filling in a field.</Text>
      <Stack style={{ marginTop: space[4] }}>
        <ThemeSwitcher />
      </Stack>

      <Section
        title="BarChart"
        note="A chart is only accessible if it says what it shows. The point is written as its text alternative, the highlighted value is labelled as well as coloured, and every value is in a table one tap away."
      >
        <Card variant="outlined" padding="lg">
          <BarChart title="Spending by day" summary="Highest on Friday, $259.75. $747.36 over 7 days." data={WEEK} />
        </Card>
      </Section>

      <Section title="Sparkline" note="A glance at a trend. The figure that matters is always written next to it, and the alternative text states the direction.">
        <Row gap={3}>
          <Sparkline values={[3, 4, 3.5, 5, 4.8, 6, 7]} label="Balance up 7.4% over 30 days" />
          <Text variant="bodySmall" color="secondary">
            Up 7.4% in 30 days
          </Text>
        </Row>
      </Section>

      <Section title="ProgressBar" note="Figures and a percentage are spoken. Any tone other than the default requires a word (the type enforces it), because a bar that only turns red means nothing to someone who cannot see red.">
        <Stack gap={5}>
          <ProgressBar label="Groceries" value={16719} max={40000} valueLabel="$167.19 of $400.00" />
          <ProgressBar label="Subscriptions" value={4997} max={6000} valueLabel="$49.97 of $60.00" tone="warning" statusLabel="Close to the limit" />
          <ProgressBar label="Dining" value={25015} max={22000} valueLabel="$250.15 of $220.00" tone="danger" statusLabel="Over budget by $30.15" />
          <ProgressBar label="Emergency fund" value={9000} max={9000} valueLabel="$90.00 of $90.00" tone="success" statusLabel="Goal reached" />
        </Stack>
      </Section>

      <Section title="Skeleton and LoadingRegion" note="Placeholders shaped like what is coming, so the page does not jump. A screen reader hears one 'Loading'. They hold still under reduced motion.">
        <LoadingRegion label="Loading accounts">
          <Stack gap={3}>
            <Row gap={3}>
              <Skeleton shape="circle" />
              <Stack gap={2} style={{ flex: 1 }}>
                <Skeleton width="60%" />
                <Skeleton width="40%" />
              </Stack>
            </Row>
            <Skeleton shape="block" />
          </Stack>
        </LoadingRegion>
      </Section>

      <Section title="EmptyState" note="Say what is empty and why, then offer one way forward.">
        <Card variant="outlined">
          <EmptyState icon="search" title="No matching transactions" action={{ label: 'Clear filters', onPress: noop }}>
            Try a different word, or remove a filter.
          </EmptyState>
        </Card>
      </Section>

      <Section title="Stepper" note="Where you are in a short flow, in words first. The segments are a glance.">
        <Stack gap={3}>
          <Stepper steps={['Recipient', 'Amount', 'Review', 'Done']} current={step} />
          <Row gap={2}>
            <Button label="Back" size="small" variant="secondary" disabled={step === 0} onPress={() => setStep(step - 1)} />
            <Button label="Next" size="small" disabled={step === 3} onPress={() => setStep(step + 1)} />
          </Row>
        </Stack>
      </Section>

      <Section title="Avatar" note="Initials, one colour on purpose: colour-coding people by hue would carry meaning that colour-blind users cannot read. The name is always written beside it.">
        <Row gap={3}>
          {['Sam Rivera', 'Alex Chen', 'Maya Patel'].map((name) => (
            <Row key={name} gap={2}>
              <Avatar name={name} />
              <Text variant="bodySmall">{name}</Text>
            </Row>
          ))}
        </Row>
      </Section>

      <Section title="TextField" note="Same behaviour as the amount input, for words: a 3:1 border that thickens on focus or error, an error announced when it appears, and a tap target that is the whole box.">
        <Stack gap={5}>
          <TextField label="Search people" icon="search" value={value} onChangeText={setValue} helperText="Name or email" />
          <TextField label="Recipient" value="" onChangeText={noop} errorText="Choose someone to pay." />
          <TextField label="Disabled" value="Not editable" onChangeText={noop} disabled />
        </Stack>
      </Section>
    </GalleryScreen>
  );
}
