import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { useHydrated } from '@/utils/useHydrated';

import { defaultStrings, mergeStrings, type DeepPartial, type Strings } from './strings';

interface LocaleContextValue {
  locale: string | undefined;
  strings: Strings;
}

const LocaleContext = createContext<LocaleContextValue>({ locale: undefined, strings: defaultStrings });

interface LocaleProviderProps {
  /** BCP 47 tag like 'en-US'. Omit to follow the device. */
  locale?: string;
  /**
   * Override any built-in string (e.g. to translate). Pass a STABLE object (module constant or
   * memoised): a new object on every render makes every component re-render.
   */
  strings?: DeepPartial<Strings>;
  children: ReactNode;
}

/** Set once near the root, so components never need a `locale` prop. */
export function LocaleProvider({ locale, strings, children }: LocaleProviderProps) {
  // The server formats in en-US, so on web the first render must too. See useHydrated.
  const hydrated = useHydrated();
  const effective = hydrated ? locale : (locale ?? 'en-US');
  const value = useMemo(() => ({ locale: effective, strings: mergeStrings(strings) }), [effective, strings]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

/** The locale to format with. A per-component override wins over the provider. */
export function useLocale(override?: string): string | undefined {
  const { locale } = useContext(LocaleContext);
  return override ?? locale;
}

export function useStrings(): Strings {
  return useContext(LocaleContext).strings;
}
