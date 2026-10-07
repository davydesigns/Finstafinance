import { act, fireEvent, screen } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { Text as RNText } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Activity from '@/app/(app)/activity';
import Overview from '@/app/(app)/accounts';
import Send from '@/app/(app)/send';
import { Button } from '@/components/core';
import { renderWithProviders } from '@/test/render';

import { DemoProvider, useDemo } from './DemoProvider';

const mockPush = jest.fn();
let mockParams: Record<string, string> = {};

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useLocalSearchParams: () => mockParams,
  usePathname: () => '/',
  Link: ({ children }: { children: ReactNode }) => children,
}));

const metrics = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } };

/** Shows the demo's checking balance, so a test can see what a screen did to the shared state. */
function Probe() {
  const { state } = useDemo();
  const checking = state.accounts.find((a) => a.id === 'checking')!.balanceMinor;
  return <RNText testID="checking">{String(checking)}</RNText>;
}

/** Stands in for the shell's "Hide amounts" control, which lives outside the screens. */
function MaskToggle() {
  const { dispatch } = useDemo();
  return <Button label="Toggle privacy" onPress={() => dispatch({ type: 'toggleMask' })} />;
}

function renderApp(screenElement: ReactNode) {
  return renderWithProviders(
    <SafeAreaProvider initialMetrics={metrics}>
      <DemoProvider>
        {screenElement}
        <Probe />
        <MaskToggle />
      </DemoProvider>
    </SafeAreaProvider>,
  );
}

const checking = () => Number(screen.getByTestId('checking').props.children);
const tap = (name: string) => fireEvent.press(screen.getByRole('button', { name }));
const advance = (ms: number) => act(() => void jest.advanceTimersByTime(ms));
const typeAmount = (text: string) => fireEvent.changeText(screen.getByLabelText(/^Amount, USD/), text);

beforeEach(() => {
  jest.useFakeTimers();
  mockPush.mockClear();
  mockParams = {};
});
afterEach(() => jest.useRealTimers());

describe('Send money', () => {
  const toReview = (amount: string) => {
    renderApp(<Send />);
    tap('Sam Rivera, Account ending 3391');
    typeAmount(amount);
    tap('Review');
  };

  it('sends a normal transfer: the money is held, the receipt appears, and it can be cancelled', () => {
    toReview('75');
    expect(screen.getByLabelText('Step 3 of 4, Review')).toBeTruthy();
    tap('Confirm and send');
    advance(1300);
    expect(screen.getByText('Sent $75.00 to Sam Rivera')).toBeTruthy();
    expect(checking()).toBe(824012 - 7500);

    tap('Cancel transfer');
    expect(screen.getByText('Transfer cancelled')).toBeTruthy();
    expect(checking()).toBe(824012);
  });

  it('shows "more than your balance" as soon as it is true, and will not continue', () => {
    renderApp(<Send />);
    tap('Sam Rivera, Account ending 3391');
    typeAmount('9000');
    expect(screen.getByText('This is more than your available balance.')).toBeTruthy();
    tap('Review');
    expect(screen.getByLabelText('Step 2 of 4, Amount')).toBeTruthy();
  });

  it('does not scold an empty amount until the first attempt', () => {
    renderApp(<Send />);
    tap('Sam Rivera, Account ending 3391');
    expect(screen.queryByText('Enter an amount greater than $0.')).toBeNull();
    tap('Review');
    expect(screen.getByText('Enter an amount greater than $0.')).toBeTruthy();
  });

  it('locks a $1,200 transfer until the recipient name is typed, and sends nothing before then', () => {
    toReview('1200');
    expect(screen.getByText('Extra check for larger amounts')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Confirm and send' }).props.accessibilityState.disabled).toBe(true);
    tap('Confirm and send');
    advance(1300);
    expect(checking()).toBe(824012);

    fireEvent.changeText(screen.getByLabelText("Type the recipient's name"), 'sam rivera');
    expect(screen.getByRole('button', { name: 'Confirm and send' }).props.accessibilityState.disabled).toBe(false);
    tap('Confirm and send');
    advance(1300);
    expect(checking()).toBe(824012 - 120000);
  });

  it('on a bank error keeps everything, sends nothing, and lets you try again', () => {
    toReview('75');
    tap('Simulate a bank error');
    tap('Confirm and send');
    advance(1300);
    expect(screen.getByText("The transfer didn't go through")).toBeTruthy();
    expect(checking()).toBe(824012);
    expect(screen.getByText('$75.00')).toBeTruthy();

    tap('Try again');
    tap('Confirm and send');
    advance(1300);
    expect(screen.getByText('Sent $75.00 to Sam Rivera')).toBeTruthy();
    expect(checking()).toBe(824012 - 7500);
  });

  it('finds people by search, and says so when no one matches', () => {
    renderApp(<Send />);
    fireEvent.changeText(screen.getByLabelText('Search people'), 'maya');
    expect(screen.getByRole('button', { name: 'Maya Patel, Account ending 1048' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Sam Rivera/ })).toBeNull();
    fireEvent.changeText(screen.getByLabelText('Search people'), 'zzz');
    expect(screen.getByText('No one matches that')).toBeTruthy();
    tap('Clear search');
    expect(screen.getByRole('button', { name: /Sam Rivera/ })).toBeTruthy();
  });
});

describe('Activity', () => {
  it('searches, announces the result count, and offers a way out of an empty result', () => {
    renderApp(<Activity />);
    expect(screen.getByText(/^20 transactions/)).toBeTruthy();
    fireEvent.changeText(screen.getByLabelText('Search transactions'), 'whole foods');
    expect(screen.getByText(/^1 transaction ·/)).toBeTruthy();
    fireEvent.changeText(screen.getByLabelText('Search transactions'), 'zzzz');
    expect(screen.getByText('No matching transactions')).toBeTruthy();
    expect(screen.getByText('0 transactions')).toBeTruthy();
    tap('Clear search and filters');
    expect(screen.getByText(/^20 transactions/)).toBeTruthy();
  });

  it('filters by category, and a filter arriving in the address is honoured', () => {
    mockParams = { category: 'dining' };
    renderApp(<Activity />);
    expect(screen.getByText(/^5 transactions/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Dining' }).props.accessibilityState.selected).toBe(true);
    tap('Pending');
    expect(screen.getByText(/^1 transaction ·/)).toBeTruthy();
  });

  it('opens a transaction in place, with a path to a person for a dispute', () => {
    mockParams = { open: 't3' };
    renderApp(<Activity />);
    expect(screen.getByLabelText('Reference, FN-48021')).toBeTruthy();
    tap('Dispute this charge');
    expect(mockPush).toHaveBeenCalledWith('/assistant');
  });

  it('shows a cancel button only for a transfer that was sent in this session', () => {
    mockParams = { open: 't2' };
    renderApp(<Activity />);
    expect(screen.queryByRole('button', { name: 'Cancel transfer' })).toBeNull();
  });
});

describe('Overview', () => {
  const ready = () => {
    renderApp(<Overview />);
    advance(1000);
  };

  it('starts as one "Loading" region, then shows the real content', () => {
    renderApp(<Overview />);
    expect(screen.getByLabelText('Loading your accounts')).toBeTruthy();
    advance(1000);
    expect(screen.queryByLabelText('Loading your accounts')).toBeNull();
    expect(screen.getByText('Good morning, Alex')).toBeTruthy();
  });

  it('says in words when a budget is over or close, never by colour alone', () => {
    ready();
    expect(screen.getByLabelText('Dining, $250.15 of $220.00, Over budget by $30.15, 114 percent')).toBeTruthy();
    expect(screen.getByLabelText('Subscriptions, $49.97 of $60.00, Close to the limit, 83 percent')).toBeTruthy();
    expect(screen.getByLabelText('Groceries, $167.19 of $400.00, 42 percent')).toBeTruthy();
  });

  it('writes the chart\'s point as its alternative text', () => {
    ready();
    expect(screen.getByRole('image', { name: /Spending by day\. Highest on Friday, \$259\.75\. \$747\.36 over 7 days\./ })).toBeTruthy();
  });

  it('hides every amount in privacy mode, in what is seen and in what is spoken', () => {
    ready();
    expect(screen.getByText('$24,820.42')).toBeTruthy();
    tap('Toggle privacy');
    expect(screen.queryByText('$24,820.42')).toBeNull();
    expect(screen.queryByText('$8,240.12')).toBeNull();
    expect(screen.getByLabelText('Total balance, hidden')).toBeTruthy();
    expect(screen.getByLabelText('Dining, Amounts hidden, Over budget, 114 percent')).toBeTruthy();
    expect(screen.getByRole('image', { name: 'Spending by day. Amounts are hidden.' })).toBeTruthy();
  });
});
