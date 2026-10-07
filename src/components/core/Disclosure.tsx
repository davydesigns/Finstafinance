import { useState, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme';

import { IconBase } from './Icon';
import { TextBase } from './Text';
import { useFocusRing } from './useFocusRing';

export interface DisclosureProps {
  title: string;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  children: ReactNode;
}

/** A heading that expands to reveal more. Reports expanded/collapsed to screen readers. */
export function Disclosure({ title, defaultExpanded = false, onExpandedChange, children }: DisclosureProps) {
  const { colors, space, radius, touchTarget } = useTheme();
  const { handlers, ringStyle } = useFocusRing();
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ expanded }}
        onPress={() => {
          setExpanded(!expanded);
          onExpandedChange?.(!expanded);
        }}
        {...handlers}
        style={{
          minHeight: touchTarget,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: space[3],
          borderRadius: radius.md,
          ...ringStyle,
        }}
      >
        <TextBase variant="bodyStrong" colorValue={colors.text.link} style={{ flexShrink: 1 }}>
          {title}
        </TextBase>
        <IconBase name={expanded ? 'chevron-up' : 'chevron-down'} size="small" colorValue={colors.text.link} />
      </Pressable>
      {expanded ? <View style={{ paddingBottom: space[2], gap: space[3] }}>{children}</View> : null}
    </View>
  );
}
