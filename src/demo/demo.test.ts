import { BUDGETS, INITIAL_TRANSACTIONS, TODAY } from './data';
import { balanceTrend, dayLabel, filterTransactions, groupByDay, spendByDay, spentByCategory, totalBalance, totals } from './selectors';
import { demoReducer, initialState, payeeById, requiresRetype, retypeMatches, validateTransfer, type DemoState } from './state';

const send = (state: DemoState, amountMinor: number, payeeId = 'sam') => demoReducer(state, { type: 'send', from: 'checking', payeeId, amountMinor });

describe('sending money', () => {
  it('holds the money at once and shows a pending transfer', () => {
    const next = send(initialState, 7500);
    expect(next.accounts.find((a) => a.id === 'checking')!.balanceMinor).toBe(824012 - 7500);
    expect(next.transactions[0]).toMatchObject({ title: 'Sam Rivera', amountMinor: -7500, status: 'pending', category: 'transfer' });
    expect(totalBalance(next)).toBe(totalBalance(initialState) - 7500);
  });

  it('refuses to overdraw, to pay nobody, or to send nothing', () => {
    expect(send(initialState, 824013)).toBe(initialState);
    expect(send(initialState, 0)).toBe(initialState);
    expect(send(initialState, 100, 'nobody')).toBe(initialState);
  });

  it('can cancel a transfer sent this session, and restores the balance exactly', () => {
    const sent = send(initialState, 12345);
    const cancelled = demoReducer(sent, { type: 'cancel', id: sent.transactions[0].id });
    expect(cancelled.accounts).toEqual(initialState.accounts);
    expect(cancelled.transactions).toEqual(initialState.transactions);
  });

  it('cannot cancel sample history, only what this session sent', () => {
    expect(demoReducer(initialState, { type: 'cancel', id: 't2' })).toBe(initialState);
  });

  it('gives each transfer its own id', () => {
    const twice = send(send(initialState, 100), 200);
    const ids = twice.transactions.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('toggles privacy mode', () => {
    expect(demoReducer(initialState, { type: 'toggleMask' }).masked).toBe(true);
  });
});

describe('transfer rules (the app decides, not the design system)', () => {
  const base = { amountMinor: 5000, availableMinor: 100000, payeeId: 'sam' };
  it('accepts a normal transfer', () => expect(validateTransfer(base)).toBeNull());
  it('asks for a recipient first', () => expect(validateTransfer({ ...base, payeeId: null })).toBe('Choose who to pay.'));
  it('rejects empty and zero', () => {
    expect(validateTransfer({ ...base, amountMinor: null })).toMatch(/greater than \$0/);
    expect(validateTransfer({ ...base, amountMinor: 0 })).toMatch(/greater than \$0/);
  });
  it('rejects more than the balance', () => expect(validateTransfer({ ...base, amountMinor: 100001 })).toMatch(/more than your available balance/));
  it('rejects over the daily limit', () => expect(validateTransfer({ ...base, availableMinor: 9999999, amountMinor: 500001 })).toMatch(/daily sending limit/));
  it('allows exactly the limit', () => expect(validateTransfer({ ...base, availableMinor: 9999999, amountMinor: 500000 })).toBeNull());

  it('asks for the recipient name from $1,000 up, not below', () => {
    expect(requiresRetype(99999)).toBe(false);
    expect(requiresRetype(100000)).toBe(true);
  });
  it('matches the typed name without caring about case or stray spaces', () => {
    const sam = payeeById('sam')!;
    expect(retypeMatches('  sam RIVERA ', sam)).toBe(true);
    expect(retypeMatches('Sam', sam)).toBe(false);
  });
});

describe('what the overview shows is computed from the data', () => {
  it('totals this month by budget category, with dining over budget and subscriptions close', () => {
    const spent = spentByCategory(INITIAL_TRANSACTIONS);
    expect(spent.dining).toBe(25015);
    expect(spent.dining).toBeGreaterThan(BUDGETS.dining);
    expect(spent.subscriptions).toBe(4997);
    expect(spent.subscriptions / BUDGETS.subscriptions).toBeGreaterThan(0.8);
    expect(spent.groceries).toBe(16719);
  });

  it('does not count income, transfers or refunds as spending', () => {
    const week = spendByDay(INITIAL_TRANSACTIONS, 7);
    expect(week).toHaveLength(7);
    expect(week[week.length - 1].date.getTime()).toBe(new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()).getTime());
    expect(week.reduce((sum, d) => sum + d.minor, 0)).toBe(74736);
    expect(Math.max(...week.map((d) => d.minor))).toBe(25975);
  });

  it('reports the balance trend with today as the last point', () => {
    const trend = balanceTrend(2482042);
    expect(trend.values[trend.values.length - 1]).toBe(2482042);
    expect(trend.changeMinor).toBe(172042);
    expect(trend.percent).toBeCloseTo(7.4, 1);
  });

  it('labels days the way people say them', () => {
    expect(dayLabel(TODAY)).toBe('Today');
    expect(dayLabel(new Date(2026, 9, 6))).toBe('Yesterday');
    expect(dayLabel(new Date(2026, 9, 5))).toBe('Oct 5');
  });
});

describe('searching and filtering activity', () => {
  const all = INITIAL_TRANSACTIONS;
  it('finds by name, category or note, ignoring case', () => {
    expect(filterTransactions(all, { text: 'whole', filter: 'all' }).map((t) => t.title)).toEqual(['Whole Foods']);
    expect(filterTransactions(all, { text: 'DINING', filter: 'all' }).length).toBe(5);
  });
  it('filters money in, money out and pending', () => {
    expect(filterTransactions(all, { text: '', filter: 'in' }).every((t) => t.amountMinor > 0)).toBe(true);
    expect(filterTransactions(all, { text: '', filter: 'out' }).every((t) => t.amountMinor < 0)).toBe(true);
    expect(filterTransactions(all, { text: '', filter: 'pending' }).map((t) => t.id)).toEqual(['t2']);
  });
  it('filters by category and combines it with search', () => {
    expect(filterTransactions(all, { text: 'luna', filter: 'dining' }).map((t) => t.title)).toEqual(['Osteria Luna']);
    expect(filterTransactions(all, { text: 'luna', filter: 'groceries' })).toEqual([]);
  });
  it('can be limited to one account', () => {
    expect(filterTransactions(all, { text: '', filter: 'all', accountId: 'savings' })).toEqual([]);
  });
  it('groups newest first by day, and sums what went out and came in', () => {
    const groups = groupByDay(all);
    expect(groups[0].label).toBe('Today');
    expect(groups[1].label).toBe('Yesterday');
    expect(groups.flatMap((g) => g.items)).toHaveLength(all.length);
    const sum = totals(all.filter((t) => t.id === 't5' || t.id === 't3'));
    expect(sum).toEqual({ out: 8214, in: 342000 });
  });
});
