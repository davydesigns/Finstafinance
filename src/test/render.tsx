import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';

import { LocaleProvider, type DeepPartial, type Strings } from '@/i18n';
import { ThemeProvider } from '@/theme';

/** Renders inside the same providers the real app uses. */
export function renderWithProviders(ui: ReactElement, { locale = 'en-US', strings }: { locale?: string; strings?: DeepPartial<Strings> } = {}) {
  return render(
    <ThemeProvider>
      <LocaleProvider locale={locale} strings={strings}>
        {ui}
      </LocaleProvider>
    </ThemeProvider>,
  );
}
