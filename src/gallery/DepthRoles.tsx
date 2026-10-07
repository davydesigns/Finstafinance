import { View } from 'react-native';

import { Row, Stack, Text } from '@/components/core';
import { useTheme, type Depth } from '@/theme';

const ROLES: { role: keyof Depth; use: string }[] = [
  { role: 'surface', use: 'Cards, rows, panels' },
  { role: 'floating', use: 'Elevated cards, menus, sheets' },
  { role: 'control', use: 'Secondary buttons, chips, segments' },
  { role: 'field', use: 'Inputs and tracks' },
  { role: 'pressed', use: 'Any control while pressed or selected' },
];

/** The five depth roles as the current style draws them. Documentation only. */
export function DepthRoles() {
  const { colors, depth, radius, space, size, borderWidth } = useTheme();
  const tile = size.minActionWidth - space[6];
  return (
    <Row gap={5} wrap align="start">
      {ROLES.map(({ role, use }) => {
        // Clean has no pressed depth, and flat roles have no shadow: say so rather than drawing a blank tile.
        const shadow = depth[role];
        const hasShadow = shadow !== null && shadow.boxShadow !== undefined && shadow.boxShadow.length > 0;
        const note = shadow === null ? 'no change' : hasShadow ? '' : 'flat';
        return (
          <Stack key={role} gap={2} align="center" style={{ width: tile + space[4] }}>
            <View
              style={[
                shadow ?? null,
                {
                  width: tile,
                  height: tile,
                  borderRadius: radius.md,
                  backgroundColor: colors.surface.primary,
                  // Without any depth a tile needs an edge to be seen at all, which is Clean's whole approach.
                  borderWidth: hasShadow ? borderWidth.none : borderWidth.thin,
                  borderColor: colors.border.default,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            >
              {note ? <Text variant="caption" color="secondary">{note}</Text> : null}
            </View>
            <Text variant="label">{role}</Text>
            <Text variant="caption" color="secondary" style={{ textAlign: 'center' }}>
              {use}
            </Text>
          </Stack>
        );
      })}
    </Row>
  );
}
