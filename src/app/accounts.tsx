import { ScrollView } from 'react-native';

import { Button, Card, Row, Stack, Text } from '@/components/core';
import { AccountCard, MoneyText, TransactionRow, type AccountCardProps } from '@/components/fintech';
import { useTheme } from '@/theme';
import { money, spokenMoney } from '@/utils/money';

/**
 * DEMO SCREEN. Application code that consumes the design system.
 * Data is hardcoded here; a real app would fetch it.
 */

const CURRENCY = 'USD';

const ACCOUNTS: (Pick<AccountCardProps, 'title' | 'accountType' | 'lastFour' | 'balance'> & { id: string })[] = [
  { id: 'checking', title: 'Checking', accountType: 'checking', lastFour: '4821', balance: money(824012, CURRENCY) },
  { id: 'savings', title: 'Savings', accountType: 'savings', lastFour: '9724', balance: money(1658030, CURRENCY) },
];

const ACTIVITY = [
  { id: 'wf', title: 'Whole Foods', date: new Date(2026, 9, 6), amount: money(-8214, CURRENCY), type: 'purchase' },
  { id: 'pay', title: 'Payroll Deposit', date: new Date(2026, 9, 5), amount: money(342000, CURRENCY), typeLabel: 'Deposit' },
  { id: 'nf', title: 'Netflix', date: new Date(2026, 9, 3), amount: money(-2299, CURRENCY), type: 'subscription' },
] as const;

const noop = () => undefined;

export default function Accounts() {
  const { space, size } = useTheme();
  const total = money(
    ACCOUNTS.reduce((sum, account) => sum + account.balance.minor, 0),
    CURRENCY,
  );

  return (
    <ScrollView contentContainerStyle={{ padding: space[4], paddingBottom: space[16], gap: space[8] }}>
      <Stack gap={4}>
        <Text variant="heading1">Good morning</Text>

        <Stack gap={1} accessible accessibilityLabel={`Total balance, ${spokenMoney(total)}`}>
          <Text variant="bodySmall" color="secondary">
            Total balance
          </Text>
          <MoneyText variant="moneyLarge" amount={total} />
        </Stack>

        <Row wrap gap={2}>
          <Stack style={{ flexGrow: 1, flexBasis: size.minActionWidth }}>
            <Button label="Transfer" fullWidth onPress={noop} />
          </Stack>
          <Stack style={{ flexGrow: 1, flexBasis: size.minActionWidth }}>
            <Button label="Pay" variant="secondary" fullWidth onPress={noop} />
          </Stack>
          <Stack style={{ flexGrow: 1, flexBasis: size.minActionWidth }}>
            <Button label="Deposit" variant="secondary" fullWidth onPress={noop} />
          </Stack>
        </Row>
      </Stack>

      <Stack gap={3}>
        <Text variant="heading2">Accounts</Text>
        {ACCOUNTS.map(({ id, ...account }) => (
          <AccountCard key={id} {...account} showAccountType={false} onPress={noop} />
        ))}
      </Stack>

      <Stack gap={3}>
        <Text variant="heading2">Recent activity</Text>
        <Card variant="outlined" padding="sm">
          {ACTIVITY.map(({ id, ...transaction }) => (
            <TransactionRow key={id} {...transaction} onPress={noop} />
          ))}
        </Card>
      </Stack>
    </ScrollView>
  );
}
