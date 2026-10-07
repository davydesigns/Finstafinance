import { fireEvent, screen } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';

import { renderWithProviders } from '@/test/render';

import { BarChart, Sparkline } from './charts';
import { Avatar, EmptyState, initialsOf, LoadingRegion, ProgressBar, Skeleton, Stepper, TextField } from './core';

let announce: jest.SpyInstance;
beforeEach(() => {
  announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => undefined);
});
afterEach(() => {
  announce.mockRestore();
});

describe('TextField', () => {
  it('names the input with its label and passes helper text as the hint', () => {
    renderWithProviders(<TextField label="Search" value="" onChangeText={() => undefined} helperText="Name or email" />);
    const input = screen.getByLabelText('Search');
    expect(input.props.accessibilityHint).toBe('Name or email');
  });

  it('does not read the visible label twice', () => {
    renderWithProviders(<TextField label="Search" value="" onChangeText={() => undefined} />);
    expect(screen.queryByText('Search')).toBeNull();
    expect(screen.getByText('Search', { includeHiddenElements: true })).toBeTruthy();
  });

  it('puts an error in the accessible name, shows it as an alert, and announces it', () => {
    renderWithProviders(<TextField label="Recipient" value="" onChangeText={() => undefined} errorText="Choose someone to pay" />);
    expect(screen.getByLabelText('Recipient, error: Choose someone to pay')).toBeTruthy();
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(announce).toHaveBeenCalledWith('Choose someone to pay');
  });

  it('reports typing to the app and cannot be edited when disabled', () => {
    const onChangeText = jest.fn();
    renderWithProviders(<TextField label="Note" value="" onChangeText={onChangeText} />);
    fireEvent.changeText(screen.getByLabelText('Note'), 'Rent');
    expect(onChangeText).toHaveBeenCalledWith('Rent');
  });

  it('is not editable when disabled', () => {
    renderWithProviders(<TextField label="Note" value="" onChangeText={() => undefined} disabled />);
    expect(screen.getByLabelText('Note').props.editable).toBe(false);
  });
});

describe('Skeleton and LoadingRegion', () => {
  it('says "Loading" once for a whole group, and marks it busy', () => {
    renderWithProviders(
      <LoadingRegion>
        <Skeleton />
        <Skeleton shape="circle" />
      </LoadingRegion>,
    );
    const region = screen.getByLabelText('Loading');
    expect(region.props.accessibilityState).toEqual({ busy: true });
  });

  it('can say what is loading', () => {
    renderWithProviders(
      <LoadingRegion label="Loading accounts">
        <Skeleton />
      </LoadingRegion>,
    );
    expect(screen.getByLabelText('Loading accounts')).toBeTruthy();
  });
});

describe('EmptyState', () => {
  it('explains, as a heading, and offers one way forward', () => {
    const onPress = jest.fn();
    renderWithProviders(
      <EmptyState icon="receipt" title="No matching transactions" action={{ label: 'Clear filters', onPress }}>
        Try a different word, or remove a filter.
      </EmptyState>,
    );
    expect(screen.getByRole('header', { name: 'No matching transactions' })).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Clear filters' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('ProgressBar', () => {
  it('is a progressbar whose spoken value includes the figures and the percentage', () => {
    renderWithProviders(<ProgressBar label="Groceries" value={300} max={600} valueLabel="$300 of $600" />);
    const bar = screen.getByRole('progressbar');
    expect(bar.props.accessibilityLabel).toBe('Groceries, $300 of $600, 50 percent');
    expect(bar.props.accessibilityValue).toEqual({ min: 0, max: 100, now: 50 });
  });

  it('says so in words when over the limit, never by colour alone', () => {
    renderWithProviders(<ProgressBar label="Dining" value={310} max={250} valueLabel="$310 of $250" tone="danger" statusLabel="Over budget" />);
    const bar = screen.getByRole('progressbar');
    expect(bar.props.accessibilityLabel).toBe('Dining, $310 of $250, Over budget, 124 percent');
    expect(bar.props.accessibilityValue.now).toBe(100);
    expect(screen.getByText('Over budget')).toBeTruthy();
  });

  it('does not divide by zero', () => {
    renderWithProviders(<ProgressBar label="Goal" value={0} max={0} valueLabel="$0 of $0" />);
    expect(screen.getByRole('progressbar').props.accessibilityValue.now).toBe(0);
  });
});

describe('Stepper', () => {
  it('speaks the step, the total and its name', () => {
    renderWithProviders(<Stepper steps={['Recipient', 'Amount', 'Review', 'Done']} current={1} />);
    expect(screen.getByLabelText('Step 2 of 4, Amount')).toBeTruthy();
  });

  it('keeps the index in range', () => {
    renderWithProviders(<Stepper steps={['A', 'B']} current={9} />);
    expect(screen.getByLabelText('Step 2 of 2, B')).toBeTruthy();
  });
});

describe('Avatar', () => {
  it('takes first and last initials', () => {
    expect(initialsOf('Sam Rivera')).toBe('SR');
    expect(initialsOf('maya')).toBe('M');
    expect(initialsOf('Ana Maria de la Cruz')).toBe('AC');
    expect(initialsOf('   ')).toBe('');
  });

  it('is hidden from screen readers because the name is written beside it', () => {
    renderWithProviders(<Avatar name="Sam Rivera" />);
    expect(screen.queryByText('SR')).toBeNull();
  });
});

describe('BarChart', () => {
  const data = [
    { label: 'Mon', value: 1200, valueLabel: '$12.00' },
    { label: 'Tue', value: 4200, valueLabel: '$42.00' },
    { label: 'Wed', value: 0, valueLabel: '$0.00' },
  ];

  it('is one image whose alternative states the point, not just the shape', () => {
    renderWithProviders(<BarChart title="Spending by day" summary="Most on Tuesday, $42.00." data={data} />);
    expect(screen.getByRole('image', { name: 'Spending by day. Most on Tuesday, $42.00.' })).toBeTruthy();
  });

  it('puts every value in a table one tap away', () => {
    renderWithProviders(<BarChart title="Spending by day" summary="x" data={data} />);
    expect(screen.queryByLabelText('Tue, $42.00')).toBeNull();
    fireEvent.press(screen.getByRole('button', { name: 'View as table' }));
    expect(screen.getByLabelText('Mon, $12.00')).toBeTruthy();
    expect(screen.getByLabelText('Tue, $42.00')).toBeTruthy();
    expect(screen.getByLabelText('Wed, $0.00')).toBeTruthy();
  });

  it('handles all-zero data without crashing', () => {
    renderWithProviders(<BarChart title="Empty" summary="No spending." data={[{ label: 'Mon', value: 0, valueLabel: '$0.00' }]} />);
    expect(screen.getByRole('image')).toBeTruthy();
  });
});

describe('Sparkline', () => {
  it('describes the trend in words', () => {
    renderWithProviders(<Sparkline values={[1, 2, 3]} label="Balance up 3.2% over 30 days" />);
    expect(screen.getByRole('image', { name: 'Balance up 3.2% over 30 days' })).toBeTruthy();
  });

  it('draws nothing for fewer than two points', () => {
    renderWithProviders(<Sparkline values={[1]} label="One point" />);
    expect(screen.queryByRole('image')).toBeNull();
  });
});
