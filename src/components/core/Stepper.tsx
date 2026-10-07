import { View } from 'react-native';

import { useStrings } from '@/i18n';
import { useTheme } from '@/theme';

import { Row, Stack } from './Stack';
import { Text } from './Text';

export interface StepperProps {
  /** The names of the steps, in order. */
  steps: readonly string[];
  /** Zero-based index of the current step. */
  current: number;
}

/**
 * Where you are in a short flow: "Step 2 of 4 · Amount", with a segment per step.
 * The words carry the meaning; the segments are a glance. Changes are announced politely.
 */
export function Stepper({ steps, current }: StepperProps) {
  const { colors, space, radius } = useTheme();
  const strings = useStrings();
  const index = Math.min(Math.max(current, 0), steps.length - 1);
  const text = strings.stepper.step.replace('{current}', String(index + 1)).replace('{total}', String(steps.length));

  return (
    <Stack gap={2} accessible accessibilityLabel={`${text}, ${steps[index]}`} accessibilityLiveRegion="polite">
      <Row gap={1} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {steps.map((step, i) => (
          <View
            key={step}
            style={{
              flex: 1,
              height: space[1],
              borderRadius: radius.full,
              backgroundColor: i <= index ? colors.action.primary : colors.border.default,
            }}
          />
        ))}
      </Row>
      <Text variant="label" color="secondary">
        {`${text} · ${steps[index]}`}
      </Text>
    </Stack>
  );
}
