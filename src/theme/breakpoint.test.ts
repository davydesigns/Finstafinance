import { breakpoint, breakpointFor } from './tokens/size';

describe('breakpointFor()', () => {
  it.each([
    [320, 'compact'],
    [390, 'compact'],
    [breakpoint.medium - 1, 'compact'],
    [breakpoint.medium, 'medium'],
    [768, 'medium'],
    [breakpoint.expanded - 1, 'medium'],
    [breakpoint.expanded, 'expanded'],
    [1440, 'expanded'],
  ])('%p wide is %s', (width, expected) => {
    expect(breakpointFor(width)).toBe(expected);
  });
});
