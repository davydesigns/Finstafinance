import { screen } from '@testing-library/react-native';
import { Dimensions, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { renderWithProviders } from '@/test/render';

import { Screen } from './Screen';
import { Text } from './Text';

const metrics = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 47, left: 0, right: 0, bottom: 34 } };

function renderScreen(width: 'readable' | 'wide', windowWidth: number) {
  jest.spyOn(Dimensions, 'get').mockReturnValue({ width: windowWidth, height: 800, scale: 1, fontScale: 1 });
  return renderWithProviders(
    <SafeAreaProvider initialMetrics={metrics}>
      <Screen width={width}>
        <Text>Content</Text>
      </Screen>
    </SafeAreaProvider>,
  );
}

function flat(style: unknown) {
  return Object.assign({}, ...[style].flat(Infinity).filter(Boolean));
}

/** Walk up from the content to the first ancestor that caps its width. */
function maxWidthAround(node: ReturnType<typeof screen.getByText>) {
  for (let current: typeof node.parent = node; current; current = current.parent) {
    const { maxWidth } = flat(current.props.style);
    if (maxWidth !== undefined) return maxWidth;
  }
  return undefined;
}

afterEach(() => jest.restoreAllMocks());

describe('Screen', () => {
  it('renders its children', () => {
    renderScreen('readable', 390);
    expect(screen.getByText('Content')).toBeTruthy();
  });

  it('caps a readable column', () => {
    renderScreen('readable', 1440);
    expect(maxWidthAround(screen.getByText('Content'))).toBe(640);
  });

  it('caps a wide layout so it never stretches across a monitor', () => {
    renderScreen('wide', 1440);
    expect(maxWidthAround(screen.getByText('Content'))).toBe(1040);
  });

  it('keeps clear of the home indicator', () => {
    renderScreen('readable', 390);
    const scroll = screen.UNSAFE_getByType(ScrollView);
    expect(flat(scroll.props.contentContainerStyle).paddingBottom).toBeGreaterThanOrEqual(34);
  });
});
