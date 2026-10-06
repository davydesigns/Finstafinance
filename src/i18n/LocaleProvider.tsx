import { createContext, useContext, useMemo, type ReactNode } from 'react';

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
  const value = useMemo(() => ({ locale, strings: mergeStrings(strings) }), [locale, strings]);
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
