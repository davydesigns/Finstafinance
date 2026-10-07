import { softDarkTheme, softLightTheme } from '@/theme/themes';
import { compositeOver, contrastRatio } from '@/utils/contrast';

import { DEPTH_FLOOR } from './depthFloor';

describe.each([softLightTheme, softDarkTheme])('depth legibility: soft $name', (theme) => {
  const ink = theme.depthInk;
  const surface = theme.colors.surface.primary;

  it('has shadow inks', () => {
    expect(ink).not.toBeNull();
  });

  it(`dark shadow is at least ${DEPTH_FLOOR.shade}:1 against the surface`, () => {
    const seen = compositeOver(ink!.shade.color, ink!.shade.alpha, surface);
    expect(contrastRatio(seen, surface)).toBeGreaterThanOrEqual(DEPTH_FLOOR.shade);
  });

  it(`light highlight is at least ${DEPTH_FLOOR.light}:1 against the surface`, () => {
    const seen = compositeOver(ink!.light.color, ink!.light.alpha, surface);
    expect(contrastRatio(seen, surface)).toBeGreaterThanOrEqual(DEPTH_FLOOR.light);
  });

  it('shade is darker and highlight is lighter than the surface', () => {
    const shade = compositeOver(ink!.shade.color, ink!.shade.alpha, surface);
    const light = compositeOver(ink!.light.color, ink!.light.alpha, surface);
    expect(contrastRatio(shade, '#000000')).toBeLessThan(contrastRatio(surface, '#000000'));
    expect(contrastRatio(light, '#000000')).toBeGreaterThan(contrastRatio(surface, '#000000'));
  });

  it('page and surfaces are one material (that is what makes depth read)', () => {
    expect(theme.colors.surface.primary).toBe(theme.colors.background.primary);
    expect(theme.colors.surface.elevated).toBe(theme.colors.background.primary);
  });
});
