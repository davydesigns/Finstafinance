import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { useHydrated } from '@/utils/useHydrated';

import { darkTheme, lightTheme, type Theme } from './themes';

export type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // On web, the server-built HTML is light, so the first render must be too. See useHydrated.
  const hydrated = useHydrated();
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('system');

  const value = useMemo<ThemeContextValue>(() => {
    const system = hydrated && systemScheme === 'dark' ? 'dark' : 'light';
    const resolved = preference === 'system' ? system : preference;
    return { theme: resolved === 'dark' ? darkTheme : lightTheme, preference, setPreference };
  }, [preference, systemScheme, hydrated]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useThemeContext(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used inside <ThemeProvider>');
  return value;
}

/** The active theme: colours, spacing, type, and so on. */
export function useTheme(): Theme {
  return useThemeContext().theme;
}

/** For the theme switcher UI only. */
export function useThemePreference() {
  const { preference, setPreference } = useThemeContext();
  return { preference, setPreference };
}
