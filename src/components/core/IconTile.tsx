import { View } from 'react-native';

import { useTheme } from '@/theme';

import { Icon, type IconName } from './Icon';

/** An icon centred in a soft circle. Used to lead rows and cards. */
export function IconTile({ name }: { name: IconName }) {
  const { colors, controlHeight } = useTheme();
  return (
    <View
      style={{
        width: controlHeight.small,
        height: controlHeight.small,
        borderRadius: controlHeight.small / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.action.subtle,
      }}
    >
      <Icon name={name} color="link" />
    </View>
  );
}
