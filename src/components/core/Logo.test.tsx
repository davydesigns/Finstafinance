import { screen } from '@testing-library/react-native';
import Svg, { Path } from 'react-native-svg';

import { renderWithProviders } from '@/test/render';
import { lightTheme } from '@/theme';

import { DesignedBy } from './DesignedBy';
import { FINSTA_MARK, FINSTA_STACKED } from './finstaLogoPath';
import { Logo } from './Logo';

describe('Logo (Finsta)', () => {
  it('is announced as an image named after the brand', () => {
    renderWithProviders(<Logo />);
    expect(screen.getByLabelText('Finsta').props.accessibilityRole).toBe('image');
  });

  it('accepts a custom spoken name', () => {
    renderWithProviders(<Logo label="Finsta home" />);
    expect(screen.getByLabelText('Finsta home')).toBeTruthy();
  });

  it('can be hidden from screen readers when decorative', () => {
    renderWithProviders(<Logo decorative />);
    expect(screen.queryByLabelText('Finsta')).toBeNull();
  });

  it('scales with the size token, keeping the artwork proportions', () => {
    renderWithProviders(
      <>
        <Logo variant="stacked" size="small" />
        <Logo variant="stacked" size="large" />
      </>,
    );
    const [small, large] = screen.UNSAFE_getAllByType(Svg);
    expect(large.props.height / small.props.height).toBeCloseTo(64 / 24);
    expect(small.props.width / small.props.height).toBeCloseTo(FINSTA_STACKED.width / FINSTA_STACKED.height);
  });

  it('mark and stacked use their own proportions', () => {
    renderWithProviders(<Logo variant="mark" />);
    const svg = screen.UNSAFE_getByType(Svg);
    expect(svg.props.width / svg.props.height).toBeCloseTo(FINSTA_MARK.width / FINSTA_MARK.height);
  });

  it('horizontal draws the mark and the wordmark', () => {
    renderWithProviders(<Logo variant="horizontal" />);
    expect(screen.UNSAFE_getAllByType(Path)).toHaveLength(2);
  });

  it.each([
    ['primary', lightTheme.colors.text.primary],
    ['brand', lightTheme.colors.action.primary],
    ['secondary', lightTheme.colors.text.secondary],
    ['inverse', lightTheme.colors.text.inverse],
  ] as const)('draws the %s colour from its semantic token', (color, expected) => {
    renderWithProviders(<Logo color={color} variant="mark" />);
    expect(screen.UNSAFE_getByType(Path).props.fill).toBe(expected);
  });
});

describe('DesignedBy (Davy Designs credit)', () => {
  it('reads as one sentence', () => {
    renderWithProviders(<DesignedBy />);
    expect(screen.getByLabelText('Designed by Davy Designs')).toBeTruthy();
  });

  it('is quiet: drawn in the secondary text colour, never the brand or an alert colour', () => {
    renderWithProviders(<DesignedBy />);
    expect(screen.UNSAFE_getByType(Path).props.fill).toBe(lightTheme.colors.text.secondary);
  });
});
