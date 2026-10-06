import { useState } from 'react';

import { Button, Card, Stack, Text } from '@/components/core';
import {
  AccountCard,
  AmountInput,
  MoneyText,
  StatusBadge,
  TransactionRow,
  type BadgeStatus,
} from '@/components/fintech';
import { GalleryScreen, Section } from '@/gallery/GalleryScreen';
import { ThemeSwitcher } from '@/gallery/ThemeSwitcher';
import { useTheme } from '@/theme';
import { formatMoney, money, type Money } from '@/utils/money';

const BADGES: { status: BadgeStatus; label: string }[] = [
  { status: 'success', label: 'Completed' },
  { status: 'warning', label: 'Action needed' },
  { status: 'danger', label: 'Failed' },
  { status: 'neutral', label: 'Closed' },
  { status: 'pending', label: 'Pending' },
];

const noop = () => undefined;
// A fixed date keeps the gallery stable.
const DAY = new Date(2026, 9, 6);
const usd = (minor: number) => money(minor, 'USD');

export default function FintechGallery() {
  const { space } = useTheme();
  const [masked, setMasked] = useState(false);
  const [amount, setAmount] = useState('');
  const [parsed, setParsed] = useState<Money | null>(null);
  const [errorAmount, setErrorAmount] = useState('2500.5');
  const [yen, setYen] = useState('1200');

  return (
    <GalleryScreen>
      <Text variant="heading1">Fintech components</Text>
      <Text color="secondary">Built from the primitives. Switch theme to check dark mode.</Text>
      <Stack style={{ marginTop: space[4] }}>
        <ThemeSwitcher />
      </Stack>

      <Section title="MoneyText" note="Amounts are Money: integer minor units plus a currency. Symbol and decimals come from Intl.">
        <MoneyText amount={usd(124050)} locale="en-US" variant="moneyLarge" />
        <MoneyText amount={usd(-4550)} locale="en-US" />
        <MoneyText amount={usd(250000)} locale="en-US" signDisplay="always" signTone="credits" />
        <MoneyText amount={money(-1899, 'EUR')} locale="de-DE" signDisplay="always" signTone="both" />
        <MoneyText amount={money(125000, 'JPY')} locale="ja-JP" />
        <MoneyText amount={usd(124050)} locale="en-US" masked />
      </Section>

      <Section title="StatusBadge" note="Colour + icon shape + word. Remove any one and it still reads.">
        <Stack gap={2} align="start">
          {BADGES.map((badge) => (
            <StatusBadge key={badge.status} {...badge} />
          ))}
        </Stack>
      </Section>

      <Section title="AccountCard" note="Default, with a status, pressable, and privacy mode.">
        <Stack align="start">
          <Button label={masked ? 'Show balances' : 'Hide balances'} variant="secondary" size="small" onPress={() => setMasked((m) => !m)} />
        </Stack>
        <AccountCard
          title="Everyday Checking"
          accountType="checking"
          lastFour="4821"
          balance={usd(124050)}
          locale="en-US"
          masked={masked}
          status={{ status: 'success', label: 'Active' }}
          onPress={noop}
        />
        <AccountCard title="Holiday Fund" accountType="savings" lastFour="0937" balance={usd(820000)} locale="en-US" masked={masked} />
        <AccountCard
          title="Travel Card"
          accountType="credit"
          lastFour="7710"
          balance={usd(-32075)}
          locale="en-US"
          balanceLabel="Current balance"
          masked={masked}
          status={{ status: 'warning', label: 'Payment due' }}
          onPress={noop}
        />
      </Section>

      <Section title="TransactionRow" note="Direction comes from the sign. Pending, failed, credit, and a custom type. The last two rows are tappable.">
        <Card variant="outlined" padding="sm">
          <TransactionRow title="Blue Bottle Coffee" date={DAY} amount={usd(-550)} locale="en-US" type="purchase" />
          <TransactionRow title="Payroll, Acme Inc" date={DAY} amount={usd(310000)} locale="en-US" typeLabel="Deposit" />
          <TransactionRow title="Sam Rivera" date={DAY} amount={usd(-7500)} locale="en-US" type="transfer" status="pending" onPress={noop} />
          <TransactionRow title="Gym membership" date={DAY} amount={usd(-4900)} locale="en-US" type="subscription" status="failed" onPress={noop} />
        </Card>
      </Section>

      <Section title="AmountInput" note="Try typing letters or too many decimals. The app, not the component, decides what's valid.">
        <AmountInput
          label="Amount"
          currency="USD"
          locale="en-US"
          value={amount}
          onValueChange={(text, value) => {
            setAmount(text);
            setParsed(value);
          }}
          helperText="Enter the amount to send."
        />
        <Text variant="bodySmall" color="secondary">
          Parsed: {parsed === null ? 'nothing yet' : `${parsed.minor} minor units (${formatMoney(parsed, { locale: 'en-US' })})`}
        </Text>
        <AmountInput
          label="Amount (with error)"
          currency="USD"
          locale="en-US"
          value={errorAmount}
          onValueChange={setErrorAmount}
          errorText="This is more than your available balance."
        />
        <AmountInput label="Amount (JPY, no decimals)" currency="JPY" locale="ja-JP" value={yen} onValueChange={setYen} />
        <AmountInput label="Amount (disabled)" currency="USD" locale="en-US" value="50" onValueChange={noop} disabled />
      </Section>
    </GalleryScreen>
  );
}
