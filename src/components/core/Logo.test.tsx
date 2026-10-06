import { screen } from '@testing-library/react-native';
import Svg, { Path } from 'react-native-svg';

import { renderWithProviders } from '@/test/render';
import { lightTheme } from '@/theme';

import { Logo } from './Logo';

describe('Logo', () => {
  it('is announced as an image named after the brand', () => {
    renderWithProviders(<Logo />);
    const logo = screen.getByLabelText('Davy Designs');
    expect(logo.props.accessibilityRole).toBe('image');
  });

  it('accepts a custom spoken name', () => {
    renderWithProviders(<Logo label="Davy Designs home" />);
    expect(screen.getByLabelText('Davy Designs home')).toBeTruthy();
  });

  it('can be hidden from screen readers when decorative', () => {
    renderWithProviders(<Logo decorative />);
    expect(screen.queryByLabelText('Davy Designs')).toBeNull();
  });

  it('announces the brand once when it also shows its name', () => {
    renderWithProviders(<Logo showName />);
    expect(screen.getAllByLabelText('Davy Designs')).toHaveLength(1);
    // The visible text exists for sighted users but is hidden from the screen reader.
    expect(screen.getByText('Davy Designs', { includeHiddenElements: true }).props.accessibilityElementsHidden).toBe(true);
  });

  it('scales with the size token, keeping the artwork proportions', () => {
    renderWithProviders(
      <>
        <Logo size="small" />
        <Logo size="large" />
      </>,
    );
    const [small, large] = screen.UNSAFE_getAllByType(Svg);
    expect(large.props.height / small.props.height).toBeCloseTo(64 / 24);
    expect(small.props.width / small.props.height).toBeCloseTo(1231 / 528);
  });

  it.each([
    ['primary', lightTheme.colors.text.primary],
    ['brand', lightTheme.colors.action.primary],
    ['secondary', lightTheme.colors.text.secondary],
    ['inverse', lightTheme.colors.text.inverse],
  ] as const)('draws the %s colour from its semantic token', (color, expected) => {
    renderWithProviders(<Logo color={color} />);
    expect(screen.UNSAFE_getByType(Path).props.fill).toBe(expected);
  });
});
