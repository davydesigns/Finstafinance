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
- `src/components/core/`: Text, Button, Card, Icon, Logo, DesignedBy, Screen, Stack/Row, PressableSurface, SegmentedControl.
- `src/components/fintech/`: MoneyText, StatusBadge, TransactionRow, AccountCard, AmountInput, plus the AI set: MoneyRangeText, InsightCard, ActionProposalCard, FraudAlertCard, DataUseRow, HumanHandoff.
- `src/components/ai/`: AILabel, ThinkingIndicator, StreamingText, MessageBubble, ConfidenceIndicator, FeedbackControl.
- `src/patterns/assistant/`: the scripted assistant engine and its safety rules (with tests).
- `docs/ai/`: the research brief, evidence log, research plan and metrics for the AI work.
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

## AI in banking

AI additions are grounded in `docs/ai/01-research-brief.md` (desk research, with every claim traced to an evidence log and a confidence rating). Principles:
say it's AI plainly; AI proposes, people dispose; always an exit to a person; route regulated topics (disputes, fraud)
out of chat; show the work; calibrate confidence rather than decorate it; consent and control; accessible by construction.
The assistant demo is **scripted, not a real model**.

## Brand

**Finsta** is the product's identity. `<Logo>` draws it as a traced vector in three cuts: `horizontal`
(headers), `stacked` (hero areas, as designed) and `mark` (tight spaces). Pick the colour for the surface
it sits on: `primary` (page or card), `brand` (hero areas), `secondary` (footers), `inverse` (on brand-blue
fills). Each follows light/dark mode and uses a token already in the contrast contract. App icon, adaptive
icon, favicon and splash in `assets/` are generated from the same vector (white mark on brand blue `#2557BD`).

**Davy Designs** is the designer. Its mark appears only through `<DesignedBy />`, a quiet credit line.

| Where the credit goes | Where it must not go |
|---|---|
| Home footer, an About or credits page, the social preview card, the README | The app header or any primary brand slot |
| | The app icon, favicon or splash screen |
| | Product screens that simulate a bank or handle money: accounts, transfers, assistant, insights, fraud alerts, AI settings |
| | AI labels and disclosures, banners, errors, or anywhere a customer is deciding something |

Why: those places carry the *product's* identity and the customer's trust. A designer's mark there reads as
the product's own branding. A test (`src/dev/brandPlacement.test.ts`) fails if the credit appears outside the
allowed places.

## Licence

Code: MIT (see `LICENSE`). The Finsta and Davy Designs names, logos and the files derived from them are **not**
covered by that licence and are all rights reserved: see `NOTICE.md`.
