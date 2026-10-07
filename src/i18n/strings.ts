/**
 * Every user-facing and screen-reader string the design system produces.
 * English defaults; an app overrides any of them through <LocaleProvider strings={...}>.
 */
export interface Strings {
  money: { hidden: string; plus: string; minus: string };
  input: { error: string };
  button: { loading: string };
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
  brand: { designedBy: string };
  ai: {
    /** Always shown with generated content. Words, never an icon alone. */
    label: string;
    labelShort: string;
    disclosure: { title: string; body: string };
    talkToPerson: string;
    talkToPersonHint: string;
    thinking: string;
    assistantSaid: string;
    youSaid: string;
    stopGenerating: string;
    suggestions: string;
    feedback: {
      question: string;
      helpful: string;
      notHelpful: string;
      thanks: string;
      reasonPrompt: string;
      reasons: { wrong: string; unclear: string; irrelevant: string; other: string };
    };
    why: { title: string; dataUsed: string; factors: string; change: string; turnOff: string };
    confidence: { label: string; high: string; medium: string; low: string };
    estimate: string;
    /** {low} and {high} are replaced with formatted amounts. */
    range: string;
    proposal: { title: string; aiDrafted: string; nothingSent: string; confirm: string; edit: string; cancel: string; to: string; from: string; amount: string; when: string };
    fraud: { title: string; itsMe: string; notMe: string; reason: string };
    data: { remove: string; scope: string; on: string; off: string };
    /** {minutes} is replaced with a number. */
    handoff: { wait: string; callback: string; reason: string };
    dismiss: string;
  };
}

export const defaultStrings: Strings = {
  money: { hidden: 'Amount hidden', plus: 'plus', minus: 'minus' },
  input: { error: 'error' },
  button: { loading: 'Loading' },
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
  brand: { designedBy: 'Designed by' },
  ai: {
    label: 'AI-generated',
    labelShort: 'AI',
    disclosure: {
      title: "You're chatting with an AI assistant",
      body: 'It can make mistakes. Check important information, and never share your password or full card number.',
    },
    talkToPerson: 'Talk to a person',
    talkToPersonHint: 'Connects you with a member of our team',
    thinking: 'Working on it',
    assistantSaid: 'Assistant said',
    youSaid: 'You said',
    stopGenerating: 'Stop',
    suggestions: 'Suggested questions',
    feedback: {
      question: 'Was this helpful?',
      helpful: 'Helpful',
      notHelpful: 'Not helpful',
      thanks: 'Thanks for your feedback',
      reasonPrompt: 'What went wrong?',
      reasons: { wrong: 'Wrong information', unclear: 'Unclear', irrelevant: 'Not relevant', other: 'Something else' },
    },
    why: {
      title: 'Why am I seeing this?',
      dataUsed: 'Data used',
      factors: 'What mattered',
      change: 'Change what we use',
      turnOff: 'Turn off this kind of insight',
    },
    confidence: { label: 'Confidence', high: 'High confidence', medium: 'Medium confidence', low: 'Low confidence' },
    estimate: 'Estimate',
    range: 'likely between {low} and {high}',
    proposal: {
      title: 'Review before sending',
      aiDrafted: 'Drafted by AI',
      nothingSent: 'Nothing has been sent yet.',
      confirm: 'Confirm and send',
      edit: 'Edit',
      cancel: 'Cancel',
      to: 'To',
      from: 'From',
      amount: 'Amount',
      when: 'When',
    },
    fraud: { title: 'Is this you?', itsMe: "Yes, it's me", notMe: 'No, secure my account', reason: 'Why we flagged it' },
    data: { remove: 'Remove my data', scope: 'Used for', on: 'On', off: 'Off' },
    handoff: { wait: 'Typical wait: about {minutes} min', callback: 'Or we can call you back', reason: 'This needs a person' },
    dismiss: 'Dismiss',
  },
};

export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Recursively overlays `overrides` on `base`, so any nested string can be translated. */
function deepMerge<T>(base: T, overrides: DeepPartial<T> | undefined): T {
  if (!overrides) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(overrides as Record<string, unknown>)) {
    const current = out[key];
    out[key] = isPlainObject(current) && isPlainObject(value) ? deepMerge(current, value) : value ?? current;
  }
  return out as T;
}

export function mergeStrings(overrides: DeepPartial<Strings> | undefined): Strings {
  return deepMerge(defaultStrings, overrides);
}
