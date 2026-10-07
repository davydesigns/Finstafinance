import { DAILY_LIMIT_MINOR, INITIAL_ACCOUNTS, INITIAL_TRANSACTIONS, PAYEES, RETYPE_THRESHOLD_MINOR, TODAY, type AccountId, type DemoAccount, type DemoPayee, type DemoTransaction } from './data';

/** The demo's whole state. Pure data, so it can be tested without rendering anything. */
export interface DemoState {
  accounts: DemoAccount[];
  transactions: DemoTransaction[];
  /** Privacy mode: hides every amount. */
  masked: boolean;
  /** Counts transfers sent in this session, for ids and references. */
  sent: number;
}

export const initialState: DemoState = {
  accounts: INITIAL_ACCOUNTS,
  transactions: INITIAL_TRANSACTIONS,
  masked: false,
  sent: 0,
};

export type DemoAction =
  | { type: 'send'; from: AccountId; payeeId: string; amountMinor: number; note?: string }
  | { type: 'cancel'; id: string }
  | { type: 'toggleMask' };

export function payeeById(id: string | null | undefined): DemoPayee | undefined {
  return PAYEES.find((payee) => payee.id === id);
}

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'toggleMask':
      return { ...state, masked: !state.masked };

    case 'send': {
      const payee = payeeById(action.payeeId);
      const account = state.accounts.find((a) => a.id === action.from);
      if (!payee || !account || action.amountMinor <= 0 || action.amountMinor > account.balanceMinor) return state;
      const sent = state.sent + 1;
      const transaction: DemoTransaction = {
        id: `sent-${sent}`,
        title: payee.name,
        date: TODAY,
        amountMinor: -action.amountMinor,
        category: 'transfer',
        kind: 'transfer',
        // Pending: it can be cancelled until it is processed.
        status: 'pending',
        accountId: action.from,
        reference: `FN-${60000 + sent * 13}`,
        note: action.note?.trim() || undefined,
      };
      return {
        ...state,
        sent,
        // The money is held straight away, so the available balance is honest.
        accounts: state.accounts.map((a) => (a.id === action.from ? { ...a, balanceMinor: a.balanceMinor - action.amountMinor } : a)),
        transactions: [transaction, ...state.transactions],
      };
    }

    case 'cancel': {
      const target = state.transactions.find((t) => t.id === action.id);
      // Only a pending transfer that this session sent can be cancelled.
      if (!target || target.status !== 'pending' || !action.id.startsWith('sent-')) return state;
      return {
        ...state,
        accounts: state.accounts.map((a) => (a.id === target.accountId ? { ...a, balanceMinor: a.balanceMinor - target.amountMinor } : a)),
        transactions: state.transactions.filter((t) => t.id !== action.id),
      };
    }
  }
}

/** Why a transfer cannot go ahead, in plain words; null when it can. The design system never decides this: the app does. */
export function validateTransfer({ amountMinor, availableMinor, payeeId }: { amountMinor: number | null; availableMinor: number; payeeId: string | null }): string | null {
  if (!payeeId) return 'Choose who to pay.';
  if (amountMinor === null || amountMinor <= 0) return 'Enter an amount greater than $0.';
  if (amountMinor > availableMinor) return 'This is more than your available balance.';
  if (amountMinor > DAILY_LIMIT_MINOR) return 'This is over the $5,000 daily sending limit.';
  return null;
}

/**
 * Larger transfers ask for one deliberate extra step: type the recipient's name. A wrong payee or an extra
 * zero is the costliest slip in money movement, and a tap is too easy to make on autopilot.
 * (docs/ai/03-primary-research-plan.md, S4: this is a hypothesis to test, not a proven fix.)
 */
export function requiresRetype(amountMinor: number): boolean {
  return amountMinor >= RETYPE_THRESHOLD_MINOR;
}

export function retypeMatches(typed: string, payee: DemoPayee): boolean {
  return typed.trim().toLowerCase() === payee.name.toLowerCase();
}
