import { View } from 'react-native';

import { useTheme } from '@/theme';

import { Icon, type IconName } from './Icon';

/** An icon centred in a soft circle. Used to lead rows and cards. */
export function IconTile({ name }: { name: IconName }) {
  const { colors, size, depth } = useTheme();
  return (
    <View
      style={{
        width: size.avatar,
        height: size.avatar,
        borderRadius: size.avatar / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface.accent,
        ...depth.control,
      }}
    >
      <Icon name={name} color="link" />
    </View>
  );
}
