import { formatMoney, money, parseMoney, type Money } from '@/utils/money';

/**
 * A SCRIPTED assistant for the demo. It is NOT a language model: it matches a few phrases so the
 * patterns around it (disclosure, streaming, proposals, escalation, handoff) can be shown and
 * tested. A real product replaces `respond` with a model and keeps every rule below.
 *
 * The rules this engine guarantees, and the tests lock in:
 *  1. Disputes and fraud are ROUTED to a formal flow, never answered in chat.
 *  2. A request for a person always gets a person.
 *  3. Two misunderstandings in a row escalate to a person: no doom loops.
 *  4. Money movement is only ever PROPOSED. Nothing here can send anything.
 */

export type Intent = 'human' | 'dispute' | 'fraud' | 'send' | 'balance' | 'spending' | 'greeting' | 'unknown';

export interface EngineState {
  /** Consecutive turns the assistant did not understand. */
  fallbackStreak: number;
}

export interface Proposal {
  recipient: string;
  amount: Money;
  from: string;
  when: string;
  warning?: string;
}

export type Reply =
  | { kind: 'text'; text: string }
  | { kind: 'proposal'; text: string; proposal: Proposal }
  | { kind: 'regulated'; text: string; topic: 'dispute' | 'fraud' }
  | { kind: 'handoff'; text: string; reason: 'requested' | 'struggling' };

export const INITIAL_STATE: EngineState = { fallbackStreak: 0 };

/** Payees the demo customer has paid before. Anyone else gets a "new payee" warning. */
const KNOWN_PAYEES = ['Sam Rivera', 'Alex Chen'];
/** Above this, the proposal carries an extra caution. */
const LARGE_AMOUNT_MINOR = 100000;
const FALLBACKS_BEFORE_HANDOFF = 2;

// Deliberately BROAD. For regulated topics a false positive (routing a benign question to the
// formal flow) is harmless; a false negative (answering a dispute in chat) is the failure that matters.
const HUMAN = /\b(person|human|agent|representative|someone|operator|advisor|adviser)\b/;
const DISPUTE = /\b(dispute|chargeback|charged me twice|double[- ]charged|wrong charge|unauthori[sz]ed|didn'?t (make|authori[sz]e)|did not (make|authori[sz]e)|refund|billing error)\b/;
const FRAUD = /\b(fraud|stolen|lost (my |the )?card|scam|scammed|hacked|suspicious|phishing)\b/;
const SEND = /\b(send|pay|transfer)\b/;
const BALANCE = /\b(balance|how much (money )?do i have)\b/;
const SPENDING = /\b(spend|spent|spending|budget|dining|groceries|expenses)\b/;
const GREETING = /^\s*(hi|hello|hey|good (morning|afternoon|evening))\b/;

export function classify(input: string): Intent {
  const text = input.toLowerCase();
  // Order matters: anything with legal or safety weight is checked before everything else.
  if (FRAUD.test(text)) return 'fraud';
  if (DISPUTE.test(text)) return 'dispute';
  if (HUMAN.test(text)) return 'human';
  if (SEND.test(text)) return 'send';
  if (BALANCE.test(text)) return 'balance';
  if (SPENDING.test(text)) return 'spending';
  if (GREETING.test(text)) return 'greeting';
  return 'unknown';
}

function titleCase(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/** Pulls "$50" and "Sam Rivera" out of "send $50 to sam rivera". Returns what it found. */
export function parseSend(input: string): { amount: Money | null; recipient: string | null } {
  const amountMatch = input.match(/\$?\s*(\d[\d,]*(?:\.\d{1,2})?)/);
  const amount = amountMatch ? parseMoney(amountMatch[1], 'USD', 'en-US') : null;
  const recipientMatch = input.match(/\bto\s+([a-z][a-z' -]*?)(?:\s+(?:today|now|tomorrow|please))?\s*[.!?]?$/i);
  return { amount: amount && amount.minor > 0 ? amount : null, recipient: recipientMatch ? titleCase(recipientMatch[1]) : null };
}

export function respond(input: string, state: EngineState = INITIAL_STATE): { reply: Reply; state: EngineState } {
  const understood = (reply: Reply) => ({ reply, state: { fallbackStreak: 0 } });
  const intent = classify(input);

  switch (intent) {
    case 'fraud':
      return understood({
        kind: 'regulated',
        topic: 'fraud',
        text: "I'm sorry that's happening. Because this involves the safety of your account, I'm not going to handle it in chat. Let's get you to our fraud team right away.",
      });
    case 'dispute':
      return understood({
        kind: 'regulated',
        topic: 'dispute',
        text: 'Disputes have formal steps and deadlines that protect you, so I use a dedicated form instead of answering here. A person can also walk you through it.',
      });
    case 'human':
      return understood({ kind: 'handoff', reason: 'requested', text: 'Of course. Connecting you with a person now.' });
    case 'send': {
      const { amount, recipient } = parseSend(input);
      if (!amount || !recipient) {
        return understood({ kind: 'text', text: 'I can draft that for you to review. Who should it go to, and how much? For example: "Send $50 to Sam Rivera".' });
      }
      const known = KNOWN_PAYEES.includes(recipient);
      const large = amount.minor >= LARGE_AMOUNT_MINOR;
      const warning = !known ? `You haven't paid ${recipient} before. Check the name carefully.` : large ? 'This is a large amount. Check the details carefully.' : undefined;
      return understood({
        kind: 'proposal',
        text: `Here's a draft to review. I haven't sent anything.`,
        proposal: { recipient, amount, from: 'Checking •••• 4821', when: 'Today', warning },
      });
    }
    case 'balance':
      return understood({
        kind: 'text',
        text: `Your Checking balance is ${formatMoney(money(824012, 'USD'), { locale: 'en-US' })} and Savings is ${formatMoney(money(1658030, 'USD'), { locale: 'en-US' })}. That is ${formatMoney(money(2482042, 'USD'), { locale: 'en-US' })} in total.`,
      });
    case 'spending':
      return understood({
        kind: 'text',
        text: `You've spent ${formatMoney(money(128440, 'USD'), { locale: 'en-US' })} so far this month. Dining is the biggest change: about 23% higher than usual.`,
      });
    case 'greeting':
      return understood({ kind: 'text', text: "Hi! I can check balances, summarise your spending, or draft a payment for you to review. I can't send money on my own." });
    default: {
      const streak = state.fallbackStreak + 1;
      if (streak >= FALLBACKS_BEFORE_HANDOFF) {
        return { reply: { kind: 'handoff', reason: 'struggling', text: "I'm having trouble with this one. Let me connect you with a person." }, state: { fallbackStreak: streak } };
      }
      return { reply: { kind: 'text', text: "I'm not sure I understood. I can help with balances, spending, or drafting a payment." }, state: { fallbackStreak: streak } };
    }
  }
}
