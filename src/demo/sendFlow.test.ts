import { initialSendFlow, sendFlowReducer, stepIndex, type SendFlowAction, type SendFlowState } from './sendFlow';

const run = (actions: SendFlowAction[], from: SendFlowState = initialSendFlow) => actions.reduce(sendFlowReducer, from);
const toReview: SendFlowAction[] = [
  { type: 'choosePayee', id: 'sam' },
  { type: 'setAmount', text: '75' },
  { type: 'review', amountMinor: 7500, availableMinor: 824012 },
];

describe('send flow', () => {
  it('moves recipient, amount, review in order', () => {
    expect(run([{ type: 'choosePayee', id: 'sam' }]).step).toBe('amount');
    expect(run(toReview).step).toBe('review');
  });

  it('ignores an unknown recipient', () => {
    expect(run([{ type: 'choosePayee', id: 'nobody' }]).step).toBe('recipient');
  });

  it('stays on the amount step and starts showing errors when the amount is invalid', () => {
    const state = run([
      { type: 'choosePayee', id: 'sam' },
      { type: 'review', amountMinor: null, availableMinor: 824012 },
    ]);
    expect(state.step).toBe('amount');
    expect(state.attempted).toBe(true);
  });

  it('does not scold before the first attempt', () => {
    expect(run([{ type: 'choosePayee', id: 'sam' }, { type: 'setAmount', text: '99999' }]).attempted).toBe(false);
  });

  it('sends a normal transfer without an extra check', () => {
    const state = run([...toReview, { type: 'confirm', amountMinor: 7500 }]);
    expect(state.step).toBe('sending');
  });

  it('will not send $1,000 or more until the recipient name is typed (enforced in the logic, not just the UI)', () => {
    const big = run([{ type: 'choosePayee', id: 'sam' }, { type: 'setAmount', text: '1000' }, { type: 'review', amountMinor: 100000, availableMinor: 824012 }]);
    expect(run([{ type: 'confirm', amountMinor: 100000 }], big).step).toBe('review');
    expect(run([{ type: 'setRetype', text: 'Sam' }, { type: 'confirm', amountMinor: 100000 }], big).step).toBe('review');
    expect(run([{ type: 'setRetype', text: 'sam rivera' }, { type: 'confirm', amountMinor: 100000 }], big).step).toBe('sending');
  });

  it('forgets the typed name if the amount changes, so the check cannot be satisfied for a different transfer', () => {
    const big = run([{ type: 'choosePayee', id: 'sam' }, { type: 'review', amountMinor: 100000, availableMinor: 824012 }, { type: 'setRetype', text: 'Sam Rivera' }, { type: 'setAmount', text: '2000' }]);
    expect(big.retype).toBe('');
  });

  it('succeeds into done, keeping the id of what was sent', () => {
    const state = run([...toReview, { type: 'confirm', amountMinor: 7500 }, { type: 'finish', ok: true, sentId: 'sent-1' }]);
    expect(state).toMatchObject({ step: 'done', sentId: 'sent-1' });
    expect(stepIndex(state.step)).toBe(3);
  });

  it('on failure keeps everything the person typed, clears the pretend fault, and lets them retry', () => {
    const failed = run([{ type: 'toggleFailure' }, ...toReview, { type: 'confirm', amountMinor: 7500 }, { type: 'finish', ok: false, sentId: null }]);
    expect(failed).toMatchObject({ step: 'failed', payeeId: 'sam', amountText: '75', simulateFailure: false });
    const retried = run([{ type: 'retry' }], failed);
    expect(retried.step).toBe('review');
    expect(run([{ type: 'confirm', amountMinor: 7500 }, { type: 'finish', ok: true, sentId: 'sent-1' }], retried).step).toBe('done');
  });

  it('ignores a late result if the person is no longer waiting', () => {
    expect(run([{ type: 'finish', ok: true, sentId: 'x' }], run(toReview)).step).toBe('review');
  });

  it('can go back to edit, and start over', () => {
    expect(run([{ type: 'edit' }], run(toReview)).step).toBe('amount');
    expect(run([{ type: 'reset' }], run(toReview))).toEqual(initialSendFlow);
  });

  it('the four visible steps map sensibly', () => {
    expect(['recipient', 'amount', 'review', 'sending', 'failed', 'done'].map((s) => stepIndex(s as never))).toEqual([0, 1, 2, 2, 2, 3]);
  });
});
