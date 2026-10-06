import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import { Button, Card, Text } from '@/components/core';
import { AccountCard, MoneyText, TransactionRow, type AccountCardProps } from '@/components/fintech';
import { useTheme } from '@/theme';
import { spokenMoney } from '@/utils/money';

/**
 * DEMO SCREEN. Application code that consumes the design system.
 * Data is hardcoded here; a real app would fetch it.
 */

const CURRENCY = 'USD';

const ACCOUNTS: (Pick<AccountCardProps, 'name' | 'accountType' | 'lastFour' | 'balance'> & { id: string })[] = [
  { id: 'checking', name: 'Checking', accountType: 'checking', lastFour: '4821', balance: 824012 },
  { id: 'savings', name: 'Savings', accountType: 'savings', lastFour: '9724', balance: 1658030 },
];

const ACTIVITY = [
  { id: 'wf', title: 'Whole Foods', date: new Date(2026, 9, 6), amount: -8214, type: 'purchase' },
  { id: 'pay', title: 'Payroll Deposit', date: new Date(2026, 9, 5), amount: 342000, type: 'deposit' },
  { id: 'nf', title: 'Netflix', date: new Date(2026, 9, 3), amount: -2299, type: 'purchase' },
] as const;

const noop = () => undefined;

function Section({ title, children }: { title: string; children: ReactNode }) {
  const { space } = useTheme();
  return (
    <View style={{ gap: space[3] }}>
      <Text variant="heading2">{title}</Text>
      {children}
    </View>
  );
}

export default function Accounts() {
  const { space } = useTheme();
  const total = ACCOUNTS.reduce((sum, account) => sum + account.balance, 0);

  return (
    <ScrollView contentContainerStyle={{ padding: space[4], paddingBottom: space[16], gap: space[8] }}>
      <View style={{ gap: space[4] }}>
        <Text variant="heading1">Good morning</Text>

        <View
          accessible
          accessibilityLabel={`Total balance, ${spokenMoney(total, CURRENCY)}`}
          style={{ gap: space[1] }}
        >
          <Text variant="bodySmall" color="secondary">
            Total balance
          </Text>
          <MoneyText variant="moneyLarge" amount={total} currency={CURRENCY} />
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[2] }}>
          <View style={{ flexGrow: 1, flexBasis: space[16] * 1.5 }}>
            <Button title="Transfer" fullWidth onPress={noop} />
          </View>
          <View style={{ flexGrow: 1, flexBasis: space[16] * 1.5 }}>
            <Button title="Pay" variant="secondary" fullWidth onPress={noop} />
          </View>
          <View style={{ flexGrow: 1, flexBasis: space[16] * 1.5 }}>
            <Button title="Deposit" variant="secondary" fullWidth onPress={noop} />
          </View>
        </View>
      </View>

      <Section title="Accounts">
        {ACCOUNTS.map(({ id, ...account }) => (
          <AccountCard key={id} {...account} currency={CURRENCY} onPress={noop} />
        ))}
      </Section>

      <Section title="Recent activity">
        <Card variant="outlined" padding={2}>
          {ACTIVITY.map(({ id, ...transaction }) => (
            <TransactionRow key={id} {...transaction} currency={CURRENCY} onPress={noop} />
          ))}
        </Card>
      </Section>
    </ScrollView>
  );
}
