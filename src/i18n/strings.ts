/**
 * Every user-facing and screen-reader string the design system produces.
 * English defaults; an app overrides any of them through <LocaleProvider strings={...}>.
 */
export interface Strings {
  money: { hidden: string; plus: string; minus: string };
  input: { error: string };
  account: {
    availableBalance: string;
    balanceHidden: string;
    endingIn: string;
    account: string;
    opens: string;
    types: { checking: string; savings: string; credit: string; investment: string };
  };
  transaction: {
    opens: string;
    pending: string;
    failed: string;
    credit: string;
    debit: string;
    types: { purchase: string; transfer: string; fee: string; refund: string; subscription: string };
  };
}

export const defaultStrings: Strings = {
  money: { hidden: 'Amount hidden', plus: 'plus', minus: 'minus' },
  input: { error: 'error' },
  account: {
    availableBalance: 'Available balance',
    balanceHidden: 'hidden',
    endingIn: 'ending in',
    account: 'account',
    opens: 'Opens account',
    types: { checking: 'Checking', savings: 'Savings', credit: 'Credit card', investment: 'Investment' },
  },
  transaction: {
    opens: 'Opens transaction details',
    pending: 'Pending',
    failed: 'Failed',
    credit: 'Money in',
    debit: 'Money out',
    types: { purchase: 'Purchase', transfer: 'Transfer', fee: 'Fee', refund: 'Refund', subscription: 'Subscription' },
  },
};

export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

export function mergeStrings(overrides: DeepPartial<Strings> | undefined): Strings {
  if (!overrides) return defaultStrings;
  return {
    money: { ...defaultStrings.money, ...overrides.money },
    input: { ...defaultStrings.input, ...overrides.input },
    account: {
      ...defaultStrings.account,
      ...overrides.account,
      types: { ...defaultStrings.account.types, ...overrides.account?.types },
    },
    transaction: {
      ...defaultStrings.transaction,
      ...overrides.transaction,
      types: { ...defaultStrings.transaction.types, ...overrides.transaction?.types },
    },
  };
}
