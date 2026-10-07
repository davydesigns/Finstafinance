import { View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';

import { useHydrated } from '@/utils/useHydrated';
import { useTheme } from '@/theme';

export interface SparklineProps {
  values: readonly number[];
  /** The text alternative, and it should state the trend: "Balance up 3.2% over 30 days". */
  label: string;
  width?: number;
  height?: number;
}

/** A tiny trend line. A glance, not a reading: the value that matters is always written next to it. */
export function Sparkline({ values, label, width = 96, height = 32 }: SparklineProps) {
  const { colors } = useTheme();
  const hydrated = useHydrated();
  const pad = 3;

  if (values.length < 2) return null;
  const min = Math.min(...values);
  const span = Math.max(...values) - min || 1;
  const point = (value: number, index: number) => ({
    x: pad + (index / (values.length - 1)) * (width - pad * 2),
    y: pad + (1 - (value - min) / span) * (height - pad * 2),
  });
  const points = values.map(point);
  const last = points[points.length - 1];

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={label} style={{ width, height }}>
      {hydrated ? (
        <Svg width={width} height={height} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Polyline
            points={points.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke={colors.action.primary}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx={last.x} cy={last.y} r={3} fill={colors.action.primary} />
        </Svg>
      ) : null}
    </View>
  );
}
