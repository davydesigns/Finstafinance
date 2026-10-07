import type { AccountId } from './data';
import { payeeById, requiresRetype, retypeMatches, validateTransfer } from './state';

export type SendStep = 'recipient' | 'amount' | 'review' | 'sending' | 'done' | 'failed';

export const STEP_NAMES = ['Recipient', 'Amount', 'Review', 'Done'] as const;

/** Which of the four visible steps a state belongs to. */
export function stepIndex(step: SendStep): number {
  if (step === 'recipient') return 0;
  if (step === 'amount') return 1;
  if (step === 'done') return 3;
  return 2;
}

export interface SendFlowState {
  step: SendStep;
  payeeId: string | null;
  amountText: string;
  from: AccountId;
  note: string;
  retype: string;
  /** A demo control, not a product feature: makes the bank "reject" the transfer so the error path can be seen. */
  simulateFailure: boolean;
  /** Errors are shown only after a first attempt to continue, so a field is not scolded before it is used. */
  attempted: boolean;
  /** The id of the transfer once sent. */
  sentId: string | null;
}

export const initialSendFlow: SendFlowState = {
  step: 'recipient',
  payeeId: null,
  amountText: '',
  from: 'checking',
  note: '',
  retype: '',
  simulateFailure: false,
  attempted: false,
  sentId: null,
};

export type SendFlowAction =
  | { type: 'choosePayee'; id: string }
  | { type: 'changeRecipient' }
  | { type: 'setAmount'; text: string }
  | { type: 'setFrom'; from: AccountId }
  | { type: 'setNote'; note: string }
  | { type: 'setRetype'; text: string }
  | { type: 'toggleFailure' }
  | { type: 'review'; amountMinor: number | null; availableMinor: number }
  | { type: 'edit' }
  | { type: 'confirm'; amountMinor: number }
  | { type: 'finish'; ok: boolean; sentId: string | null }
  | { type: 'retry' }
  | { type: 'reset' };

export function sendFlowReducer(state: SendFlowState, action: SendFlowAction): SendFlowState {
  switch (action.type) {
    case 'choosePayee':
      return payeeById(action.id) ? { ...state, payeeId: action.id, step: 'amount', retype: '' } : state;
    case 'changeRecipient':
      return { ...state, step: 'recipient', retype: '' };
    case 'setAmount':
      return { ...state, amountText: action.text, retype: '' };
    case 'setFrom':
      return { ...state, from: action.from };
    case 'setNote':
      return { ...state, note: action.note };
    case 'setRetype':
      return { ...state, retype: action.text };
    case 'toggleFailure':
      return { ...state, simulateFailure: !state.simulateFailure };

    case 'review': {
      const error = validateTransfer({ amountMinor: action.amountMinor, availableMinor: action.availableMinor, payeeId: state.payeeId });
      return error ? { ...state, attempted: true } : { ...state, step: 'review', attempted: false, retype: '' };
    }
    case 'edit':
      return state.step === 'review' ? { ...state, step: 'amount' } : state;

    case 'confirm': {
      if (state.step !== 'review') return state;
      const payee = payeeById(state.payeeId);
      if (!payee) return state;
      // The extra check is enforced here, not only in the interface.
      if (requiresRetype(action.amountMinor) && !retypeMatches(state.retype, payee)) return state;
      return { ...state, step: 'sending' };
    }
    case 'finish':
      if (state.step !== 'sending') return state;
      // After a failure the pretend fault clears, so "Try again" can succeed.
      return action.ok ? { ...state, step: 'done', sentId: action.sentId } : { ...state, step: 'failed', simulateFailure: false };
    case 'retry':
      return state.step === 'failed' ? { ...state, step: 'review' } : state;
    case 'reset':
      return initialSendFlow;
  }
}
