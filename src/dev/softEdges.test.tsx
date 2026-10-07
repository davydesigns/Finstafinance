import { screen } from '@testing-library/react-native';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Button, Card, Chip, SegmentedControl, Text } from '@/components/core';
import { AmountInput } from '@/components/fintech';
import { renderWithProviders } from '@/test/render';
import { softDarkTheme, softLightTheme, ThemeScope, type Theme } from '@/theme';
import { contrastRatio } from '@/utils/contrast';

/**
 * The rule that keeps Soft accessible: SHADOWS ARE NEVER THE ONLY SIGNAL.
 *
 * Soft draws most things with shadows, and shadows are the first thing a high-contrast mode,
 * a bright screen, a low-vision user or a screenshot-compressed image loses. So wherever an edge
 * or a fill carries meaning, it must exist without them. These tests render the real components
 * in Soft and check that.
 */

const flat = (element: { props: { style?: unknown } }): ViewStyle => StyleSheet.flatten(element.props.style as ViewStyle) ?? {};
const shadowOf = (style: ViewStyle): string => (typeof style.boxShadow === 'string' ? style.boxShadow : '');

/** The style a Pressable shows in each state. (Holding a finger down is not something a test can do portably, so ask the style function directly.) */
const stateStyle = (pressed: boolean): ViewStyle => {
  const pressable = screen.UNSAFE_root.find((node) => typeof node.props.style === 'function');
  const style = pressable.props.style as (state: { pressed: boolean }) => ViewStyle;
  return StyleSheet.flatten(style({ pressed })) ?? {};
};

function inSoft(theme: Theme, ui: React.ReactElement) {
  return renderWithProviders(
    <ThemeScope style="soft" scheme={theme.name}>
      {ui}
    </ThemeScope>,
  );
}

describe.each([softLightTheme, softDarkTheme])('soft keeps a floor without shadows: $name', (theme) => {
  const { colors } = theme;
  const noop = () => undefined;

  it('secondary button keeps a 3:1 edge', () => {
    inSoft(theme, <Button label="Pay" variant="secondary" onPress={noop} />);
    const style = flat(screen.getByRole('button', { name: 'Pay' }));
    expect(style.borderWidth).toBeGreaterThan(0);
    expect(contrastRatio(String(style.borderColor), colors.surface.primary)).toBeGreaterThanOrEqual(3);
  });

  it('pressing changes colour as well as depth', () => {
    inSoft(theme, <Button label="Pay" variant="secondary" onPress={noop} />);
    const before = stateStyle(false);
    const after = stateStyle(true);
    expect(shadowOf(after)).toContain('inset');
    expect(shadowOf(before)).not.toContain('inset');
    expect(after.backgroundColor).not.toBe(before.backgroundColor);
  });

  it('a pressed solid button goes flat but still changes colour', () => {
    inSoft(theme, <Button label="Send" onPress={noop} />);
    const before = stateStyle(false);
    const after = stateStyle(true);
    expect(shadowOf(before)).not.toBe('');
    expect(shadowOf(after)).not.toContain('inset');
    expect(after.backgroundColor).not.toBe(before.backgroundColor);
  });

  it('chip keeps a 3:1 edge', () => {
    inSoft(theme, <Chip label="Balance" onPress={noop} />);
    const style = flat(screen.getByRole('button', { name: 'Balance' }));
    expect(style.borderWidth).toBeGreaterThan(0);
    expect(contrastRatio(String(style.borderColor), colors.surface.primary)).toBeGreaterThanOrEqual(3);
  });

  it('segments keep a 3:1 edge, and "selected" is a solid fill, not a shadow', () => {
    inSoft(
      theme,
      <SegmentedControl
        accessibilityLabel="Style"
        options={[
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' },
        ]}
        value="a"
        onValueChange={noop}
      />,
    );
    const selected = flat(screen.getByRole('radio', { name: 'Alpha' }));
    const idle = flat(screen.getByRole('radio', { name: 'Beta' }));
    expect(contrastRatio(String(idle.borderColor), colors.surface.primary)).toBeGreaterThanOrEqual(3);
    expect(selected.backgroundColor).toBe(colors.action.primary);
    expect(contrastRatio(String(selected.backgroundColor), colors.surface.primary)).toBeGreaterThanOrEqual(3);
    expect(idle.backgroundColor).not.toBe(selected.backgroundColor);
  });

  it('an input is pressed into the page AND keeps its 3:1 border', () => {
    inSoft(theme, <AmountInput label="Amount" currency="USD" value="" onValueChange={noop} />);
    const field = screen.UNSAFE_getAllByType(View).map(flat).find((style) => shadowOf(style).includes('inset') && style.borderColor);
    expect(field).toBeDefined();
    expect(contrastRatio(String(field!.borderColor), colors.surface.primary)).toBeGreaterThanOrEqual(3);
  });

  it('AI surfaces never blend into the page: tinted fill and a 3:1 edge', () => {
    inSoft(
      theme,
      <Card tone="ai" testID="ai-card">
        <Text>Generated</Text>
      </Card>,
    );
    const style = flat(screen.getByTestId('ai-card'));
    expect(style.backgroundColor).toBe(colors.ai.subtle);
    expect(style.borderWidth).toBeGreaterThan(0);
    expect(contrastRatio(String(style.borderColor), colors.surface.primary)).toBeGreaterThanOrEqual(3);
  });

  it('an outlined card keeps its border as well as its depth', () => {
    inSoft(
      theme,
      <Card variant="outlined" testID="card">
        <Text>Body</Text>
      </Card>,
    );
    const style = flat(screen.getByTestId('card'));
    expect(style.borderWidth).toBeGreaterThan(0);
    expect(shadowOf(style)).not.toBe('');
  });
});

describe('clean is unchanged by Soft', () => {
  it('has no pressed-in depth and no depth on resting surfaces', () => {
    renderWithProviders(<Card variant="outlined" testID="card"><Text>Body</Text></Card>);
    const style = flat(screen.getByTestId('card'));
    expect(style.boxShadow).toEqual([]);
  });
});
