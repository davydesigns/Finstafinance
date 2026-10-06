import { render } from '@testing-library/react-native';
import type { ReactElement, ReactNode } from 'react';

import { LocaleProvider, type DeepPartial, type Strings } from '@/i18n';
import { ThemeProvider } from '@/theme';

/** Renders inside the same providers the real app uses. `rerender` keeps them. */
export function renderWithProviders(ui: ReactElement, { locale = 'en-US', strings }: { locale?: string; strings?: DeepPartial<Strings> } = {}) {
  function Providers({ children }: { children: ReactNode }) {
    return (
      <ThemeProvider>
        <LocaleProvider locale={locale} strings={strings}>
          {children}
        </LocaleProvider>
      </ThemeProvider>
    );
  }
  return render(ui, { wrapper: Providers });
}
