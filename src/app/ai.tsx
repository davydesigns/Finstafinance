import { useState } from 'react';
import { View } from 'react-native';

import {
  AILabel,
  ConfidenceIndicator,
  FeedbackControl,
  MessageBubble,
  StreamingText,
  ThinkingIndicator,
  type ConfidenceLevel,
} from '@/components/ai';
import { Banner, Button, Card, Chip, Disclosure, Row, Stack, Text, type BannerTone } from '@/components/core';
import { TextBase } from '@/components/core/Text';
import {
  ActionProposalCard,
  DataUseRow,
  FraudAlertCard,
  HumanHandoff,
  InsightCard,
  MoneyRangeText,
} from '@/components/fintech';
import { GalleryScreen, Section } from '@/gallery/GalleryScreen';
import { ThemeSwitcher } from '@/gallery/ThemeSwitcher';
import { useTheme } from '@/theme';
import { money } from '@/utils/money';

const usd = (minor: number) => money(minor, 'USD');
const noop = () => undefined;
const TONES: BannerTone[] = ['ai', 'info', 'success', 'warning', 'danger', 'neutral'];
const LEVELS: ConfidenceLevel[] = ['high', 'medium', 'low'];

function Swatch({ label, color, onColor }: { label: string; color: string; onColor: string }) {
  const { space, radius, borderWidth, colors, size } = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={`${label}, ${color}`}
      style={{
        flexGrow: 1,
        flexBasis: size.minContentWidth,
        minHeight: size.minActionWidth - space[6],
        padding: space[3],
        borderRadius: radius.md,
        backgroundColor: color,
        borderWidth: borderWidth.thin,
        borderColor: colors.border.default,
        justifyContent: 'flex-end',
      }}
    >
      <TextBase variant="caption" colorValue={onColor}>
        {label}
      </TextBase>
    </View>
  );
}

export default function AiGallery() {
  const { colors, space } = useTheme();
  const [replay, setReplay] = useState(0);
  const [selectedChip, setSelectedChip] = useState('This month');
  const [consent, setConsent] = useState(true);

  return (
    <GalleryScreen>
      <Text variant="heading1">AI components</Text>
      <Text color="secondary">Tokens, primitives, fintech components and patterns for trustworthy AI. Each exists because of a principle in docs/ai/01-research-brief.md.</Text>
      <Stack style={{ marginTop: space[4] }}>
        <ThemeSwitcher />
      </Stack>

      <Section title="Tokens" note="One violet hue is reserved for AI-originated content, so it is always recognisable and never confused with brand blue or status colours.">
        <Row gap={2} wrap align="stretch">
          <Swatch label="ai.accent" color={colors.ai.accent} onColor={colors.ai.subtle} />
          <Swatch label="ai.subtle" color={colors.ai.subtle} onColor={colors.ai.onSubtle} />
          <Swatch label="ai.border" color={colors.ai.border} onColor={colors.ai.subtle} />
        </Row>
        <Row gap={2} wrap align="stretch">
          {LEVELS.map((level) => (
            <Swatch key={level} label={`confidence.${level}`} color={colors.confidence[level].background} onColor={colors.confidence[level].text} />
          ))}
        </Row>
      </Section>

      <Section title="AILabel" note="Always words plus an icon. The compact form says 'AI' but is still announced in full.">
        <Row gap={3} wrap>
          <AILabel />
          <AILabel variant="compact" />
          <AILabel label="Flagged automatically" />
        </Row>
      </Section>

      <Section title="Banner" note="Icon + words in every tone. The AI tone is not dismissible by default.">
        <Stack gap={3}>
          {TONES.map((tone) => (
            <Banner key={tone} tone={tone} title={`${tone[0].toUpperCase()}${tone.slice(1)} notice`} action={{ label: 'Take action', onPress: noop }}>
              Short supporting text that explains what happened and what to do next.
            </Banner>
          ))}
        </Stack>
      </Section>

      <Section title="Chip" note="Suggestions and choices. 36pt tall with a 48pt tap area.">
        <Row gap={2} wrap>
          <Chip label="Default" onPress={noop} />
          <Chip tone="ai" label="AI suggestion" icon="sparkles" onPress={noop} />
          <Chip label="Disabled" disabled onPress={noop} />
        </Row>
        <Row gap={2} wrap>
          {['This week', 'This month', 'This year'].map((label) => (
            <Chip key={label} label={label} selected={selectedChip === label} onPress={() => setSelectedChip(label)} />
          ))}
        </Row>
      </Section>

      <Section title="Disclosure">
        <Card variant="outlined">
          <Disclosure title="Why am I seeing this?">
            <Text variant="bodySmall" color="secondary">
              Expandable content. The header reports expanded or collapsed to screen readers.
            </Text>
          </Disclosure>
        </Card>
      </Section>

      <Section title="ThinkingIndicator and StreamingText" note="Words always accompany the dots. With reduced motion the dots are still and text appears at once. Screen readers get the full text immediately, never character by character.">
        <ThinkingIndicator />
        <Card tone="ai" variant="outlined">
          <Stack gap={3}>
            <StreamingText
              key={replay}
              animate
              colorValue={colors.ai.onSubtle}
              text="Your Checking balance is $8,240.12 and Savings is $16,580.30. That is $24,820.42 in total."
            />
            <Stack align="start">
              <Button label="Replay" variant="secondary" size="small" onPress={() => setReplay((n) => n + 1)} />
            </Stack>
          </Stack>
        </Card>
      </Section>

      <Section title="MessageBubble" note="Assistant messages carry the AI label and are announced as 'Assistant said, AI-generated: …'.">
        <Stack gap={3}>
          <MessageBubble role="user" text="What's my balance?" />
          <MessageBubble role="assistant" text="Your Checking balance is $8,240.12." />
        </Stack>
      </Section>

      <Section title="ConfidenceIndicator" note="Three categories, shown as bars and words. Use it only where it can change a decision.">
        <Stack gap={3}>
          {LEVELS.map((level) => (
            <ConfidenceIndicator key={level} level={level} />
          ))}
        </Stack>
      </Section>

      <Section title="FeedbackControl" note="Helpful, or not. If not, it asks why.">
        <FeedbackControl onSubmit={noop} />
      </Section>

      <Section title="MoneyRangeText" note="A forecast as a range with an 'Estimate' label, never a single number.">
        <MoneyRangeText low={usd(118000)} high={usd(134000)} />
        <MoneyRangeText variant="moneyLarge" low={usd(31000)} high={usd(52000)} />
      </Section>

      <Section title="InsightCard" note="Labelled, explainable in two taps, correctable, controllable.">
        <InsightCard
          title="Dining is up 23% this month"
          summary="You've spent more on restaurants than your usual pattern."
          amount={usd(41260)}
          confidence="high"
          why={{ dataUsed: ['Checking •••• 4821, last 90 days'], factors: ['14 restaurant purchases (usual: 9)'] }}
          action={{ label: 'Set a dining budget', onPress: noop }}
          onDismiss={noop}
          onFeedback={noop}
          onChangeData={noop}
          onTurnOff={noop}
        />
      </Section>

      <Section title="ActionProposalCard" note="AI proposes; a person disposes. Nothing moves until the customer confirms.">
        <ActionProposalCard recipient="Sam Rivera" amount={usd(5000)} from="Checking •••• 4821" when="Today" onConfirm={noop} onEdit={noop} onCancel={noop} />
        <ActionProposalCard recipient="Jordan Lee" amount={usd(250000)} from="Checking •••• 4821" when="Today" warning="You haven't paid Jordan Lee before. Check the name carefully." onConfirm={noop} onEdit={noop} onCancel={noop} />
      </Section>

      <Section title="FraudAlertCard" note="Specific facts and reasons, equal weight to both answers, a person one tap away.">
        <FraudAlertCard
          cardLastFour="4821"
          merchant="Electro Mart"
          amount={usd(-129900)}
          date={new Date(2026, 9, 6)}
          place="Lisbon, Portugal"
          reasons={['First purchase outside the United States', 'Amount is about 9 times your usual']}
          onItsMe={noop}
          onNotMe={noop}
          onTalk={noop}
        />
      </Section>

      <Section title="DataUseRow" note="What, why, on/off in words, and a way to erase it.">
        <Card variant="outlined" padding="lg">
          <DataUseRow title="Spending insights" description="Looks at your transactions to spot patterns." usedFor="insights and forecasts" value={consent} onValueChange={setConsent} onRemoveData={noop} />
        </Card>
      </Section>

      <Section title="HumanHandoff" note="Always reachable. Honest about the wait, or silent if it's unknown.">
        <HumanHandoff waitMinutes={3} onTalk={noop} />
        <HumanHandoff variant="card" waitMinutes={3} reason="This needs a person" onTalk={noop} onCallback={noop} />
      </Section>
    </GalleryScreen>
  );
}
