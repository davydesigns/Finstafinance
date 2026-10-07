import { createContext, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';
import { Platform, useColorScheme } from 'react-native';

import { useHydrated } from '@/utils/useHydrated';

import { themeFor, type StyleName, type Theme, type ThemeName } from './themes';
import { usePrefersMoreContrast } from './usePrefersMoreContrast';

export type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  /** The style the visitor chose (not necessarily the one showing: see `styleYielded`). */
  stylePreference: StyleName;
  setStylePreference: (style: StyleName) => void;
  /** True when Soft was chosen but Clean is showing, because the device asks for more contrast. */
  styleYielded: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

let urlStyle: StyleName | null | undefined;

/** `?style=soft` on the page address, read once so a shared link opens in that style. Web only. */
function readUrlStyle(): StyleName | null {
  if (urlStyle !== undefined) return urlStyle;
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  const value = new URLSearchParams(window.location.search).get('style');
  urlStyle = value === 'soft' || value === 'clean' ? value : null;
  return urlStyle;
}

const subscribeNever = () => () => undefined;

export function ThemeProvider({ children }: { children: ReactNode }) {
  // On web, the server-built HTML is light and Clean, so the first render must be too. See useHydrated.
  const hydrated = useHydrated();
  const systemScheme = useColorScheme();
  const prefersMoreContrast = usePrefersMoreContrast();
  const [preference, setPreference] = useState<ThemePreference>('system');
  const [chosenStyle, setChosenStyle] = useState<StyleName | null>(null);
  // As an external store so the server snapshot (null) and the browser's value reconcile cleanly.
  const urlChoice = useSyncExternalStore(subscribeNever, readUrlStyle, () => null);

  const value = useMemo<ThemeContextValue>(() => {
    const system = hydrated && systemScheme === 'dark' ? 'dark' : 'light';
    const scheme: ThemeName = preference === 'system' ? system : preference;
    const stylePreference = chosenStyle ?? urlChoice ?? 'clean';
    // Soft steps aside when the device asks for more contrast. See docs/soft/01-accessible-neumorphism.md.
    const styleYielded = stylePreference === 'soft' && prefersMoreContrast;
    const theme = themeFor(scheme, styleYielded ? 'clean' : stylePreference);
    return { theme, preference, setPreference, stylePreference, setStylePreference: setChosenStyle, styleYielded };
  }, [preference, chosenStyle, urlChoice, systemScheme, hydrated, prefersMoreContrast]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useThemeContext(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used inside <ThemeProvider>');
  return value;
}

/** The active theme: colours, spacing, type, depth, and so on. */
export function useTheme(): Theme {
  return useThemeContext().theme;
}

/** For the theme switcher UI only. */
export function useThemePreference() {
  const { preference, setPreference } = useThemeContext();
  return { preference, setPreference };
}

/** For the style switcher UI only: Clean or Soft. */
export function useStylePreference() {
  const { stylePreference, setStylePreference, styleYielded } = useThemeContext();
  return { stylePreference, setStylePreference, yielded: styleYielded };
}

interface ThemeScopeProps {
  /** Pin the style for everything inside. */
  style: StyleName;
  /** Pin the colour scheme too. Defaults to whatever the surrounding app is showing. */
  scheme?: ThemeName;
  children: ReactNode;
}

/**
 * Show part of a screen in a fixed theme whatever the visitor chose, e.g. Clean and Soft side by side.
 * It is for documentation and comparison: a real app picks one style and uses `ThemeProvider` alone.
 */
export function ThemeScope({ style, scheme, children }: ThemeScopeProps) {
  const parent = useThemeContext();
  const value = useMemo<ThemeContextValue>(
    () => ({ ...parent, theme: themeFor(scheme ?? parent.theme.name, style) }),
    [parent, scheme, style],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
