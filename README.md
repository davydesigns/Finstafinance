# fintech-ds

A React Native fintech design system built with Expo, TypeScript and Expo Router.
No UI framework: tokens, themes and components are written on React Native primitives.

```bash
nvm use                  # Node 20
npm install
npm start                # then scan with Expo Go, or press w for web
npm run check            # typecheck + lint + tests (run before every commit)
```

## Architecture

- `src/theme/tokens/`: primitive values (palette, spacing, radius, type, elevation, sizing).
  The raw `palette` is **not** exported; only `themes.ts` may import it (ESLint enforces this).
- `src/theme/themes.ts`: semantic roles (`text.primary`, `action.primary`, `status.success.text`) for light and dark.
- `src/i18n/`: `LocaleProvider` sets locale once; every built-in string can be overridden.
- `src/components/core/`: Text, Button, Card, Icon, Screen, Stack/Row, PressableSurface, SegmentedControl.
- `src/components/fintech/`: MoneyText, StatusBadge, TransactionRow, AccountCard, AmountInput.
- `src/utils/money.ts`: the `Money` type and formatting. Amounts are **integer minor units** (1250 = $12.50).
- `src/dev/`: dev-only contrast contract. `src/app/`, `src/gallery/`: the component gallery and demo screens.

## Conventions

| Topic | Rule |
|---|---|
| Colour | Components use semantic tokens only. `Text` takes a `color` role or a status `tone`, never a hex. |
| Style props | Consumers may pass **layout** only (margin, flex, alignment). Types reject colour/type overrides. |
| Placement | Components never position themselves. Parents use `Stack`/`Row`. |
| Responsive | Start every screen with `<Screen>` (centred, width-capped, safe-area aware). Branch layouts with `useBreakpoint()` (`compact` < 600, `medium` < 960, `expanded`). Prefer `Row wrap` with `flexGrow` + `flexBasis` tokens over fixed widths, so layouts flex on their own. |
| Money | Always `Money` (`money(1250, 'USD')`), never a bare number. It throws on non-integers. |
| Visible text prop | `label` for controls (Button, StatusBadge, AmountInput); `title` for entities (TransactionRow, AccountCard). |
| Booleans | `disabled`, `loading`, `masked`. Status vocabulary is `success / warning / danger / neutral`. |
| Strings | No hard-coded English in components; add to `src/i18n/strings.ts`. |

## Quality gates (`npm test`)

- Money formatting and parsing unit tests.
- Contrast contract: every foreground/background pair meets WCAG AA in both themes, **and** every colour token a component reads must appear in a pair (or be listed as exempt).
- Accessibility behaviour: labels, roles, states, loading/disabled, error announcements.
