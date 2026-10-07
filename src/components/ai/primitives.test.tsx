import { act, fireEvent, screen, userEvent } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';

import { Banner, Chip, Disclosure } from '@/components/core';
import { Text } from '@/components/core/Text';
import { renderWithProviders } from '@/test/render';

import { AILabel, ConfidenceIndicator, FeedbackControl, MessageBubble, StreamingText, ThinkingIndicator } from '.';

let announce: jest.SpyInstance;
beforeEach(() => {
  announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => undefined);
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
});
afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

describe('AILabel', () => {
  it('says AI-generated in words', () => {
    renderWithProviders(<AILabel />);
    expect(screen.getByLabelText('AI-generated')).toBeTruthy();
    expect(screen.getByText('AI-generated')).toBeTruthy();
  });

  it('compact shows "AI" but screen readers still hear the full wording', () => {
    renderWithProviders(<AILabel variant="compact" />);
    expect(screen.getByText('AI')).toBeTruthy();
    expect(screen.getByLabelText('AI-generated')).toBeTruthy();
  });

  it('accepts custom wording', () => {
    renderWithProviders(<AILabel label="Flagged automatically" />);
    expect(screen.getByLabelText('Flagged automatically')).toBeTruthy();
  });
});

describe('Banner', () => {
  it('reads title and body as one sentence', () => {
    renderWithProviders(
      <Banner tone="warning" title="Heads up">
        Check this first.
      </Banner>,
    );
    expect(screen.getByLabelText('Heads up. Check this first.')).toBeTruthy();
  });

  it('is not an alert unless urgent', () => {
    const { rerender } = renderWithProviders(<Banner title="FYI" />);
    expect(screen.queryByRole('alert')).toBeNull();
    rerender(<Banner title="Act now" urgent />);
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('keeps its action reachable and pressable', async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    renderWithProviders(<Banner title="Update" action={{ label: 'Review', onPress }} />);
    await user.press(screen.getByRole('button', { name: 'Review' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows a dismiss control only when dismissible', () => {
    const { rerender } = renderWithProviders(<Banner title="Notice" />);
    expect(screen.queryByRole('button', { name: 'Dismiss' })).toBeNull();
    rerender(<Banner title="Notice" onDismiss={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeTruthy();
  });
});

describe('Chip', () => {
  it('reports selected and disabled state', () => {
    renderWithProviders(<Chip label="Monthly" selected disabled onPress={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Monthly' }).props.accessibilityState).toMatchObject({ selected: true, disabled: true });
  });

  it('presses', async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    renderWithProviders(<Chip label="Show spending" onPress={onPress} />);
    await user.press(screen.getByRole('button', { name: 'Show spending' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('Disclosure', () => {
  it('hides its content until expanded, and reports the state', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Disclosure title="Why am I seeing this?">
        <Text>Because of your spending.</Text>
      </Disclosure>,
    );
    const header = screen.getByRole('button', { name: 'Why am I seeing this?' });
    expect(header.props.accessibilityState).toMatchObject({ expanded: false });
    expect(screen.queryByText('Because of your spending.')).toBeNull();
    await user.press(header);
    expect(screen.getByRole('button', { name: 'Why am I seeing this?' }).props.accessibilityState).toMatchObject({ expanded: true });
    expect(screen.getByText('Because of your spending.')).toBeTruthy();
  });
});

describe('StreamingText', () => {
  it('reveals gradually, but screen readers always get the whole text', () => {
    jest.useFakeTimers();
    const full = 'Your balance is $8,240.12 today.';
    renderWithProviders(<StreamingText text={full} animate />);
    const node = screen.getByLabelText(full);
    expect(String(node.props.children).length).toBeLessThan(full.length);
    act(() => jest.advanceTimersByTime(3000));
    expect(screen.getByLabelText(full).props.children).toBe(full);
  });

  it('shows everything at once when not animating', () => {
    renderWithProviders(<StreamingText text="All at once." />);
    expect(screen.getByText('All at once.')).toBeTruthy();
  });

  it('shows everything at once when the user prefers reduced motion', async () => {
    (AccessibilityInfo.isReduceMotionEnabled as jest.Mock).mockResolvedValue(true);
    renderWithProviders(<StreamingText text="No typing effect for me." animate />);
    expect(await screen.findByText('No typing effect for me.')).toBeTruthy();
  });

  it('calls onComplete once when the text is fully shown', () => {
    jest.useFakeTimers();
    const onComplete = jest.fn();
    renderWithProviders(<StreamingText text="Short." animate onComplete={onComplete} />);
    act(() => jest.advanceTimersByTime(2000));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});

describe('ThinkingIndicator', () => {
  it('is announced as progress, with words, not just dots', () => {
    renderWithProviders(<ThinkingIndicator />);
    expect(screen.getByRole('progressbar', { name: 'Working on it' })).toBeTruthy();
    expect(screen.getByText('Working on it')).toBeTruthy();
  });
});

describe('MessageBubble', () => {
  it('announces assistant messages as AI-generated', () => {
    renderWithProviders(<MessageBubble role="assistant" text="Your balance is $100." />);
    expect(screen.getByLabelText('Assistant said, AI-generated: Your balance is $100.')).toBeTruthy();
  });

  it('announces user messages plainly, with no AI label', () => {
    renderWithProviders(<MessageBubble role="user" text="What is my balance?" />);
    expect(screen.getByLabelText('You said: What is my balance?')).toBeTruthy();
    expect(screen.queryByLabelText('AI-generated')).toBeNull();
  });

  it('keeps rich content outside the labelled text so its controls stay reachable', async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    renderWithProviders(
      <MessageBubble role="assistant" text="Here you go.">
        <Chip label="Open" onPress={onPress} />
      </MessageBubble>,
    );
    await user.press(screen.getByRole('button', { name: 'Open' }));
    expect(onPress).toHaveBeenCalled();
  });
});

describe('ConfidenceIndicator', () => {
  it.each([
    ['high', 'High confidence'],
    ['medium', 'Medium confidence'],
    ['low', 'Low confidence'],
  ] as const)('%s is said in words', (level, words) => {
    renderWithProviders(<ConfidenceIndicator level={level} />);
    expect(screen.getByLabelText(words)).toBeTruthy();
    expect(screen.getByText(words)).toBeTruthy();
  });
});

describe('FeedbackControl', () => {
  it('helpful submits immediately and thanks once', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    renderWithProviders(<FeedbackControl onSubmit={onSubmit} />);
    await user.press(screen.getByRole('button', { name: 'Helpful' }));
    expect(onSubmit).toHaveBeenCalledWith({ polarity: 'helpful' });
    expect(screen.getByText('Thanks for your feedback')).toBeTruthy();
    expect(announce).toHaveBeenCalledWith('Thanks for your feedback');
  });

  it('not helpful asks WHY before submitting', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    renderWithProviders(<FeedbackControl onSubmit={onSubmit} />);
    await user.press(screen.getByRole('button', { name: 'Not helpful' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('What went wrong?')).toBeTruthy();
    await user.press(screen.getByRole('button', { name: 'Wrong information' }));
    expect(onSubmit).toHaveBeenCalledWith({ polarity: 'notHelpful', reason: 'wrong' });
  });

  it('uses words, not icon-only controls', () => {
    renderWithProviders(<FeedbackControl onSubmit={jest.fn()} />);
    expect(screen.getByText('Helpful')).toBeTruthy();
    expect(screen.getByText('Not helpful')).toBeTruthy();
  });
});

void fireEvent;
