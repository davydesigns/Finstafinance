import type { AccountType, TransactionKind } from '@/components/fintech';

/**
 * SAMPLE DATA for the demo app. Nothing here is real: names, merchants and figures are invented,
 * and the demo's "today" is fixed so the dates never drift. A real app would fetch all of this.
 */

export const CURRENCY = 'USD';

/** The demo's "today": Wednesday 7 October 2026. */
export const TODAY = new Date(2026, 9, 7);

export type AccountId = 'checking' | 'savings';
export type SpendCategory = 'groceries' | 'dining' | 'transport' | 'subscriptions' | 'shopping' | 'utilities';
export type Category = SpendCategory | 'income' | 'transfer';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface DemoAccount {
  id: AccountId;
  title: string;
  accountType: AccountType;
  lastFour: string;
  balanceMinor: number;
}

export interface DemoTransaction {
  id: string;
  title: string;
  date: Date;
  /** Negative is money out. */
  amountMinor: number;
  category: Category;
  kind: TransactionKind | 'deposit';
  status: TransactionStatus;
  accountId: AccountId;
  reference: string;
  note?: string;
}

export interface DemoPayee {
  id: string;
  name: string;
  detail: string;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  groceries: 'Groceries',
  dining: 'Dining',
  transport: 'Transport',
  subscriptions: 'Subscriptions',
  shopping: 'Shopping',
  utilities: 'Utilities',
  income: 'Income',
  transfer: 'Transfers',
};

export const SPEND_CATEGORIES: readonly SpendCategory[] = ['groceries', 'dining', 'transport', 'subscriptions', 'shopping', 'utilities'];

/** Monthly budgets in minor units. Dining is set low on purpose, so the "over budget" state is real. */
export const BUDGETS: Record<SpendCategory, number> = {
  groceries: 40000,
  dining: 22000,
  transport: 12000,
  subscriptions: 6000,
  shopping: 20000,
  utilities: 15000,
};

export const INITIAL_ACCOUNTS: DemoAccount[] = [
  { id: 'checking', title: 'Checking', accountType: 'checking', lastFour: '4821', balanceMinor: 824012 },
  { id: 'savings', title: 'Savings', accountType: 'savings', lastFour: '9724', balanceMinor: 1658030 },
];

const tx = (
  id: string,
  title: string,
  day: number,
  month: number,
  amountMinor: number,
  category: Category,
  kind: DemoTransaction['kind'],
  status: TransactionStatus = 'completed',
  accountId: AccountId = 'checking',
): DemoTransaction => ({
  id,
  title,
  date: new Date(2026, month, day),
  amountMinor,
  category,
  kind,
  status,
  accountId,
  reference: `FN-${48000 + Number(id.replace(/\D/g, '')) * 7}`,
});

export const INITIAL_TRANSACTIONS: DemoTransaction[] = [
  tx('t1', 'Blue Bottle Coffee', 7, 9, -550, 'dining', 'purchase'),
  tx('t2', 'Uber', 7, 9, -1840, 'transport', 'purchase', 'pending'),
  tx('t3', 'Whole Foods', 6, 9, -8214, 'groceries', 'purchase'),
  tx('t4', 'Chipotle', 6, 9, -1425, 'dining', 'purchase'),
  tx('t5', 'Payroll, Acme Inc', 5, 9, 342000, 'income', 'deposit'),
  tx('t6', "Trader Joe's", 5, 9, -4630, 'groceries', 'purchase'),
  tx('t7', 'Amazon', 4, 9, -6345, 'shopping', 'purchase'),
  tx('t8', 'Sweetgreen', 4, 9, -1680, 'dining', 'purchase'),
  tx('t9', 'Spotify', 4, 9, -1199, 'subscriptions', 'subscription'),
  tx('t10', 'Netflix', 3, 9, -2299, 'subscriptions', 'subscription'),
  tx('t11', 'Shell', 3, 9, -4820, 'transport', 'purchase'),
  tx('t12', 'Osteria Luna', 2, 9, -12460, 'dining', 'purchase'),
  tx('t13', 'ConEd Electric', 2, 9, -9640, 'utilities', 'purchase'),
  tx('t14', 'Safeway', 2, 9, -3875, 'groceries', 'purchase'),
  tx('t15', 'Chez Marie', 1, 9, -8900, 'dining', 'purchase'),
  tx('t16', 'Target', 1, 9, -4110, 'shopping', 'purchase'),
  tx('t17', 'MTA', 1, 9, -1250, 'transport', 'purchase'),
  tx('t18', 'Apple iCloud+', 1, 9, -1499, 'subscriptions', 'subscription'),
  tx('t19', 'Transfer to Savings', 30, 8, -50000, 'transfer', 'transfer'),
  tx('t20', 'Amazon refund', 29, 8, 2499, 'shopping', 'refund'),
];

export const PAYEES: DemoPayee[] = [
  { id: 'sam', name: 'Sam Rivera', detail: 'Account ending 3391' },
  { id: 'alex', name: 'Alex Chen', detail: 'Account ending 7720' },
  { id: 'maya', name: 'Maya Patel', detail: 'Account ending 1048' },
  { id: 'jordan', name: 'Jordan Lee', detail: 'Account ending 9916' },
  { id: 'riverside', name: 'Riverside Property', detail: 'Landlord · account ending 5532' },
];

/** Total balance over the last 30 days, oldest first, in minor units. Ends at today's total. */
export const BALANCE_HISTORY = [2310000, 2295000, 2340000, 2322000, 2368000, 2351000, 2402000, 2388000, 2431000, 2417000, 2465000, 2482042];

/** The most one person can send in a day. */
export const DAILY_LIMIT_MINOR = 500000;
/** From this amount, review asks the person to type the recipient's name (see `src/demo/state.ts`). */
export const RETYPE_THRESHOLD_MINOR = 100000;
