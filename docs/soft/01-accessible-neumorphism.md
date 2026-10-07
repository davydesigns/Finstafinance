# Soft: accessible neumorphism (Finsta 2.0)

Soft is a second **visual style** for Finsta. It does not replace Clean (v1.x); it sits beside it. A visitor picks Clean or Soft, and light or dark, independently. That makes four themes, all held to the same contrast contract.

## Why a style and not a re-skin

Soft changes the *material*, not the *meaning*. Every colour role, status hue, AI violet and contrast pair is the same. What changes is how surfaces relate to the page:

| | Clean (1.x) | Soft (2.0) |
|---|---|---|
| Page and surface | Different colours (white on pale grey) | One colour; cards are pushed out of the page |
| Resting surface | Flat, or a single soft shadow if it floats | Twin shadows: highlight up-left, shade down-right |
| Fields | A 3:1 border | A 3:1 border **and** pressed into the page |
| Pressed | Colour change | Colour change **and** pressed-in (solid fills go flat) |
| Corners | 6 / 12 / 16 / 24 | 8 / 16 / 24 / 32 |

## The problem with neumorphism

Neumorphism draws an object's edge with a shadow tinted from the page colour, which caps how different it can be. Measured examples of the classic light-grey palette put the edge at about 1.3 to 1.4:1, well under the 3:1 that WCAG 1.4.11 sets for the visual cues people need to identify a control or its state. Reviewers add three further failures: controls vanish under low-vision simulation, designers drop icon labels, and states become ambiguous because everything is the same soft surface. (Sources S1, S2.)

There is a second, mechanical problem. In forced-colours modes such as Windows high contrast, `box-shadow` is set to `none`. A style made only of shadows has no controls left. (Source S3.)

## The rule: shadows are never the only signal

Soft keeps the feel and refuses to let the feel carry meaning.

1. **Edges stay.** Buttons (secondary), chips, segments and inputs keep a border at 3:1 or better. Tertiary buttons are text-only and need none.
2. **Selected is a fill.** The chosen segment is a solid colour; depth only reinforces it.
3. **State is never shadow alone.** Pressing also changes colour. A solid button goes flat and darker (inset shadows only muddy a saturated fill).
4. **AI never blends in.** AI surfaces keep their violet tint and edge in Soft, so generated content is always recognisable.
5. **Text contract unchanged.** Every text and boundary pair is checked in all four themes.
6. **Depth has a floor.** WCAG is silent about decorative shadows, which is how a shadow gets tuned into invisibility. The design team sets its own minimum: the dark shadow reads at 1.3:1 or better over the surface, the highlight at 1.2:1. Measured values: light 1.56 and 1.23, dark 1.34 and 1.29.
7. **Soft steps aside.** If the device asks for more contrast (iOS Increase Contrast, `prefers-contrast: more`) or forces colours, Soft pauses and Clean is shown, and the switcher says why.

## How it is built

- **Depth roles are tokens**, named by role like colour: `surface`, `floating`, `control`, `field`, `pressed`. A component asks for a role; the theme decides the shadow. No component branches on "is this Soft".
- **Theme = scheme × style.** `themeFor('dark', 'soft')`. `lightTheme` and `darkTheme` are unchanged, so Clean is byte-for-byte what shipped in v1.1.
- **`radius` is per style.** Same names, larger values in Soft, so no component changed its radius code.
- **Palette stays private.** The Soft neutrals (`mist100` to `mist300`, `mistShade`) live in the palette and are reached only through semantic tokens, as ESLint enforces.
- **`ThemeScope`** renders any subtree in a fixed style for side-by-side documentation. A real app uses `ThemeProvider` alone.
- **Shareable.** `?style=soft` on any address opens that style. It is read after hydration so the static build never mismatches.

## What enforces it

| Rule | Where |
|---|---|
| Text and boundary contrast, all four themes | `src/dev/contrastContract.test.ts`, `npm run check:contrast` |
| Depth legibility floor | `src/dev/depthLegibility.test.ts` |
| Edges, fills and state under Soft | `src/dev/softEdges.test.tsx` (mutation-checked: weakening a chip's edge fails it) |
| Clean unchanged | `src/dev/softEdges.test.tsx` (last case) and the unchanged Clean contract |

## Limits, stated plainly

- Not for dense data tables, where rules and edges do more work than depth.
- In dark mode the highlight can only be faint; depth is quieter and the edges carry more.
- Inset shadows in React Native need Android 10 or newer (outset: Android 9). Older Android loses the pressed-in look but keeps every border and colour change, which is the point of rule 1. (Source S4.)
- Checked so far in a desktop browser only. Not yet tested on a physical iPhone or Android device, with VoiceOver or TalkBack, or for scroll performance in very long lists of shadowed rows.
- `?style=soft` shows Clean for a moment before Soft appears, because the static page is built in Clean and the style is applied after hydration.
- Whether Soft reads as calm and trustworthy for a bank is a **hypothesis**. No one has been asked yet.

## Studies to run before calling Soft production-ready

| # | Question | Method | Sample | Measure |
|---|---|---|---|---|
| S7 | Do people find controls and states as quickly in Soft as in Clean? | Unmoderated first-click and state-identification, Clean vs Soft, randomised | 40 or more per arm | % first click correct; median seconds; state misreads |
| S8 | Does Soft hold up for low vision? | Moderated tasks with magnification, large text and a high-brightness screen; include assistive-technology users | 5 or more | Task completion; controls missed |
| S9 | Does Soft change perceived trust or calm for a bank? | Preference and 7-point trust scales after a scripted task, between subjects | 100 or more per arm | Trust and calm ratings; stated preference |
| S6 (existing) | Assistive-technology walkthrough | Real devices, now in both styles | 5 or more | Completion; announcements; focus |

Decision rules: if S7 shows Soft slower than Clean by a material margin on any control, strengthen that control's edge before shipping. If S9 shows lower trust, keep Soft as an option for lower-risk surfaces, not for money movement.

## Sources

| ID | Source | What it supports | Confidence |
|---|---|---|---|
| S1 | Axess Lab, "Neumorphism: the accessible and inclusive way", https://axesslab.com/neumorphism/ | Low-vision simulation, dropped labels, ambiguous states; argues the style can be made accessible | Medium (practitioner review, not a study) |
| S2 | W3C, "Understanding SC 1.4.11 Non-text Contrast", https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html ; LogRocket, "Neumorphism UI design", https://blog.logrocket.com/ux-design/neumorphism-ui-design | 3:1 for identifying UI components and states; border as the simple remedy; 1.3 to 1.4:1 edges in classic palettes | High for the criterion; medium for the measured palettes (vendor and blog calculations) |
| S3 | MDN, "forced-colors", https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors | `box-shadow` forced to `none` in forced-colours mode | High (read via search results; confirm wording on the live page) |
| S4 | React Native, "View style props", https://reactnative.dev/docs/view-style-props | `boxShadow` multiple and `inset` shadows; inset needs Android 10+, outset Android 9+ | High; confirm the version note for the installed RN |
| Own | Contrast values in this document | Measured with `src/utils/contrast.ts` against the real tokens | High |

Claims in this document that are about Soft's own tokens are measured by the tests above. Claims about other people's work are only as strong as the table says.
