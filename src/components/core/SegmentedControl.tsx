import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme';

import { TextBase } from './Text';
import { useFocusRing } from './useFocusRing';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: readonly Option<T>[];
  value: T;
  onValueChange: (value: T) => void;
  /** Spoken name for the group, e.g. "Theme". */
  accessibilityLabel: string;
}

function Segment({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { colors, radius, touchTarget, borderWidth } = useTheme();
  const { handlers, ringStyle } = useFocusRing();
  return (
    <Pressable
      accessibilityRole="radio"
      // Radio buttons report `checked`; `selected` is kept for platforms that read it.
      accessibilityState={{ checked: selected, selected }}
      aria-checked={selected}
      accessibilityLabel={label}
      onPress={onPress}
      {...handlers}
      style={{
        flex: 1,
        minHeight: touchTarget,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.full,
        backgroundColor: selected ? colors.action.primary : colors.surface.primary,
        borderWidth: borderWidth.thin,
        borderColor: selected ? colors.action.primary : colors.border.strong,
        ...ringStyle,
      }}
    >
      <TextBase
        variant="bodyStrong"
        colorValue={selected ? colors.action.onPrimary : colors.text.primary}
        style={{ textAlign: 'center' }}
      >
        {label}
      </TextBase>
    </Pressable>
  );
}

/** Pick exactly one of a few options. */
export function SegmentedControl<T extends string>({ options, value, onValueChange, accessibilityLabel }: SegmentedControlProps<T>) {
  const { space } = useTheme();
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={accessibilityLabel} style={{ flexDirection: 'row', gap: space[2] }}>
      {options.map((option) => (
        <Segment key={option.value} label={option.label} selected={option.value === value} onPress={() => onValueChange(option.value)} />
      ))}
    </View>
  );
}
