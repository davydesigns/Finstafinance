import { fireEvent, screen, userEvent } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';

import { renderWithProviders } from '@/test/render';
import { money } from '@/utils/money';

import { Button } from './core/Button';
import { SegmentedControl } from './core/SegmentedControl';
import { Text } from './core/Text';
import { AccountCard } from './fintech/AccountCard';
import { AmountInput } from './fintech/AmountInput';
import { MoneyText } from './fintech/MoneyText';
import { StatusBadge } from './fintech/StatusBadge';
import { TransactionRow } from './fintech/TransactionRow';

const usd = (minor: number) => money(minor, 'USD');
const DAY = new Date(2026, 9, 6);

let announce: jest.SpyInstance;
beforeEach(() => {
  announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => undefined);
});
afterEach(() => {
  announce.mockRestore();
});

describe('Text', () => {
  it('announces heading variants as headings, and body as plain text', () => {
    renderWithProviders(
      <>
        <Text variant="heading1">Title</Text>
        <Text variant="body">Body</Text>
      </>,
    );
    expect(screen.getByText('Title').props.accessibilityRole).toBe('header');
    expect(screen.getByText('Body').props.accessibilityRole).toBeUndefined();
  });

  it('caps enlargement at no less than 2x for everything up to 22pt', () => {
    renderWithProviders(<Text variant="heading2">Heading</Text>);
    expect(screen.getByText('Heading').props.maxFontSizeMultiplier).toBeGreaterThanOrEqual(2);
  });
});

describe('Button', () => {
  it('uses its label as the accessible name and reports disabled and busy state', () => {
    renderWithProviders(<Button label="Send money" loading disabled onPress={jest.fn()} />);
    const button = screen.getByRole('button', { name: 'Send money' });
    expect(button.props.accessibilityState).toMatchObject({ disabled: true, busy: true });
  });

  it('ignores presses while loading', async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    renderWithProviders(<Button label="Send" loading onPress={onPress} />);
    await user.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('ignores presses while disabled', async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    renderWithProviders(<Button label="Send" disabled onPress={onPress} />);
    await user.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('presses when idle', async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    renderWithProviders(<Button label="Send" onPress={onPress} />);
    await user.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('announces once when loading starts, and never when idle', () => {
    const { rerender } = renderWithProviders(<Button label="Send" onPress={jest.fn()} />);
    expect(announce).not.toHaveBeenCalled();
    rerender(<Button label="Send" loading onPress={jest.fn()} />);
    expect(announce).toHaveBeenCalledWith('Send, Loading');
    expect(announce).toHaveBeenCalledTimes(1);
  });

  it('grows with text instead of clipping (minHeight, not height)', () => {
    renderWithProviders(<Button label="Send" onPress={jest.fn()} />);
    const style = screen.getByRole('button').props.style;
    const flat = Array.isArray(style) ? Object.assign({}, ...style.flat(Infinity)) : style;
    expect(flat.minHeight).toBeGreaterThanOrEqual(48);
    expect(flat.height).toBeUndefined();
  });
});

describe('MoneyText', () => {
  it('speaks signs as words', () => {
    renderWithProviders(<MoneyText amount={usd(-4550)} />);
    expect(screen.getByLabelText('minus $45.50')).toBeTruthy();
  });

  it('masks the figure and says so', () => {
    renderWithProviders(<MoneyText amount={usd(124050)} masked />);
    expect(screen.getByLabelText('Amount hidden')).toHaveTextContent('••••••');
    expect(screen.queryByText(/1,240/)).toBeNull();
  });

  it('never lets colour be the only cue: signTone forces a visible sign', () => {
    renderWithProviders(<MoneyText amount={usd(2500)} signDisplay="never" signTone="credits" />);
    expect(screen.getByText('+$25.00')).toBeTruthy();
  });

  it('never wraps a figure', () => {
    renderWithProviders(<MoneyText amount={usd(2482042)} />);
    expect(screen.getByText('$24,820.42').props.numberOfLines).toBe(1);
  });

  it('follows the locale from the provider', () => {
    renderWithProviders(<MoneyText amount={money(-1899, 'EUR')} />, { locale: 'de-DE' });
    expect(screen.getByText('−18,99 €')).toBeTruthy();
  });
});

describe('StatusBadge', () => {
  it('always carries a text label', () => {
    renderWithProviders(<StatusBadge status="pending" label="Pending" />);
    expect(screen.getByLabelText('Pending')).toBeTruthy();
    expect(screen.getByText('Pending')).toBeTruthy();
  });
});

describe('TransactionRow', () => {
  it('reads as one sentence', () => {
    renderWithProviders(<TransactionRow title="Sam Rivera" date={DAY} amount={usd(-7500)} type="transfer" status="pending" />);
    expect(screen.getByLabelText('Sam Rivera, Transfer, minus $75.00, October 6, 2026, Pending')).toBeTruthy();
  });

  it('derives direction from the sign: credits get a plus and the money-in label', () => {
    renderWithProviders(<TransactionRow title="Acme" date={DAY} amount={usd(310000)} />);
    expect(screen.getByLabelText('Acme, Money in, plus $3,100.00, October 6, 2026')).toBeTruthy();
  });

  it('accepts a custom type without editing the design system', () => {
    renderWithProviders(<TransactionRow title="Acme" date={DAY} amount={usd(100)} type="payroll" typeLabel="Deposit" />);
    expect(screen.getByLabelText(/Deposit/)).toBeTruthy();
  });

  it('is a button with a hint when tappable', async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    renderWithProviders(<TransactionRow title="Shop" date={DAY} amount={usd(-100)} onPress={onPress} />);
    const row = screen.getByRole('button');
    expect(row.props.accessibilityHint).toBe('Opens transaction details');
    await user.press(row);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is a plain group, not a button, when not tappable', () => {
    renderWithProviders(<TransactionRow title="Shop" date={DAY} amount={usd(-100)} />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('strikes through and mutes a failed amount, and says "Failed"', () => {
    renderWithProviders(<TransactionRow title="Gym" date={DAY} amount={usd(-4900)} status="failed" />);
    expect(screen.getByLabelText('Gym, Money out, minus $49.00, October 6, 2026, Failed')).toBeTruthy();
    const amountStyle = [screen.getByText('\u2212$49.00').props.style].flat(Infinity);
    expect(Object.assign({}, ...amountStyle.filter(Boolean)).textDecorationLine).toBe('line-through');
  });

  it('omits the date instead of crashing when the date is invalid', () => {
    renderWithProviders(<TransactionRow title="Shop" date={new Date('garbage')} amount={usd(-100)} type="purchase" />);
    expect(screen.getByLabelText('Shop, Purchase, minus $1.00')).toBeTruthy();
    expect(screen.getByText('Purchase')).toBeTruthy();
  });

  it('can be translated through the provider', () => {
    renderWithProviders(<TransactionRow title="Café" date={DAY} amount={usd(-100)} type="purchase" />, {
      strings: { transaction: { types: { purchase: 'Compra' } }, money: { minus: 'menos' } },
    });
    expect(screen.getByLabelText('Café, Compra, menos $1.00, October 6, 2026')).toBeTruthy();
  });
});

describe('AccountCard', () => {
  it('spells out digits and states the balance', () => {
    renderWithProviders(<AccountCard title="Everyday" accountType="checking" lastFour="4821" balance={usd(824012)} status={{ status: 'success', label: 'Active' }} />);
    expect(screen.getByLabelText('Everyday, Checking account ending in 4 8 2 1, Available balance $8,240.12, Active')).toBeTruthy();
  });

  it('hides the balance from everyone when masked', () => {
    renderWithProviders(<AccountCard title="Everyday" accountType="checking" lastFour="4821" balance={usd(824012)} masked />);
    expect(screen.getByLabelText(/Available balance hidden/)).toBeTruthy();
    expect(screen.queryByText(/8,240/)).toBeNull();
  });

  it('can omit the repeated type label', () => {
    renderWithProviders(<AccountCard title="Checking" accountType="checking" lastFour="4821" balance={usd(1)} showAccountType={false} />);
    expect(screen.queryByText(/Checking ·/)).toBeNull();
  });
});

describe('AmountInput', () => {
  it('puts the error in the field label so it is always read', () => {
    renderWithProviders(<AmountInput label="Amount" currency="USD" value="25" onValueChange={jest.fn()} errorText="More than your balance." />);
    expect(screen.getByLabelText('Amount, USD, error: More than your balance.')).toBeTruthy();
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('announces a new error, and stays silent when there is none', () => {
    const { rerender } = renderWithProviders(<AmountInput label="Amount" currency="USD" value="25" onValueChange={jest.fn()} />);
    expect(announce).not.toHaveBeenCalled();
    rerender(<AmountInput label="Amount" currency="USD" value="25" onValueChange={jest.fn()} errorText="More than your balance." />);
    expect(announce).toHaveBeenCalledWith('More than your balance.');
  });

  it('cleans a pasted amount with thousands separators', () => {
    const onValueChange = jest.fn();
    renderWithProviders(<AmountInput label="Amount" currency="USD" value="" onValueChange={onValueChange} />);
    fireEvent.changeText(screen.getByLabelText('Amount, USD'), '$1,234.50');
    expect(onValueChange).toHaveBeenCalledWith('1234.50', { minor: 123450, currency: 'USD' });
  });

  it('matches the keyboard to the theme', () => {
    renderWithProviders(<AmountInput label="Amount" currency="USD" value="" onValueChange={jest.fn()} />);
    expect(screen.getByLabelText('Amount, USD').props.keyboardAppearance).toBe('light');
  });

  it('cleans typed text and reports exact Money', () => {
    const onValueChange = jest.fn();
    renderWithProviders(<AmountInput label="Amount" currency="USD" value="" onValueChange={onValueChange} />);
    fireEvent.changeText(screen.getByLabelText('Amount, USD'), '12ab.3456');
    expect(onValueChange).toHaveBeenCalledWith('12.34', { minor: 1234, currency: 'USD' });
  });

  it('reports null Money for empty input', () => {
    const onValueChange = jest.fn();
    renderWithProviders(<AmountInput label="Amount" currency="USD" value="5" onValueChange={onValueChange} />);
    fireEvent.changeText(screen.getByLabelText('Amount, USD'), '');
    expect(onValueChange).toHaveBeenCalledWith('', null);
  });

  it('uses no decimals for JPY', () => {
    const onValueChange = jest.fn();
    renderWithProviders(<AmountInput label="Amount" currency="JPY" value="" onValueChange={onValueChange} />, { locale: 'ja-JP' });
    fireEvent.changeText(screen.getByLabelText('Amount, JPY'), '1200.50');
    expect(onValueChange).toHaveBeenCalledWith('1200', { minor: 1200, currency: 'JPY' });
  });

  it('is not editable and reports disabled when disabled', () => {
    renderWithProviders(<AmountInput label="Amount" currency="USD" value="5" onValueChange={jest.fn()} disabled />);
    const input = screen.getByLabelText('Amount, USD');
    expect(input.props.editable).toBe(false);
    expect(input.props.accessibilityState).toMatchObject({ disabled: true });
  });
});

describe('SegmentedControl', () => {
  it('reports which option is checked and changes on press', () => {
    const onValueChange = jest.fn();
    renderWithProviders(
      <SegmentedControl
        accessibilityLabel="Theme"
        options={[
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ]}
        value="light"
        onValueChange={onValueChange}
      />,
    );
    expect(screen.getByRole('radio', { name: 'Light' }).props.accessibilityState).toMatchObject({ checked: true });
    expect(screen.getByRole('radio', { name: 'Dark' }).props.accessibilityState).toMatchObject({ checked: false });
    fireEvent.press(screen.getByRole('radio', { name: 'Dark' }));
    expect(onValueChange).toHaveBeenCalledWith('dark');
  });
});
