# fintech-ds

A React Native fintech design system built with Expo, TypeScript and Expo Router.
No UI framework: tokens, themes and components are written with `StyleSheet`-level primitives.

```bash
nvm use            # Node 20
npm install
npm start          # then press i (iOS simulator) or scan with Expo Go
npm run typecheck
npm run lint
npm run check:contrast   # fails if any colour pair drops below WCAG AA
```

## Architecture

- `src/theme/tokens/`: primitive values (palette, spacing, radius, type, elevation)
- `src/theme/themes.ts`: semantic roles (`text.primary`, `action.primary`, `status.success.text`) mapped for light and dark
- `src/theme/ThemeProvider.tsx`: `useTheme()`; follows the system setting, with a manual override
- `src/components/`: core and fintech components (components read semantic tokens only)
- `src/app/`: Expo Router screens, used as the component gallery

Rule: components never import the raw palette.
