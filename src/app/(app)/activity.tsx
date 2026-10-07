import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, View, type ViewStyle } from 'react-native';

import { Banner, Button, Card, Chip, EmptyState, Row, Screen, Stack, Text, TextField } from '@/components/core';
import { MoneyText, StatusBadge, TransactionRow } from '@/components/fintech';
import { CATEGORY_LABEL, CURRENCY, SPEND_CATEGORIES, type DemoTransaction } from '@/demo/data';
import { useDemo } from '@/demo/DemoProvider';
import { rowProps } from '@/demo/rowProps';
import { filterTransactions, groupByDay, totals, type ActivityFilter } from '@/demo/selectors';
import { useBreakpoint, useTheme } from '@/theme';
import { useHydrated } from '@/utils/useHydrated';
import { formatMoney, money } from '@/utils/money';

/**
 * DEMO SCREEN: activity. Search and filters that really work, a live result summary, an empty state that
 * helps, and master-detail: beside the list on a desktop, inline under the row on a phone.
 */

const HIDDEN = '••••';
const NO_PARAMS: { account?: string; category?: string; open?: string } = {};
const BASIC_FILTERS: { value: ActivityFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'in', label: 'Money in' },
  { value: 'out', label: 'Money out' },
  { value: 'pending', label: 'Pending' },
];
const FILTERS: { value: ActivityFilter; label: string }[] = [
  ...BASIC_FILTERS,
  ...SPEND_CATEGORIES.map((category) => ({ value: category as ActivityFilter, label: CATEGORY_LABEL[category] })),
];

const isFilter = (value: string | undefined): value is ActivityFilter => FILTERS.some((f) => f.value === value);

function Detail({ transaction, onClose }: { transaction: DemoTransaction; onClose: () => void }) {
  const router = useRouter();
  const { state, dispatch } = useDemo();
  const { space } = useTheme();
  const account = state.accounts.find((a) => a.id === transaction.accountId);
  const cancellable = transaction.status === 'pending' && transaction.id.startsWith('sent-');
  const disputable = transaction.amountMinor < 0 && transaction.status === 'completed' && transaction.category !== 'transfer';

  const rows: [string, string][] = [
    ['Date', transaction.date.toLocaleDateString('en-US', { dateStyle: 'long' })],
    ['Category', CATEGORY_LABEL[transaction.category]],
    ['Account', account ? `${account.title} •••• ${account.lastFour}` : '—'],
    ['Reference', transaction.reference],
    ...(transaction.note ? ([['Note', transaction.note]] as [string, string][]) : []),
  ];

  return (
    <Card variant="elevated" padding="lg">
      <Stack gap={4}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: space[3] }}>
          <Text variant="heading3" style={{ flex: 1 }}>
            {transaction.title}
          </Text>
          <Button label="Close" size="small" variant="tertiary" accessibilityLabel={`Close details for ${transaction.title}`} onPress={onClose} />
        </View>

        <Stack gap={2} align="start">
          <MoneyText variant="moneyLarge" amount={money(transaction.amountMinor, CURRENCY)} signDisplay="always" signTone="credits" masked={state.masked} />
          {transaction.status === 'pending' ? (
            <StatusBadge status="pending" label="Pending" />
          ) : transaction.status === 'failed' ? (
            <StatusBadge status="danger" label="Failed" />
          ) : (
            <StatusBadge status="success" label="Completed" />
          )}
        </Stack>

        <Stack gap={2}>
          {rows.map(([label, value]) => (
            <View
              key={label}
              accessible
              accessibilityLabel={`${label}, ${value}`}
              style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space[3] }}
            >
              <Text variant="bodySmall" color="secondary">
                {label}
              </Text>
              <Text variant="bodySmall" style={{ flexShrink: 1, textAlign: 'right' }}>
                {value}
              </Text>
            </View>
          ))}
        </Stack>

        {cancellable ? (
          <Stack gap={2}>
            <Banner tone="info" title="You can still cancel this">
              It has not been processed yet.
            </Banner>
            <Button
              label="Cancel transfer"
              variant="secondary"
              fullWidth
              onPress={() => {
                dispatch({ type: 'cancel', id: transaction.id });
                onClose();
              }}
            />
          </Stack>
        ) : null}

        {disputable ? (
          <Stack gap={1}>
            <Button label="Dispute this charge" variant="secondary" fullWidth onPress={() => router.push('/assistant')} />
            <Text variant="caption" color="secondary">
              A person handles disputes. The assistant will connect you.
            </Text>
          </Stack>
        ) : null}
      </Stack>
    </Card>
  );
}

export default function Activity() {
  const addressParams = useLocalSearchParams<{ account?: string; category?: string; open?: string }>();
  // The static page is built without an address, so the first browser render must ignore it too. See useHydrated.
  const params = useHydrated() ? addressParams : NO_PARAMS;
  const { state } = useDemo();
  const { colors, space } = useTheme();
  const expanded = useBreakpoint() === 'expanded';

  const [text, setText] = useState('');
  // A filter or an open row can arrive in the address (from the overview). Reading it as a default, not copying it into state,
  // keeps it live; ignoring it until hydration keeps the first browser render identical to the server-built page.
  const [pickedFilter, setPickedFilter] = useState<ActivityFilter | null>(null);
  const [pickedOpen, setPickedOpen] = useState<string | null | undefined>(undefined);
  const [accountCleared, setAccountCleared] = useState(false);

  const filter = pickedFilter ?? (isFilter(params.category) ? params.category : 'all');
  const openId = pickedOpen === undefined ? params.open || null : pickedOpen;
  const accountId = accountCleared ? null : params.account || null;
  const account = state.accounts.find((a) => a.id === accountId);

  const results = filterTransactions(state.transactions, { text, filter, accountId });
  const groups = groupByDay(results);
  const sum = totals(results);
  const selected = results.find((t) => t.id === openId) ?? null;

  const fmt = (minor: number) => (state.masked ? HIDDEN : formatMoney(money(minor, CURRENCY), { locale: 'en-US' }));
  const summary = `${results.length} ${results.length === 1 ? 'transaction' : 'transactions'}${
    results.length ? ` · ${fmt(sum.out)} out · ${fmt(sum.in)} in` : ''
  }`;
  const clearAll = () => {
    setText('');
    setPickedFilter('all');
    setAccountCleared(true);
  };

  const sticky: ViewStyle | null = Platform.OS === 'web' ? ({ position: 'sticky', top: space[4] } as unknown as ViewStyle) : null;

  const list = (
    <Stack gap={4}>
      {groups.length === 0 ? (
        <Card variant="outlined">
          <EmptyState icon="search" title="No matching transactions" action={{ label: 'Clear search and filters', onPress: clearAll }}>
            Try a different word, or remove a filter.
          </EmptyState>
        </Card>
      ) : (
        groups.map((group) => (
          <Stack key={group.key} gap={2}>
            <Text variant="label" color="secondary" accessibilityRole="header">
              {group.label}
            </Text>
            <Card variant="outlined" padding="sm">
              {group.items.map((t) => {
                const isOpen = t.id === selected?.id;
                return (
                  <View key={t.id}>
                    <View style={isOpen ? { backgroundColor: colors.surface.accent, borderRadius: 12 } : undefined}>
                      <TransactionRow {...rowProps(t)} masked={state.masked} onPress={() => setPickedOpen(isOpen ? null : t.id)} />
                    </View>
                    {isOpen && !expanded ? (
                      <View style={{ paddingVertical: space[3] }}>
                        <Detail transaction={t} onClose={() => setPickedOpen(null)} />
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </Card>
          </Stack>
        ))
      )}
    </Stack>
  );

  return (
    <Screen width="wide">
      <Stack gap={5}>
        <Text variant="heading1">Activity</Text>

        {account ? (
          <Banner tone="neutral" title={`Showing ${account.title} •••• ${account.lastFour}`} action={{ label: 'Show all accounts', onPress: () => setAccountCleared(true) }} />
        ) : null}

        <TextField label="Search transactions" icon="search" value={text} onChangeText={setText} autoCapitalize="none" autoCorrect={false} />

        <Stack gap={2}>
          <Text variant="caption" color="secondary">
            Filter
          </Text>
          <Row gap={2} wrap accessibilityLabel="Filter transactions">
            {FILTERS.map((f) => (
              <Chip key={f.value} label={f.label} selected={filter === f.value} onPress={() => setPickedFilter(f.value)} />
            ))}
          </Row>
        </Stack>

        {/* Said aloud politely whenever the results change. */}
        <Text variant="bodySmall" color="secondary" accessibilityLiveRegion="polite">
          {summary}
        </Text>

        {expanded ? (
          <Row gap={8} align="start">
            <View style={{ flex: 3 }}>{list}</View>
            <View style={[{ flex: 2 }, sticky]}>
              {selected ? (
                <Detail transaction={selected} onClose={() => setPickedOpen(null)} />
              ) : (
                <Card variant="inset" padding="lg">
                  <Text color="secondary">Select a transaction to see its details.</Text>
                </Card>
              )}
            </View>
          </Row>
        ) : (
          list
        )}
      </Stack>
    </Screen>
  );
}
