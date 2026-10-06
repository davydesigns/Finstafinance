import { useState } from 'react';
import { View } from 'react-native';

import { Button, Card, Text } from '@/components/core';
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
import { parseAmountToMinorUnits } from '@/utils/money';

const BADGES: { status: BadgeStatus; label: string }[] = [
  { status: 'success', label: 'Completed' },
  { status: 'warning', label: 'Action needed' },
  { status: 'error', label: 'Failed' },
  { status: 'neutral', label: 'Closed' },
  { status: 'pending', label: 'Pending' },
];

const noop = () => undefined;
// A fixed date keeps the gallery stable.
const DAY = new Date(2026, 9, 6);

export default function FintechGallery() {
  const { space } = useTheme();
  const [hidden, setHidden] = useState(false);
  const [amount, setAmount] = useState('');
  const [errorAmount, setErrorAmount] = useState('2500.5');
  const [yen, setYen] = useState('1200');

  const parsed = parseAmountToMinorUnits(amount, 'USD', 'en-US');

  return (
    <GalleryScreen>
      <Text variant="heading1" accessibilityRole="header">
        Fintech components
      </Text>
      <Text color="secondary">Built from the primitives. Switch theme to check dark mode.</Text>
      <View style={{ marginTop: space[4] }}>
        <ThemeSwitcher />
      </View>

      <Section title="MoneyText" note="Amounts are integer minor units. Currency symbol and decimals come from Intl.">
        <MoneyText amount={124050} currency="USD" locale="en-US" variant="moneyLarge" />
        <MoneyText amount={-4550} currency="USD" locale="en-US" />
        <MoneyText amount={250000} currency="USD" locale="en-US" signDisplay="always" colorBySign />
        <MoneyText amount={-1899} currency="EUR" locale="de-DE" signDisplay="always" colorBySign />
        <MoneyText amount={125000} currency="JPY" locale="ja-JP" />
        <MoneyText amount={124050} currency="USD" locale="en-US" masked />
      </Section>

      <Section title="StatusBadge" note="Colour + icon shape + word. Remove any one and it still reads.">
        <View style={{ gap: space[2] }}>
          {BADGES.map((badge) => (
            <StatusBadge key={badge.status} {...badge} />
          ))}
        </View>
      </Section>

      <Section title="AccountCard" note="Default, with a status, pressable, and privacy mode.">
        <View style={{ marginBottom: space[1] }}>
          <Button
            title={hidden ? 'Show balances' : 'Hide balances'}
            variant="secondary"
            size="small"
            onPress={() => setHidden((h) => !h)}
          />
        </View>
        <AccountCard
          name="Everyday Checking"
          accountType="checking"
          lastFour="4821"
          balance={124050}
          currency="USD"
          locale="en-US"
          hideBalance={hidden}
          status={{ status: 'success', label: 'Active' }}
          onPress={noop}
        />
        <AccountCard
          name="Holiday Fund"
          accountType="savings"
          lastFour="0937"
          balance={820000}
          currency="USD"
          locale="en-US"
          hideBalance={hidden}
        />
        <AccountCard
          name="Travel Card"
          accountType="credit"
          lastFour="7710"
          balance={-32075}
          currency="USD"
          locale="en-US"
          balanceLabel="Current balance"
          hideBalance={hidden}
          status={{ status: 'warning', label: 'Payment due' }}
          onPress={noop}
        />
      </Section>

      <Section title="TransactionRow" note="Completed, pending, failed, credit. The last two rows are tappable.">
        <Card variant="outlined" padding={2}>
          <TransactionRow title="Blue Bottle Coffee" date={DAY} amount={-550} currency="USD" locale="en-US" type="purchase" />
          <TransactionRow title="Payroll, Acme Inc" date={DAY} amount={310000} currency="USD" locale="en-US" type="deposit" />
          <TransactionRow title="Sam Rivera" date={DAY} amount={-7500} currency="USD" locale="en-US" type="transfer" status="pending" onPress={noop} />
          <TransactionRow title="Gym membership" date={DAY} amount={-4900} currency="USD" locale="en-US" type="fee" status="failed" onPress={noop} />
        </Card>
      </Section>

      <Section title="AmountInput" note="Try typing letters or too many decimals. The app, not the component, decides what's valid.">
        <AmountInput
          label="Amount"
          currency="USD"
          locale="en-US"
          value={amount}
          onChangeText={setAmount}
          helperText="Enter the amount to send."
        />
        <Text variant="bodySmall" color="secondary">
          Parsed: {parsed === null ? 'nothing yet' : `${parsed} minor units`}
        </Text>
        <AmountInput
          label="Amount (with error)"
          currency="USD"
          locale="en-US"
          value={errorAmount}
          onChangeText={setErrorAmount}
          errorText="This is more than your available balance."
        />
        <AmountInput label="Amount (JPY, no decimals)" currency="JPY" locale="ja-JP" value={yen} onChangeText={setYen} />
        <AmountInput label="Amount (disabled)" currency="USD" locale="en-US" value="50" onChangeText={noop} editable={false} />
      </Section>
    </GalleryScreen>
  );
}
