import { View } from 'react-native';

import { Disclosure, Row, Stack, Text } from '@/components/core';
import { TextBase } from '@/components/core/Text';
import { useStrings } from '@/i18n';
import { useTheme } from '@/theme';

export interface BarDatum {
  /** The axis label: "Mon", "Oct". */
  label: string;
  value: number;
  /** The value as words, formatted by the app: "$42.10". Used in the table and the highlight. */
  valueLabel: string;
}

export interface BarChartProps {
  /** What the chart shows: "Spending by day". */
  title: string;
  /**
   * The chart's text alternative: say the point of it, not just the shape. "You spent most on Saturday, $142."
   * Screen readers hear this instead of the bars, and the table below holds every value.
   */
  summary: string;
  data: readonly BarDatum[];
  /** Which bar to emphasise: the largest (default), a position, or none. */
  highlight?: 'max' | number | 'none';
  /** Plot height in points. */
  height?: number;
}

/**
 * A column chart that is readable without seeing it. The bars are a glance; the point is written
 * out (`summary`), the highlighted value is labelled, and every value is in a table one tap away.
 * Bars are neutral except the highlighted one, and the highlight is also labelled, so colour is never the only cue.
 */
export function BarChart({ title, summary, data, highlight = 'max', height = 140 }: BarChartProps) {
  const { colors, space, radius, depth } = useTheme();
  const strings = useStrings();

  const max = Math.max(0, ...data.map((d) => d.value));
  const peak = data.findIndex((d) => d.value === max);
  const highlighted = highlight === 'none' ? -1 : highlight === 'max' ? peak : highlight;

  return (
    <Stack gap={3}>
      <View accessible accessibilityRole="image" accessibilityLabel={`${title}. ${summary}`}>
        <Row gap={2} align="end" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          {data.map((datum, index) => {
            const on = index === highlighted;
            const barHeight = max > 0 ? Math.max(space[1], Math.round((datum.value / max) * height)) : space[1];
            return (
              <View key={datum.label} style={{ flex: 1, alignItems: 'center', gap: space[1] }}>
                <View style={{ height: height + space[5], justifyContent: 'flex-end', alignItems: 'center', gap: space[1], width: '100%' }}>
                  {on ? (
                    <TextBase variant="caption" colorValue={colors.text.primary} numberOfLines={1}>
                      {datum.valueLabel}
                    </TextBase>
                  ) : null}
                  <View
                    style={[
                      {
                        width: '70%',
                        maxWidth: space[10],
                        height: barHeight,
                        borderTopLeftRadius: radius.sm,
                        borderTopRightRadius: radius.sm,
                        backgroundColor: on ? colors.action.primary : colors.border.strong,
                      },
                      depth.control,
                    ]}
                  />
                </View>
                <TextBase variant="caption" colorValue={colors.text.secondary}>
                  {datum.label}
                </TextBase>
              </View>
            );
          })}
        </Row>
      </View>

      <Disclosure title={strings.chart.viewAsTable}>
        <Stack gap={1}>
          {data.map((datum) => (
            <View
              key={datum.label}
              accessible
              accessibilityLabel={`${datum.label}, ${datum.valueLabel}`}
              style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space[3], minHeight: space[6] }}
            >
              <Text variant="bodySmall" color="secondary">
                {datum.label}
              </Text>
              <Text variant="bodySmall">{datum.valueLabel}</Text>
            </View>
          ))}
        </Stack>
      </Disclosure>
    </Stack>
  );
}
