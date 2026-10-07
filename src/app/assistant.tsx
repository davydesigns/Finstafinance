import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, KeyboardAvoidingView, Platform, ScrollView, Text as RNText, TextInput, View } from 'react-native';

import { FeedbackControl, MessageBubble, ThinkingIndicator } from '@/components/ai';
import { Banner, Button, Chip, Row, Stack } from '@/components/core';
import { ActionProposalCard, HumanHandoff } from '@/components/fintech';
import { DemoNotice } from '@/gallery/DemoNotice';
import { useStrings } from '@/i18n';
import { INITIAL_STATE, respond, type Proposal, type Reply } from '@/patterns/assistant/engine';
import { useTheme } from '@/theme';
import { formatMoney } from '@/utils/money';

/**
 * PATTERN: AI assistant conversation. Demonstrates, with a scripted (not real) assistant:
 *  - an always-visible AI disclosure, and a way to reach a person from the first message
 *  - suggestions, a "working" state, and streamed replies that screen readers get in full
 *  - payments PROPOSED for review (never sent by the AI), disputes and fraud routed to a formal flow
 *  - automatic handoff when the assistant is struggling
 */

type ProposalStatus = 'open' | 'sending' | 'sent' | 'cancelled' | 'editing';
interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  reply?: Reply;
  proposalStatus?: ProposalStatus;
}

const SUGGESTIONS = ["What's my balance?", 'How am I spending?', 'Send $50 to Sam Rivera', 'Dispute a charge'];
const THINKING_MS = 800;
const SEND_MS = 1000;

let nextId = 1;

export default function Assistant() {
  const { colors, space, radius, borderWidth, size, controlHeight } = useTheme();
  const strings = useStrings();
  const scroll = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([
    { id: nextId++, role: 'assistant', text: "Hi! I can check balances, summarise your spending, or draft a payment for you to review. I can't send money on my own." },
  ]);
  const [engine, setEngine] = useState(INITIAL_STATE);
  const [thinking, setThinking] = useState(false);
  const [draft, setDraft] = useState('');
  const [log, setLog] = useState<string[]>([]);

  const track = (event: string) => setLog((previous) => [...previous.slice(-4), event]);

  useEffect(() => {
    scroll.current?.scrollToEnd({ animated: true });
  }, [messages.length, thinking]);

  useEffect(() => {
    if (thinking && Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(strings.ai.thinking);
  }, [thinking, strings.ai.thinking]);

  const addAssistant = (text: string, extra: Partial<Message> = {}) =>
    setMessages((previous) => [...previous, { id: nextId++, role: 'assistant', text, ...extra }]);

  const ask = (input: string) => {
    const text = input.trim();
    if (!text || thinking) return;
    setMessages((previous) => [...previous, { id: nextId++, role: 'user', text }]);
    setDraft('');
    setThinking(true);
    const result = respond(text, engine);
    setEngine(result.state);
    setTimeout(() => {
      setThinking(false);
      addAssistant(result.reply.text, { reply: result.reply, proposalStatus: result.reply.kind === 'proposal' ? 'open' : undefined });
      if (result.reply.kind === 'regulated') track(`ai_regulated_intent_routed {intent: ${result.reply.topic}}`);
      if (result.reply.kind === 'handoff') track(`ai_human_exit_tapped {trigger: auto_${result.reply.reason === 'struggling' ? 'fallback' : 'user'}}`);
      if (result.state.fallbackStreak > 0) track(`ai_fallback_turn {consecutive_count: ${result.state.fallbackStreak}}`);
    }, THINKING_MS);
  };

  const setStatus = (id: number, proposalStatus: ProposalStatus) =>
    setMessages((previous) => previous.map((message) => (message.id === id ? { ...message, proposalStatus } : message)));

  const confirm = (message: Message, proposal: Proposal) => {
    setStatus(message.id, 'sending');
    track('ai_proposal_confirmed {amount_band: <$100}');
    setTimeout(() => {
      setStatus(message.id, 'sent');
      addAssistant(`Sent ${formatMoney(proposal.amount, { locale: 'en-US' })} to ${proposal.recipient}. You'll see it in your recent activity. (Demo: no money moved.)`);
    }, SEND_MS);
  };

  const lastTextId = [...messages].reverse().find((m) => m.role === 'assistant' && (!m.reply || m.reply.kind === 'text'))?.id;
  const lastId = messages[messages.length - 1]?.id;

  const renderExtras = (message: Message) => {
    const reply = message.reply;
    if (!reply) return null;
    if (reply.kind === 'proposal') {
      const status = message.proposalStatus ?? 'open';
      if (status === 'sent' || status === 'cancelled' || status === 'editing') return null;
      return (
        <ActionProposalCard
          {...reply.proposal}
          locale="en-US"
          loading={status === 'sending'}
          onConfirm={() => confirm(message, reply.proposal)}
          onEdit={() => {
            setStatus(message.id, 'editing');
            track('ai_proposal_edited {edited_fields: unknown}');
            addAssistant('Sure. Tell me the new amount or who it should go to.');
          }}
          onCancel={() => {
            setStatus(message.id, 'cancelled');
            track('ai_proposal_dismissed');
            addAssistant("Okay, I've cancelled that draft. Nothing was sent.");
          }}
        />
      );
    }
    if (reply.kind === 'regulated') {
      return (
        <Stack gap={3}>
          <Banner tone="info" title={reply.topic === 'dispute' ? 'Disputes use a dedicated form' : 'Our fraud team will take it from here'} action={{ label: reply.topic === 'dispute' ? 'Start a dispute' : 'Secure my account', onPress: () => addAssistant('Opening the form… (demo: nothing happens next)') }}>
            {reply.topic === 'dispute' ? 'This protects your rights and keeps the legal deadlines on track.' : 'Locking your card and reviewing recent activity takes a person and a secure process.'}
          </Banner>
          <HumanHandoff variant="card" waitMinutes={3} reason="This needs a person" onTalk={() => track('ai_human_exit_tapped {trigger: auto_regulated}')} onCallback={() => undefined} />
        </Stack>
      );
    }
    if (reply.kind === 'handoff') {
      return <HumanHandoff variant="card" waitMinutes={3} onTalk={() => track('ai_human_exit_tapped {trigger: user}')} onCallback={() => undefined} />;
    }
    if (message.id === lastTextId && message.id === lastId) {
      return <FeedbackControl onSubmit={(feedback) => track(`ai_feedback_submitted {polarity: ${feedback.polarity}}`)} />;
    }
    return null;
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, alignItems: 'center' }}>
      <View style={{ flex: 1, width: '100%', maxWidth: size.maxReadableWidth }}>
        {/* Always visible, never dismissible: the customer must always know it's AI and how to reach a person. */}
        <View style={{ padding: space[4], gap: space[3] }}>
          <DemoNotice>This assistant is scripted to show the interface patterns. No AI model, real account or real money is involved.</DemoNotice>
          <Banner tone="ai" title={strings.ai.disclosure.title}>
            {strings.ai.disclosure.body}
          </Banner>
          <HumanHandoff waitMinutes={3} onTalk={() => track('ai_human_exit_tapped {trigger: user}')} />
        </View>

        <ScrollView
          ref={scroll}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: space[4], gap: space[4] }}
        >
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              role={message.role}
              text={message.text}
              animate={message.role === 'assistant' && message.id === lastId}
              onComplete={() => {
                if (message.role === 'assistant' && message.id === lastId && Platform.OS === 'ios') {
                  AccessibilityInfo.announceForAccessibility(`${strings.ai.assistantSaid}: ${message.text}`);
                }
              }}
            >
              {renderExtras(message)}
            </MessageBubble>
          ))}
          {thinking ? <ThinkingIndicator /> : null}

          {messages.length <= 1 ? (
            <Stack gap={2}>
              <Row gap={2} wrap>
                {SUGGESTIONS.map((suggestion) => (
                  <Chip key={suggestion} tone="ai" label={suggestion} onPress={() => ask(suggestion)} />
                ))}
              </Row>
            </Stack>
          ) : null}

          {log.length ? (
            <View style={{ padding: space[3], borderRadius: radius.md, borderWidth: borderWidth.thin, borderColor: colors.border.default }}>
              <Stack gap={1}>
                {log.map((entry, index) => (
                  <LogLine key={index} value={entry} />
                ))}
              </Stack>
            </View>
          ) : null}
        </ScrollView>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: space[2],
            padding: space[4],
            borderTopWidth: borderWidth.thin,
            borderTopColor: colors.border.default,
            backgroundColor: colors.surface.primary,
          }}
        >
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={() => ask(draft)}
            returnKeyType="send"
            accessibilityLabel="Message the assistant"
            placeholder="Ask about your money"
            placeholderTextColor={colors.text.secondary}
            keyboardAppearance="default"
            style={{
              flex: 1,
              minWidth: 0,
              minHeight: controlHeight.medium,
              paddingHorizontal: space[4],
              borderRadius: radius.full,
              borderWidth: borderWidth.thin,
              borderColor: colors.border.strong,
              backgroundColor: colors.surface.primary,
              color: colors.text.primary,
              fontSize: 16,
            }}
          />
          <Button label="Send" disabled={!draft.trim() || thinking} onPress={() => ask(draft)} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

/** One line of the demo's instrumentation log: the events a real product would emit (see docs/ai/04). */
function LogLine({ value }: { value: string }) {
  const { colors, typography } = useTheme();
  // Event names are code-like, so they use a monospaced face. This is the one place a raw font family is justified.
  return (
    <RNText
      style={{
        color: colors.text.secondary,
        fontSize: typography.caption.fontSize,
        fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
      }}
    >
      {value}
    </RNText>
  );
}
