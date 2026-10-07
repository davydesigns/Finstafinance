import { useRouter } from 'expo-router';
import { useEffect, useReducer, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Platform, View } from 'react-native';

import { Avatar, Banner, Button, Card, Chip, EmptyState, Icon, PressableSurface, Row, Screen, SegmentedControl, Stack, Stepper, Text, TextField } from '@/components/core';
import { AmountInput, MoneyText, StatusBadge } from '@/components/fintech';
import { CURRENCY, DAILY_LIMIT_MINOR, PAYEES, RETYPE_THRESHOLD_MINOR, TODAY, type DemoPayee } from '@/demo/data';
import { useDemo } from '@/demo/DemoProvider';
import { initialSendFlow, sendFlowReducer, STEP_NAMES, stepIndex } from '@/demo/sendFlow';
import { payeeById, requiresRetype, retypeMatches, validateTransfer } from '@/demo/state';
import { useTheme } from '@/theme';
import { formatMoney, money, parseMoney, spokenMoney } from '@/utils/money';

/**
 * DEMO SCREEN: send money, in four steps. The rules live in `src/demo/sendFlow.ts` and `state.ts` (tested);
 * this file only shows them. Worth noticing: errors wait for a first attempt, the balance is held at once,
 * a failure keeps everything typed, and larger transfers ask for the recipient's name.
 */

const SENDING_MS = 1200;
const usd = (minor: number) => formatMoney(money(minor, CURRENCY), { locale: 'en-US' });

function PayeeRow({ payee, onPress }: { payee: DemoPayee; onPress: () => void }) {
  const { colors, space, radius, touchTarget } = useTheme();
  return (
    <PressableSurface label={`${payee.name}, ${payee.detail}`} hint="Choose this recipient" onPress={onPress} radius="md">
      {(pressed) => (
        <View
          style={{
            minHeight: touchTarget,
            flexDirection: 'row',
            alignItems: 'center',
            gap: space[3],
            paddingVertical: space[2],
            paddingHorizontal: space[2],
            borderRadius: radius.md,
            backgroundColor: pressed ? colors.surface.pressed : 'transparent',
          }}
        >
          <Avatar name={payee.name} />
          <Stack gap={0} style={{ flex: 1 }}>
            <Text variant="bodyStrong">{payee.name}</Text>
            <Text variant="bodySmall" color="secondary">
              {payee.detail}
            </Text>
          </Stack>
          <Icon name="chevron-forward" size="small" color="secondary" />
        </View>
      )}
    </PressableSurface>
  );
}

function Line({ label, children, spoken }: { label: string; children: ReactNode; spoken: string }) {
  const { space } = useTheme();
  return (
    <View accessible accessibilityLabel={`${label}, ${spoken}`} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space[3], minHeight: space[8] }}>
      <Text color="secondary">{label}</Text>
      <View style={{ flexShrink: 1, alignItems: 'flex-end' }}>{children}</View>
    </View>
  );
}

export default function Send() {
  const router = useRouter();
  const { space } = useTheme();
  const { state: demo, dispatch } = useDemo();
  const [flow, send] = useReducer(sendFlowReducer, initialSendFlow);
  const [query, setQuery] = useState('');

  const account = demo.accounts.find((a) => a.id === flow.from) ?? demo.accounts[0];
  const payee = payeeById(flow.payeeId);
  const amount = parseMoney(flow.amountText, CURRENCY, 'en-US');
  const amountMinor = amount?.minor ?? null;
  const error = validateTransfer({ amountMinor, availableMinor: account.balanceMinor, payeeId: flow.payeeId });
  // "More than your balance" is shown as soon as it is true; everything else waits until the first attempt.
  const overBalance = amountMinor !== null && amountMinor > account.balanceMinor;
  const shownError = flow.attempted || overBalance ? error : null;

  const needsRetype = amountMinor !== null && requiresRetype(amountMinor);
  const retyped = payee ? retypeMatches(flow.retype, payee) : false;
  const sendingNow = flow.step === 'sending';

  // Pretend the bank takes a moment, then either accept or reject the transfer.
  useEffect(() => {
    if (flow.step !== 'sending' || amountMinor === null) return;
    const timer = setTimeout(() => {
      if (flow.simulateFailure) {
        send({ type: 'finish', ok: false, sentId: null });
        return;
      }
      dispatch({ type: 'send', from: flow.from, payeeId: flow.payeeId ?? '', amountMinor, note: flow.note });
      send({ type: 'finish', ok: true, sentId: `sent-${demo.sent + 1}` });
    }, SENDING_MS);
    return () => clearTimeout(timer);
  }, [flow.step, flow.simulateFailure, flow.from, flow.payeeId, flow.note, amountMinor, demo.sent, dispatch]);

  // Say the outcome aloud on iOS; other platforms hear it from the live regions below.
  useEffect(() => {
    if (Platform.OS !== 'ios' || !payee || amount === null) return;
    if (flow.step === 'done') AccessibilityInfo.announceForAccessibility(`Sent ${spokenMoney(amount)} to ${payee.name}`);
    if (flow.step === 'failed') AccessibilityInfo.announceForAccessibility("The transfer didn't go through. Nothing was sent.");
  }, [flow.step, payee, amount]);

  const matches = PAYEES.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()));
  const sentTransaction = demo.transactions.find((t) => t.id === flow.sentId);

  return (
    <Screen>
      <Stack gap={5}>
        <Text variant="heading1">Send money</Text>
        <Stepper steps={STEP_NAMES} current={stepIndex(flow.step)} />

        {flow.step === 'recipient' ? (
          <Stack gap={4}>
            <TextField label="Search people" icon="search" value={query} onChangeText={setQuery} autoCapitalize="none" autoCorrect={false} />
            {matches.length > 0 ? (
              <Card variant="outlined" padding="sm">
                {matches.map((p) => (
                  <PayeeRow key={p.id} payee={p} onPress={() => send({ type: 'choosePayee', id: p.id })} />
                ))}
              </Card>
            ) : (
              <Card variant="outlined">
                <EmptyState icon="search" title="No one matches that" action={{ label: 'Clear search', onPress: () => setQuery('') }}>
                  Check the spelling, or search by first or last name. New recipients are not part of this demo.
                </EmptyState>
              </Card>
            )}
          </Stack>
        ) : null}

        {flow.step === 'amount' && payee ? (
          <Stack gap={5}>
            <Card variant="outlined" padding="sm">
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[3], padding: space[2] }}>
                <Avatar name={payee.name} />
                <Stack gap={0} style={{ flex: 1 }}>
                  <Text variant="bodySmall" color="secondary">
                    To
                  </Text>
                  <Text variant="bodyStrong">{payee.name}</Text>
                </Stack>
                <Button label="Change" size="small" variant="tertiary" accessibilityLabel={`Change recipient, currently ${payee.name}`} onPress={() => send({ type: 'changeRecipient' })} />
              </View>
            </Card>

            <Stack gap={2}>
              <Text variant="label">From</Text>
              <SegmentedControl
                accessibilityLabel="Send from"
                options={demo.accounts.map((a) => ({ value: a.id, label: a.title }))}
                value={flow.from}
                onValueChange={(from) => send({ type: 'setFrom', from })}
              />
              <Text variant="bodySmall" color="secondary">
                {`Available: ${usd(account.balanceMinor)} in ${account.title} ending ${account.lastFour}`}
              </Text>
            </Stack>

            <AmountInput
              label="Amount"
              currency={CURRENCY}
              locale="en-US"
              value={flow.amountText}
              onValueChange={(text) => send({ type: 'setAmount', text })}
              errorText={shownError ?? undefined}
              helperText={`Daily limit ${usd(DAILY_LIMIT_MINOR)}. Over ${usd(RETYPE_THRESHOLD_MINOR)}, we ask you to confirm the recipient's name.`}
            />

            <TextField label="Note (optional)" value={flow.note} onChangeText={(note) => send({ type: 'setNote', note })} helperText="Only you and the recipient will see this." maxLength={80} />

            <Button label="Review" fullWidth onPress={() => send({ type: 'review', amountMinor, availableMinor: account.balanceMinor })} />
          </Stack>
        ) : null}

        {(flow.step === 'review' || flow.step === 'sending' || flow.step === 'failed') && payee && amount ? (
          <Stack gap={5}>
            {flow.step === 'failed' ? (
              <View accessibilityLiveRegion="assertive">
                <Banner tone="danger" title="The transfer didn't go through" urgent>
                  Nothing was sent and your balance hasn&apos;t changed. You can try again, or talk to a person.
                </Banner>
              </View>
            ) : null}

            <Card variant="outlined" padding="lg">
              <Stack gap={2}>
                <Text variant="bodySmall" color="secondary">
                  You are sending
                </Text>
                <MoneyText variant="moneyLarge" amount={amount} />
                <Stack gap={1} style={{ marginTop: space[3] }}>
                  <Line label="To" spoken={payee.name}>
                    <Text variant="bodyStrong">{payee.name}</Text>
                  </Line>
                  <Line label="From" spoken={`${account.title} ending ${account.lastFour}`}>
                    <Text variant="bodyStrong">{`${account.title} •••• ${account.lastFour}`}</Text>
                  </Line>
                  <Line label="Fee" spoken="none">
                    <Text variant="bodyStrong">$0.00</Text>
                  </Line>
                  <Line label="Arrives" spoken="usually within one business day">
                    <Text variant="bodyStrong">Usually in 1 business day</Text>
                  </Line>
                  {flow.note.trim() ? (
                    <Line label="Note" spoken={flow.note}>
                      <Text variant="bodyStrong">{flow.note.trim()}</Text>
                    </Line>
                  ) : null}
                </Stack>
              </Stack>
            </Card>

            {needsRetype ? (
              <Stack gap={3}>
                <Banner tone="warning" title="Extra check for larger amounts">
                  A wrong recipient or an extra zero is the costliest slip. Type the name to show it is right.
                </Banner>
                <TextField
                  label="Type the recipient's name"
                  value={flow.retype}
                  onChangeText={(text) => send({ type: 'setRetype', text })}
                  helperText={`Type exactly: ${payee.name}`}
                  disabled={sendingNow}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </Stack>
            ) : null}

            <Text variant="bodySmall" color="secondary">
              You can cancel until it is processed.
            </Text>

            <Stack gap={2}>
              <Button
                label={flow.step === 'failed' ? 'Try again' : 'Confirm and send'}
                fullWidth
                loading={sendingNow}
                disabled={flow.step === 'review' && needsRetype && !retyped}
                onPress={() => (flow.step === 'failed' ? send({ type: 'retry' }) : send({ type: 'confirm', amountMinor: amount.minor }))}
              />
              {flow.step === 'failed' ? (
                <Button label="Talk to a person" variant="secondary" fullWidth onPress={() => router.push('/assistant')} />
              ) : (
                <Button label="Edit" variant="tertiary" fullWidth disabled={sendingNow} onPress={() => send({ type: 'edit' })} />
              )}
            </Stack>

            {flow.step === 'review' ? (
              <Card variant="inset" padding="md">
                <Row gap={3} wrap>
                  <Stack gap={0} style={{ flex: 1, flexBasis: 200 }}>
                    <Text variant="label">Demo control</Text>
                    <Text variant="caption" color="secondary">
                      Make the bank reject this transfer, to see the error path.
                    </Text>
                  </Stack>
                  <Chip label="Simulate a bank error" selected={flow.simulateFailure} onPress={() => send({ type: 'toggleFailure' })} />
                </Row>
              </Card>
            ) : null}
          </Stack>
        ) : null}

        {flow.step === 'done' && payee && amount ? (
          <Stack gap={5}>
            <View accessibilityLiveRegion="polite">
              {sentTransaction ? (
                <Banner tone="success" title={`Sent ${usd(amount.minor)} to ${payee.name}`}>
                  It is pending, and you can cancel it until it is processed.
                </Banner>
              ) : (
                <Banner tone="info" title="Transfer cancelled">
                  {`${usd(amount.minor)} is back in ${account.title}. ${payee.name} was not paid.`}
                </Banner>
              )}
            </View>

            {sentTransaction ? (
              <Card variant="outlined" padding="lg">
                <Stack gap={1}>
                  <Line label="Reference" spoken={sentTransaction.reference}>
                    <Text variant="bodyStrong">{sentTransaction.reference}</Text>
                  </Line>
                  <Line label="To" spoken={payee.name}>
                    <Text variant="bodyStrong">{payee.name}</Text>
                  </Line>
                  <Line label="Amount" spoken={spokenMoney(amount)}>
                    <MoneyText amount={amount} />
                  </Line>
                  <Line label="Date" spoken={TODAY.toLocaleDateString('en-US', { dateStyle: 'long' })}>
                    <Text variant="bodyStrong">{TODAY.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
                  </Line>
                  <Line label="Status" spoken="pending">
                    <StatusBadge status="pending" label="Pending" />
                  </Line>
                </Stack>
              </Card>
            ) : null}

            <Stack gap={2}>
              <Button label="View in activity" fullWidth onPress={() => router.push({ pathname: '/activity', params: { open: flow.sentId ?? '' } })} />
              {sentTransaction ? (
                <Button label="Cancel transfer" variant="secondary" fullWidth onPress={() => dispatch({ type: 'cancel', id: sentTransaction.id })} />
              ) : null}
              <Button
                label="Send another"
                variant="tertiary"
                fullWidth
                onPress={() => {
                  setQuery('');
                  send({ type: 'reset' });
                }}
              />
            </Stack>
          </Stack>
        ) : null}
      </Stack>
    </Screen>
  );
}
