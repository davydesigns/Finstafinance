import { BALANCE_HISTORY, CATEGORY_LABEL, SPEND_CATEGORIES, TODAY, type Category, type DemoTransaction, type SpendCategory } from './data';
import type { DemoState } from './state';

const DAY_MS = 24 * 60 * 60 * 1000;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
const sameDay = (a: Date, b: Date) => startOfDay(a) === startOfDay(b);

export const totalBalance = (state: DemoState) => state.accounts.reduce((sum, a) => sum + a.balanceMinor, 0);

/** Money going out that counts as spending: not transfers between your own accounts, and not failed payments. */
export const isSpend = (t: DemoTransaction) => t.amountMinor < 0 && t.category !== 'transfer' && t.status !== 'failed';

export interface DaySpend {
  date: Date;
  label: string;
  minor: number;
}

/** Spending for each of the last `days` days, oldest first, ending today. */
export function spendByDay(transactions: readonly DemoTransaction[], days = 7): DaySpend[] {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(startOfDay(TODAY) - (days - 1 - i) * DAY_MS);
    const minor = transactions.filter((t) => isSpend(t) && sameDay(t.date, date)).reduce((sum, t) => sum - t.amountMinor, 0);
    return { date, label: date.toLocaleDateString('en-US', { weekday: 'short' }), minor };
  });
}

/** Spending per budget category since the first of TODAY's month. */
export function spentByCategory(transactions: readonly DemoTransaction[]): Record<SpendCategory, number> {
  const monthStart = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1).getTime();
  const spent = Object.fromEntries(SPEND_CATEGORIES.map((c) => [c, 0])) as Record<SpendCategory, number>;
  for (const t of transactions) {
    if (isSpend(t) && t.date.getTime() >= monthStart && (SPEND_CATEGORIES as readonly Category[]).includes(t.category)) {
      spent[t.category as SpendCategory] -= t.amountMinor;
    }
  }
  return spent;
}

export interface Trend {
  changeMinor: number;
  percent: number;
  values: number[];
}

/** How the total balance moved over the history window, with today's total as the last point. */
export function balanceTrend(currentMinor: number): Trend {
  const values = [...BALANCE_HISTORY.slice(0, -1), currentMinor];
  const first = values[0];
  const changeMinor = currentMinor - first;
  return { changeMinor, percent: first === 0 ? 0 : (changeMinor / first) * 100, values };
}

/** "Today", "Yesterday", or "Oct 5". */
export function dayLabel(date: Date): string {
  const diff = Math.round((startOfDay(TODAY) - startOfDay(date)) / DAY_MS);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export type ActivityFilter = 'all' | 'in' | 'out' | 'pending' | Category;

export interface ActivityQuery {
  text: string;
  filter: ActivityFilter;
  accountId?: string | null;
}

export function filterTransactions(transactions: readonly DemoTransaction[], { text, filter, accountId }: ActivityQuery): DemoTransaction[] {
  const needle = text.trim().toLowerCase();
  return transactions.filter((t) => {
    if (accountId && t.accountId !== accountId) return false;
    if (filter === 'in' && t.amountMinor <= 0) return false;
    if (filter === 'out' && t.amountMinor >= 0) return false;
    if (filter === 'pending' && t.status !== 'pending') return false;
    if (filter !== 'all' && filter !== 'in' && filter !== 'out' && filter !== 'pending' && t.category !== filter) return false;
    if (!needle) return true;
    return t.title.toLowerCase().includes(needle) || CATEGORY_LABEL[t.category].toLowerCase().includes(needle) || (t.note ?? '').toLowerCase().includes(needle);
  });
}

export interface DayGroup {
  key: string;
  label: string;
  items: DemoTransaction[];
}

/** Transactions grouped by day, newest first. */
export function groupByDay(transactions: readonly DemoTransaction[]): DayGroup[] {
  const sorted = [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime());
  const groups: DayGroup[] = [];
  for (const t of sorted) {
    const key = String(startOfDay(t.date));
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.items.push(t);
    else groups.push({ key, label: dayLabel(t.date), items: [t] });
  }
  return groups;
}

/** Totals for a list: what went out and what came in. Used for the live summary above the list. */
export function totals(transactions: readonly DemoTransaction[]) {
  let out = 0;
  let inn = 0;
  for (const t of transactions) {
    if (t.status === 'failed') continue;
    if (t.amountMinor < 0) out -= t.amountMinor;
    else inn += t.amountMinor;
  }
  return { out, in: inn };
}
