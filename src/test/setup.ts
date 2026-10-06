// Icons load a font asynchronously, which causes noisy act() warnings in tests.
// Render a plain host element that keeps the props we assert on.
jest.mock('@expo/vector-icons', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- jest.mock factories cannot use imports
  const { createElement } = require('react');
  return { Ionicons: (props: Record<string, unknown>) => createElement('Icon', props) };
});
