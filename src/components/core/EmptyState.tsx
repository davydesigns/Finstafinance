import { View } from 'react-native';

import { useTheme } from '@/theme';

import { Button } from './Button';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

export interface EmptyStateProps {
  icon: IconName;
  /** Say what is empty and why in plain words: "No matching transactions", not "Nothing here". */
  title: string;
  /** What the person can do next. */
  children?: string;
  /** One clear next step. */
  action?: { label: string; onPress: () => void };
}

/** What a list or page shows when there is nothing to show: it explains, and offers a way forward. */
export function EmptyState({ icon, title, children, action }: EmptyStateProps) {
  const { colors, space, depth, size } = useTheme();
  const tile = size.avatar + space[5];
  return (
    <View style={{ alignItems: 'center', gap: space[3], paddingVertical: space[6], paddingHorizontal: space[4] }}>
      <View
        style={[
          { width: tile, height: tile, borderRadius: tile / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface.accent },
          depth.control,
        ]}
      >
        <Icon name={icon} size="large" color="link" />
      </View>
      <Text variant="heading3" style={{ textAlign: 'center' }}>
        {title}
      </Text>
      {children ? (
        <Text color="secondary" style={{ textAlign: 'center', maxWidth: size.maxReadableWidth / 1.5 }}>
          {children}
        </Text>
      ) : null}
      {action ? <Button label={action.label} variant="secondary" onPress={action.onPress} /> : null}
    </View>
  );
}
