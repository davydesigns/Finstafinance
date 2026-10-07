import { fireEvent, screen, userEvent } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';

import { renderWithProviders } from '@/test/render';
import { money } from '@/utils/money';

import { ActionProposalCard } from './ActionProposalCard';
import { DataUseRow } from './DataUseRow';
import { FraudAlertCard } from './FraudAlertCard';
import { HumanHandoff } from './HumanHandoff';
import { InsightCard } from './InsightCard';
import { MoneyRangeText } from './MoneyRangeText';

const usd = (minor: number) => money(minor, 'USD');

beforeEach(() => {
  jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => undefined);
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
});
afterEach(() => jest.restoreAllMocks());

describe('MoneyRangeText', () => {
  it('says it is an estimate, as a range, in words', () => {
    renderWithProviders(<MoneyRangeText low={usd(118000)} high={usd(134000)} />);
    expect(screen.getByLabelText('Estimate: likely between $1,180.00 and $1,340.00')).toBeTruthy();
    expect(screen.getByText('Estimate')).toBeTruthy();
    expect(screen.getByText(/\$1,180\.00.*\$1,340\.00/)).toBeTruthy();
  });

  it('refuses mixed currencies and inverted ranges (a wrong forecast must not render)', () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderWithProviders(<MoneyRangeText low={usd(1)} high={money(2, 'EUR')} />)).toThrow(RangeError);
    expect(() => renderWithProviders(<MoneyRangeText low={usd(200)} high={usd(100)} />)).toThrow(RangeError);
  });
});

describe('InsightCard', () => {
  const base = {
    title: 'Dining is up 23%',
    summary: 'You have spent more on restaurants than usual.',
    why: { dataUsed: ['Checking •••• 4821, last 90 days'], factors: ['12 restaurant purchases this month', 'Usual: 8'] },
  };

  it('is labelled as AI-generated', () => {
    renderWithProviders(<InsightCard {...base} />);
    expect(screen.getByLabelText('AI-generated')).toBeTruthy();
  });

  it('keeps the explanation one tap away, collapsed by default', async () => {
    const user = userEvent.setup();
    renderWithProviders(<InsightCard {...base} />);
    expect(screen.queryByText(/12 restaurant purchases/)).toBeNull();
    await user.press(screen.getByRole('button', { name: 'Why am I seeing this?' }));
    expect(screen.getByText(/Checking •••• 4821/)).toBeTruthy();
    expect(screen.getByText(/12 restaurant purchases this month/)).toBeTruthy();
  });

  it('gives control: change data, turn off, dismiss', async () => {
    const user = userEvent.setup();
    const onChangeData = jest.fn();
    const onTurnOff = jest.fn();
    const onDismiss = jest.fn();
    renderWithProviders(<InsightCard {...base} onChangeData={onChangeData} onTurnOff={onTurnOff} onDismiss={onDismiss} />);
    await user.press(screen.getByRole('button', { name: 'Dismiss' }));
    await user.press(screen.getByRole('button', { name: 'Why am I seeing this?' }));
    await user.press(screen.getByRole('button', { name: 'Change what we use' }));
    await user.press(screen.getByRole('button', { name: 'Turn off this kind of insight' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onChangeData).toHaveBeenCalledTimes(1);
    expect(onTurnOff).toHaveBeenCalledTimes(1);
  });

  it('shows confidence only when given', () => {
    const { rerender } = renderWithProviders(<InsightCard {...base} />);
    expect(screen.queryByLabelText(/confidence/i)).toBeNull();
    rerender(<InsightCard {...base} confidence="medium" />);
    expect(screen.getByLabelText('Medium confidence')).toBeTruthy();
  });

  it('collects feedback with a reason', async () => {
    const user = userEvent.setup();
    const onFeedback = jest.fn();
    renderWithProviders(<InsightCard {...base} onFeedback={onFeedback} />);
    await user.press(screen.getByRole('button', { name: 'Not helpful' }));
    await user.press(screen.getByRole('button', { name: 'Not relevant' }));
    expect(onFeedback).toHaveBeenCalledWith({ polarity: 'notHelpful', reason: 'irrelevant' });
  });
});

describe('ActionProposalCard', () => {
  const props = { recipient: 'Sam Rivera', amount: usd(5000), from: 'Checking •••• 4821', when: 'Today' };

  it('states plainly that nothing has been sent, and is labelled as AI-drafted', () => {
    renderWithProviders(<ActionProposalCard {...props} onConfirm={jest.fn()} onEdit={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByText('Nothing has been sent yet.')).toBeTruthy();
    expect(screen.getByLabelText('Drafted by AI')).toBeTruthy();
  });

  it('reads each detail as a labelled pair', () => {
    renderWithProviders(<ActionProposalCard {...props} onConfirm={jest.fn()} onEdit={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByLabelText('To: Sam Rivera')).toBeTruthy();
    expect(screen.getByLabelText('From: Checking •••• 4821')).toBeTruthy();
    expect(screen.getByLabelText('Amount: $50.00')).toBeTruthy();
  });

  it('ONLY the explicit confirm press sends; edit and cancel never do', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    const onEdit = jest.fn();
    const onCancel = jest.fn();
    renderWithProviders(<ActionProposalCard {...props} onConfirm={onConfirm} onEdit={onEdit} onCancel={onCancel} />);
    expect(onConfirm).not.toHaveBeenCalled();
    await user.press(screen.getByRole('button', { name: 'Edit' }));
    await user.press(screen.getByRole('button', { name: 'Cancel' }));
    expect(onConfirm).not.toHaveBeenCalled();
    await user.press(screen.getByRole('button', { name: 'Confirm and send' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('while sending, blocks edit and cancel and a second confirm', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    renderWithProviders(<ActionProposalCard {...props} loading onConfirm={onConfirm} onEdit={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Edit' }).props.accessibilityState).toMatchObject({ disabled: true });
    await user.press(screen.getByRole('button', { name: 'Confirm and send' }));
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('shows an app-supplied warning', () => {
    renderWithProviders(<ActionProposalCard {...props} warning="You haven't paid Sam before" onConfirm={jest.fn()} onEdit={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByLabelText("You haven't paid Sam before")).toBeTruthy();
  });
});

describe('FraudAlertCard', () => {
  const props = {
    cardLastFour: '4821',
    merchant: 'Electro Mart',
    amount: usd(-129900),
    date: new Date(2026, 9, 6),
    place: 'Lisbon, Portugal',
    reasons: ['First purchase outside the United States', 'Amount is 9 times your usual'],
    onItsMe: jest.fn(),
    onNotMe: jest.fn(),
    onTalk: jest.fn(),
  };

  it('shows what happened and where', () => {
    renderWithProviders(<FraudAlertCard {...props} />);
    expect(screen.getByLabelText(/Electro Mart.*Lisbon, Portugal.*minus \$1,299\.00/)).toBeTruthy();
    expect(screen.getByLabelText(/card ending in 4 8 2 1/)).toBeTruthy();
  });

  it('explains WHY it was flagged on request, and says it was automatic', async () => {
    const user = userEvent.setup();
    renderWithProviders(<FraudAlertCard {...props} />);
    expect(screen.getByLabelText('Flagged automatically')).toBeTruthy();
    await user.press(screen.getByRole('button', { name: 'Why we flagged it' }));
    expect(screen.getByText(/First purchase outside the United States/)).toBeTruthy();
  });

  it('offers both answers and a human, each reaching the right handler', async () => {
    const user = userEvent.setup();
    const onItsMe = jest.fn();
    const onNotMe = jest.fn();
    const onTalk = jest.fn();
    renderWithProviders(<FraudAlertCard {...props} onItsMe={onItsMe} onNotMe={onNotMe} onTalk={onTalk} />);
    await user.press(screen.getByRole('button', { name: "Yes, it's me" }));
    await user.press(screen.getByRole('button', { name: 'No, secure my account' }));
    await user.press(screen.getByRole('button', { name: 'Talk to a person' }));
    expect([onItsMe, onNotMe, onTalk].map((fn) => fn.mock.calls.length)).toEqual([1, 1, 1]);
  });
});

describe('DataUseRow', () => {
  it('states the setting in words and has an accessible switch', () => {
    renderWithProviders(<DataUseRow title="Spending insights" description="Looks at your transactions." usedFor="insights" value onValueChange={jest.fn()} />);
    // The word is visible for everyone; screen readers get the state from the switch itself.
    expect(screen.getByText('On', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByLabelText('Spending insights')).toBeTruthy();
    expect(screen.getByText('Used for: insights')).toBeTruthy();
  });

  it('says Off when off, and toggles', async () => {
    const onValueChange = jest.fn();
    renderWithProviders(<DataUseRow title="Offers" description="d" usedFor="offers" value={false} onValueChange={onValueChange} />);
    expect(screen.getByText('Off', { includeHiddenElements: true })).toBeTruthy();
    fireEvent(screen.getByLabelText('Offers'), 'valueChange', true);
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('lets people erase what a feature learned', async () => {
    const user = userEvent.setup();
    const onRemoveData = jest.fn();
    renderWithProviders(<DataUseRow title="Offers" description="d" usedFor="offers" value={false} onValueChange={jest.fn()} onRemoveData={onRemoveData} />);
    await user.press(screen.getByRole('button', { name: 'Remove my data' }));
    expect(onRemoveData).toHaveBeenCalledTimes(1);
  });
});

describe('HumanHandoff', () => {
  it('bar: always offers a person, with an honest wait when known', async () => {
    const user = userEvent.setup();
    const onTalk = jest.fn();
    renderWithProviders(<HumanHandoff waitMinutes={3} onTalk={onTalk} />);
    expect(screen.getByText('Typical wait: about 3 min')).toBeTruthy();
    await user.press(screen.getByRole('button', { name: 'Talk to a person' }));
    expect(onTalk).toHaveBeenCalledTimes(1);
  });

  it('omits the wait line rather than guessing', () => {
    renderWithProviders(<HumanHandoff onTalk={jest.fn()} />);
    expect(screen.queryByText(/Typical wait/)).toBeNull();
  });

  it('card: explains why a person is needed and offers a callback', async () => {
    const user = userEvent.setup();
    const onCallback = jest.fn();
    renderWithProviders(<HumanHandoff variant="card" reason="Disputes need a person" onTalk={jest.fn()} onCallback={onCallback} />);
    expect(screen.getByText('Disputes need a person')).toBeTruthy();
    await user.press(screen.getByRole('button', { name: 'Or we can call you back' }));
    expect(onCallback).toHaveBeenCalledTimes(1);
  });
});
