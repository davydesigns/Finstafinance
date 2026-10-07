import type { DemoTransaction } from './data';
import { CURRENCY } from './data';
import { money } from '@/utils/money';

/** A TransactionRow's props from a demo transaction. */
export function rowProps(t: DemoTransaction) {
  const deposit = t.kind === 'deposit';
  return {
    title: t.title,
    date: t.date,
    amount: money(t.amountMinor, CURRENCY),
    type: deposit ? undefined : t.kind,
    typeLabel: deposit ? 'Deposit' : undefined,
    status: t.status,
  } as const;
}

