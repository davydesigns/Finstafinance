import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import { BarChart, Sparkline } from '@/components/charts';
import { Button, Card, Icon, LoadingRegion, ProgressBar, Row, Screen, Skeleton, Stack, Text } from '@/components/core';
import { AccountCard, InsightCard, MoneyText, TransactionRow } from '@/components/fintech';
import { BUDGETS, CATEGORY_LABEL, CURRENCY, SPEND_CATEGORIES, TODAY } from '@/demo/data';
import { useDemo } from '@/demo/DemoProvider';
import { rowProps } from '@/demo/rowProps';
import { balanceTrend, spendByDay, spentByCategory, totalBalance } from '@/demo/selectors';
import { useBreakpoint, useTheme } from '@/theme';
import { formatMoney, money, spokenMoney } from '@/utils/money';

/**
 * DEMO SCREEN: the overview. Application code that consumes the design system, on sample data.
 * Every figure here is computed from `src/demo/data.ts`, so the chart, the budgets and the balance can never disagree.
 */

const HIDDEN = '••••';
const usd = (minor: number) => money(minor, CURRENCY);

function OverviewSkeleton({ expanded }: { expanded: boolean }) {
  const { space } = useTheme();
  const main = (
    <Stack gap={5}>
      <Skeleton shape="line" width="55%" height={space[8]} />
      <Skeleton shape="block" height={space[16] * 2} />
      <Skeleton shape="block" height={space[16] * 2.5} />
    </Stack>
  );
  const side = (
    <Stack gap={5}>
      <Skeleton shape="block" height={space[16] * 1.5} />
      <Skeleton shape="block" height={space[16] * 1.5} />
      <Skeleton shape="block" height={space[16] * 2} />
    </Stack>
  );
  return (
    <Screen width="wide">
      <LoadingRegion label="Loading your accounts">
        {expanded ? (
          <Row gap={8} align="start">
            <View style={{ flex: 3 }}>{main}</View>
            <View style={{ flex: 2 }}>{side}</View>
          </Row>
        ) : (
          <Stack gap={5}>
            {main}
            {side}
          </Stack>
        )}
      </LoadingRegion>
    </Screen>
  );
}

export default function Overview() {
  const router = useRouter();
  const { space } = useTheme();
  const expanded = useBreakpoint() === 'expanded';
  const { state, ready, markReady } = useDemo();
  const { masked } = state;

  // Pretend to fetch: show skeletons the first time, never again in this visit.
  useEffect(() => {
    if (ready) return;
    const timer = setTimeout(markReady, 900);
    return () => clearTimeout(timer);
  }, [ready, markReady]);

  if (!ready) return <OverviewSkeleton expanded={expanded} />;

  const fmt = (minor: number) => (masked ? HIDDEN : formatMoney(usd(minor), { locale: 'en-US' }));
  const total = usd(totalBalance(state));
  const trend = balanceTrend(total.minor);
  const up = trend.changeMinor >= 0;
  const week = spendByDay(state.transactions, 7);
  const weekTotal = week.reduce((sum, d) => sum + d.minor, 0);
  const peak = week.reduce((best, d) => (d.minor > best.minor ? d : best), week[0]);
  const spent = spentByCategory(state.transactions);
  const dining = spent.dining;
  const recent = [...state.transactions].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

  const budgetRows = SPEND_CATEGORIES.map((category) => ({ category, spent: spent[category], limit: BUDGETS[category] })).sort(
    (a, b) => b.spent / b.limit - a.spent / a.limit,
  );

  const hero = (
    <Card variant="elevated" padding="lg">
      <Stack gap={4}>
        <Stack gap={1} accessible accessibilityLabel={`Total balance, ${masked ? 'hidden' : spokenMoney(total)}`}>
          <Text variant="bodySmall" color="secondary">
            Total balance
          </Text>
          <MoneyText variant="moneyLarge" amount={total} masked={masked} />
        </Stack>
        <Row gap={3} wrap>
          <Sparkline
            values={trend.values}
            label={`Balance ${up ? 'up' : 'down'} ${Math.abs(trend.percent).toFixed(1)}% over 30 days`}
          />
          <Row gap={1} style={{ flexShrink: 1 }}>
            <Icon name={up ? 'trending-up' : 'trending-down'} size="small" tone={up ? 'success' : 'danger'} />
            <Text variant="bodySmall" tone={up ? 'success' : 'danger'} style={{ flexShrink: 1 }}>
              {masked ? '30-day trend' : `${up ? 'Up' : 'Down'} ${fmt(Math.abs(trend.changeMinor))} (${Math.abs(trend.percent).toFixed(1)}%) in 30 days`}
            </Text>
          </Row>
        </Row>
        <Stack gap={2}>
          <Button label="Send money" fullWidth onPress={() => router.push('/send')} />
          <Row gap={2}>
            <Stack style={{ flex: 1 }}>
              <Button label="Activity" variant="secondary" fullWidth onPress={() => router.push('/activity')} />
            </Stack>
            <Stack style={{ flex: 1 }}>
              <Button label="Assistant" variant="secondary" fullWidth onPress={() => router.push('/assistant')} />
            </Stack>
          </Row>
        </Stack>
      </Stack>
    </Card>
  );

  const spending = (
    <Card variant="outlined" padding="lg">
      <Stack gap={4}>
        <Stack gap={1}>
          <Text variant="heading3">Spending, last 7 days</Text>
          <Text variant="bodySmall" color="secondary">
            {masked ? 'Amounts are hidden.' : `${fmt(weekTotal)} in total · about ${fmt(Math.round(weekTotal / 7))} a day`}
          </Text>
        </Stack>
        <BarChart
          title="Spending by day"
          summary={
            masked
              ? 'Amounts are hidden.'
              : `Highest on ${peak.date.toLocaleDateString('en-US', { weekday: 'long' })}, ${fmt(peak.minor)}. ${fmt(weekTotal)} over 7 days.`
          }
          data={week.map((d) => ({ label: d.label, value: d.minor, valueLabel: fmt(d.minor) }))}
        />
      </Stack>
    </Card>
  );

  const budgets = (
    <Card variant="outlined" padding="lg">
      <Stack gap={5}>
        <Stack gap={1}>
          <Text variant="heading3">{`${TODAY.toLocaleDateString('en-US', { month: 'long' })} budgets`}</Text>
          <Text variant="bodySmall" color="secondary">
            Month to date. Budgets are sample figures.
          </Text>
        </Stack>
        {budgetRows.map(({ category, spent: amount, limit }) => {
          const ratio = amount / limit;
          const common = { label: CATEGORY_LABEL[category], value: amount, max: limit, valueLabel: masked ? 'Amounts hidden' : `${fmt(amount)} of ${fmt(limit)}` };
          if (ratio > 1) return <ProgressBar key={category} {...common} tone="danger" statusLabel={masked ? 'Over budget' : `Over budget by ${fmt(amount - limit)}`} />;
          if (ratio >= 0.8) return <ProgressBar key={category} {...common} tone="warning" statusLabel="Close to the limit" />;
          return <ProgressBar key={category} {...common} />;
        })}
      </Stack>
    </Card>
  );

  const accounts = (
    <Stack gap={3}>
      <Text variant="heading2">Accounts</Text>
      {state.accounts.map((account) => (
        <AccountCard
          key={account.id}
          title={account.title}
          accountType={account.accountType}
          lastFour={account.lastFour}
          balance={usd(account.balanceMinor)}
          masked={masked}
          showAccountType={false}
          onPress={() => router.push({ pathname: '/activity', params: { account: account.id } })}
        />
      ))}
    </Stack>
  );

  const insight = (
    <InsightCard
      title={`Dining is ${fmt(dining - BUDGETS.dining)} over budget`}
      summary={
        masked
          ? 'Your dining spend is above its monthly budget.'
          : `You have spent ${fmt(dining)} on dining this month, against a ${fmt(BUDGETS.dining)} budget.`
      }
      amount={masked ? undefined : usd(dining)}
      confidence="high"
      why={{
        dataUsed: ['Checking •••• 4821, this month'],
        factors: ['5 dining purchases since October 1', masked ? 'Your largest was on October 2' : `Your largest was ${fmt(12460)} at Osteria Luna on October 2`],
      }}
      action={{ label: 'See dining transactions', onPress: () => router.push({ pathname: '/activity', params: { category: 'dining' } }) }}
      onChangeData={() => router.push('/ai-settings')}
    />
  );

  const activity = (
    <Stack gap={3}>
      <Text variant="heading2">Recent activity</Text>
      <Card variant="outlined" padding="sm">
        {recent.map((t) => (
          <TransactionRow key={t.id} {...rowProps(t)} masked={masked} onPress={() => router.push({ pathname: '/activity', params: { open: t.id } })} />
        ))}
      </Card>
      <Button label="See all activity" variant="tertiary" onPress={() => router.push('/activity')} />
    </Stack>
  );

  return (
    <Screen width="wide">
      <Stack gap={1} style={{ marginBottom: space[5] }}>
        <Text variant="heading1">Good morning, Alex</Text>
        <Text color="secondary">{TODAY.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
      </Stack>
      {expanded ? (
        <Row gap={8} align="start">
          <Stack gap={6} style={{ flex: 3 }}>
            {hero}
            {spending}
            {budgets}
          </Stack>
          <Stack gap={6} style={{ flex: 2 }}>
            {accounts}
            {insight}
            {activity}
          </Stack>
        </Row>
      ) : (
        <Stack gap={6}>
          {hero}
          {accounts}
          {spending}
          {insight}
          {budgets}
          {activity}
        </Stack>
      )}
    </Screen>
  );
}
