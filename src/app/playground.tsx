import { useState } from 'react';
import { View } from 'react-native';

import { Card, Chip, Row, Screen, SegmentedControl, Stack, Text, TextField } from '@/components/core';
import { CodeBlock } from '@/gallery/CodeBlock';
import { SPECS, writeCode, type Knob, type Spec, type Values } from '@/gallery/playgroundSpecs';
import { ThemeSwitcher } from '@/gallery/ThemeSwitcher';
import { useBreakpoint, useTheme } from '@/theme';

function KnobControl({ knob, value, onChange }: { knob: Knob; value: string | boolean; onChange: (value: string | boolean) => void }) {
  if (knob.kind === 'text') {
    return <TextField label={knob.label} value={String(value)} onChangeText={onChange} autoCorrect={false} />;
  }
  if (knob.kind === 'flag') {
    return <Chip label={knob.label} selected={Boolean(value)} onPress={() => onChange(!value)} accessibilityHint="Toggle" />;
  }
  return (
    <Stack gap={2}>
      <Text variant="label">{knob.label}</Text>
      {knob.options.length <= 3 ? (
        <SegmentedControl
          accessibilityLabel={knob.label}
          options={knob.options.map((option) => ({ value: option, label: option }))}
          value={String(value)}
          onValueChange={onChange}
        />
      ) : (
        <Row gap={2} wrap accessibilityLabel={knob.label}>
          {knob.options.map((option) => (
            <Chip key={option} label={option} selected={value === option} onPress={() => onChange(option)} />
          ))}
        </Row>
      )}
    </Stack>
  );
}

export default function Playground() {
  const theme = useTheme();
  const { space } = theme;
  const expanded = useBreakpoint() === 'expanded';
  const [current, setCurrent] = useState<Spec>(SPECS[0]);
  // Each component keeps its own settings while you look at another.
  const [store, setStore] = useState<Record<string, Values>>({});

  const values: Values = store[current.name] ?? current.defaults;
  const set = (key: string, value: string | boolean) => setStore({ ...store, [current.name]: { ...values, [key]: value } });

  const code = writeCode(current.name, current.props(values));
  const facts = current.facts(values, theme);

  const controls = (
    <Stack gap={5}>
      <Stack gap={2}>
        <Text variant="label">Component</Text>
        <Row gap={2} wrap accessibilityLabel="Component">
          {SPECS.map((spec) => (
            <Chip key={spec.name} label={spec.name} selected={spec.name === current.name} onPress={() => setCurrent(spec)} />
          ))}
        </Row>
      </Stack>
      <Card variant="outlined" padding="lg">
        <Stack gap={4}>
          <Text variant="heading3">Props</Text>
          {current.knobs.map((knob) => (
            <KnobControl key={knob.key} knob={knob} value={values[knob.key]} onChange={(value) => set(knob.key, value)} />
          ))}
        </Stack>
      </Card>
    </Stack>
  );

  const output = (
    <Stack gap={5}>
      <Stack gap={2}>
        <Text variant="heading2">{current.name}</Text>
        <Text color="secondary">{current.summary}</Text>
      </Stack>
      <Card variant="inset" padding="xl">
        <View style={{ minHeight: space[16], justifyContent: 'center' }} accessibilityLiveRegion="polite">
          {current.render(values)}
        </View>
      </Card>
      <Stack gap={2}>
        <Text variant="label">Code</Text>
        <CodeBlock code={code} />
      </Stack>
      <Card variant="outlined" padding="lg">
        <Stack gap={3}>
          <Text variant="heading3">Accessibility, right now</Text>
          <Text variant="bodySmall" color="secondary">
            These are measured from the current theme and props, so switch the style or the colour scheme and watch them move.
          </Text>
          {facts.map((fact) => (
            <View key={fact.label} accessible accessibilityLabel={`${fact.label}, ${fact.value}`} style={{ gap: space[1] }}>
              <Text variant="label" color="secondary">
                {fact.label}
              </Text>
              <Text variant="bodySmall">{fact.value}</Text>
            </View>
          ))}
        </Stack>
      </Card>
      <Card variant="outlined" padding="lg">
        <Stack gap={2}>
          <Text variant="heading3">Tokens it draws from</Text>
          {current.tokens(values).map((token) => (
            <Text key={token} variant="code">
              {token}
            </Text>
          ))}
        </Stack>
      </Card>
    </Stack>
  );

  return (
    <Screen width="wide">
      <Stack gap={5}>
        <Text variant="heading1">Playground</Text>
        <Text color="secondary">Change a component&apos;s props and see the live result, the code to write it, and the accessibility facts. Nothing here can break; it is only a preview.</Text>
        <ThemeSwitcher />
        {expanded ? (
          <Row gap={8} align="start">
            <View style={{ flex: 2 }}>{controls}</View>
            <View style={{ flex: 3 }}>{output}</View>
          </Row>
        ) : (
          <Stack gap={6}>
            {controls}
            {output}
          </Stack>
        )}
      </Stack>
    </Screen>
  );
}
