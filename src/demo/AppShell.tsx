import { Link, usePathname, type Href } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Card, Logo, Stack, Text, useFocusRing, type IconName } from '@/components/core';
import { IconBase } from '@/components/core/Icon';
import { TextBase } from '@/components/core/Text';
import { ThemeSwitcher } from '@/gallery/ThemeSwitcher';
import { useBreakpoint, useTheme } from '@/theme';

import { useDemo } from './DemoProvider';

interface NavItem {
  href: Href;
  /** Routes that count as "here" for the highlight. */
  paths: string[];
  label: string;
  icon: IconName;
}

const NAV: NavItem[] = [
  { href: '/accounts', paths: ['/accounts', '/insights'], label: 'Overview', icon: 'wallet' },
  { href: '/send', paths: ['/send'], label: 'Send', icon: 'send' },
  { href: '/activity', paths: ['/activity'], label: 'Activity', icon: 'receipt' },
  { href: '/assistant', paths: ['/assistant'], label: 'Assistant', icon: 'sparkles' },
  { href: '/fraud', paths: ['/fraud', '/ai-settings'], label: 'Security', icon: 'shield-checkmark' },
];

function NavLink({ item, current, layout }: { item: NavItem; current: boolean; layout: 'bar' | 'side' }) {
  const { colors, space, radius, touchTarget, depth } = useTheme();
  const { handlers, ringStyle } = useFocusRing();
  const side = layout === 'side';
  const color = current ? colors.text.link : colors.text.secondary;

  return (
    <Link href={item.href} asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={current ? `${item.label}, current page` : item.label}
        accessibilityState={{ selected: current }}
        {...handlers}
        style={{
          flex: side ? undefined : 1,
          minHeight: touchTarget,
          flexDirection: side ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: side ? 'flex-start' : 'center',
          gap: side ? space[3] : space[1],
          paddingHorizontal: side ? space[4] : space[1],
          paddingVertical: space[2],
          borderRadius: radius.lg,
          // The current page is a filled shape AND bolder text, not just a different colour.
          backgroundColor: current ? colors.surface.accent : 'transparent',
          ...(current ? depth.control : null),
          ...ringStyle,
        }}
      >
        <IconBase name={item.icon} colorValue={color} />
        <TextBase variant={side ? 'bodyStrong' : 'caption'} colorValue={color} style={current ? { fontWeight: '700' } : undefined}>
          {item.label}
        </TextBase>
      </Pressable>
    </Link>
  );
}

function Controls({ onToggleAppearance, appearanceOpen }: { onToggleAppearance: () => void; appearanceOpen: boolean }) {
  const { state, dispatch } = useDemo();
  return (
    <Stack gap={2}>
      <Button
        label={state.masked ? 'Show amounts' : 'Hide amounts'}
        variant="tertiary"
        size="small"
        accessibilityState={{ expanded: undefined }}
        onPress={() => dispatch({ type: 'toggleMask' })}
      />
      <Button label={appearanceOpen ? 'Close appearance' : 'Appearance'} variant="tertiary" size="small" onPress={onToggleAppearance} />
    </Stack>
  );
}

/**
 * The demo app's frame: a bottom bar on phones, a side bar on desktop. It owns navigation, privacy mode
 * and the appearance switcher, so every screen inside stays about its own job.
 * Always labelled as a demo, because everything in it is sample data.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { colors, space, borderWidth, size } = useTheme();
  const expanded = useBreakpoint() === 'expanded';
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { state, dispatch } = useDemo();
  const [appearance, setAppearance] = useState(false);

  const isCurrent = (item: NavItem) => item.paths.includes(pathname);
  const appearancePanel = appearance ? (
    <View style={{ paddingHorizontal: space[4], paddingBottom: space[3] }}>
      <Card variant="inset" padding="md">
        <Stack gap={2}>
          <Text variant="label">Appearance</Text>
          <ThemeSwitcher />
        </Stack>
      </Card>
    </View>
  ) : null;

  if (expanded) {
    return (
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: colors.background.primary }}>
        <View
          style={{
            width: size.minCardWidth - space[8],
            padding: space[4],
            gap: space[6],
            borderRightWidth: borderWidth.thin,
            borderRightColor: colors.border.default,
            justifyContent: 'space-between',
          }}
        >
          <Stack gap={6}>
            <Link href="/" asChild>
              <Pressable accessibilityRole="link" accessibilityLabel="Finsta home">
                <Logo size="small" />
              </Pressable>
            </Link>
            <Stack gap={1} accessibilityRole="menu">
              {NAV.map((item) => (
                <NavLink key={item.label} item={item} current={isCurrent(item)} layout="side" />
              ))}
            </Stack>
          </Stack>
          <Stack gap={3}>
            <Controls onToggleAppearance={() => setAppearance(!appearance)} appearanceOpen={appearance} />
            {appearance ? (
              <Card variant="inset" padding="md">
                <ThemeSwitcher />
              </Card>
            ) : null}
            <Text variant="caption" color="secondary">
              Demo with sample data. No real accounts or money.
            </Text>
          </Stack>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>{children}</View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: space[3],
          paddingHorizontal: space[4],
          paddingTop: space[3] + insets.top,
          paddingBottom: space[2],
        }}
      >
        <Link href="/" asChild>
          <Pressable accessibilityRole="link" accessibilityLabel="Finsta home" hitSlop={space[2]}>
            <Logo size="small" />
          </Pressable>
        </Link>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[1] }}>
          <Button
            label={state.masked ? 'Show amounts' : 'Hide amounts'}
            variant="tertiary"
            size="small"
            onPress={() => dispatch({ type: 'toggleMask' })}
          />
          <Button label={appearance ? 'Close' : 'Appearance'} variant="tertiary" size="small" onPress={() => setAppearance(!appearance)} />
        </View>
      </View>
      {appearancePanel}
      <View style={{ flex: 1, minHeight: 0 }}>{children}</View>
      <View
        accessibilityRole="menu"
        style={{
          flexDirection: 'row',
          gap: space[1],
          paddingHorizontal: space[2],
          paddingTop: space[2],
          paddingBottom: space[2] + insets.bottom,
          borderTopWidth: borderWidth.thin,
          borderTopColor: colors.border.default,
          backgroundColor: colors.surface.primary,
        }}
      >
        {NAV.map((item) => (
          <NavLink key={item.label} item={item} current={isCurrent(item)} layout="bar" />
        ))}
      </View>
    </View>
  );
}
