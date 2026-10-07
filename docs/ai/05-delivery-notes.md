# Delivery notes

What was built from `01-research-brief.md`, how it was checked, and what is **not** verified.

## Before and after (measured on this codebase)

| Measure | v1.0 | Now | Change |
|---|---|---|---|
| Automated tests | 188 | **335** | +147 |
| Colour pairs in the contrast contract | 48 | **80** (158 checks across light and dark) | +32 |
| Component files (core + ai + fintech) | 15 | **30** | +15 |
| Source lines (excluding tests) | 2,869 | 4,135 | +1,266 |
| Production web bundle (build tool's figure) | 1.7 MB | 1.8 MB | about +6% |
| Lowest contrast among new AI and confidence pairs | n/a | **5.63:1** (AI border on surface; the 3:1 non-text bar) | all pass |

The contrast coverage test, which fails if any component reads a colour token that no contrast pair covers, still passes. That test is what kept the new violet and confidence tokens honest.

## What exists

**Tokens.** Violet palette; semantic `ai.*` (accent, subtle, onSubtle, border) and `confidence.*` (high, medium, low) groups in both themes; motion durations and streaming cadence; `useReducedMotion`; `ai` tone for text and icons; AI wording as overridable strings (so disclosure can be translated).

**Primitives (9, plus 3 generic).** `AILabel`, `ThinkingIndicator`, `StreamingText`, `MessageBubble`, `ConfidenceIndicator`, `FeedbackControl`; generic `Banner`, `Chip`, `Disclosure`; `Card` gained an `ai` tone.

**Fintech components (6).** `MoneyRangeText`, `InsightCard`, `ActionProposalCard`, `FraudAlertCard`, `DataUseRow`, `HumanHandoff`.

**Patterns (4 screens + gallery).** `/assistant` (scripted conversation), `/insights`, `/fraud`, `/ai-settings`, and `/ai` (every component in every state).

## Behaviours that tests lock in

- Disclosure: an assistant message is always announced as "Assistant said, AI-generated: …".
- Streaming: screen readers receive the complete text at once, never character by character. Reduced motion shows text immediately. Completion fires exactly once.
- Money safety: a proposal sends only on the explicit Confirm press. Edit and Cancel never send. While sending, Confirm cannot be pressed twice and the other actions are disabled.
- Forecasts: always a range plus the word "Estimate". A mixed-currency or inverted range throws rather than rendering a wrong number.
- Escalation (engine): disputes and fraud are routed, never answered in chat. A request for a person always gets one. Two misunderstandings in a row hand off to a person, so the streak never reaches three.
- Consent: state is shown in words beside the switch; novel uses (personalised offers) start off; erase is one tap.
- Feedback: "not helpful" asks why before submitting; the thanks is announced once.

## Not verified. Treat as open.

1. **No real devices.** Everything was checked in a desktop browser and in unit tests. VoiceOver, TalkBack, Voice Control and Switch Control behaviour, and the iOS announcements, are **untested**. This is study S6 in `03-primary-research-plan.md`.
2. **No real model.** The assistant is a scripted matcher with a handful of phrases. Accuracy, latency and failure behaviour of a real LLM are unknown. The engine's *rules* (routing, handoff) are what would carry over.
3. **Dispute and fraud detection is a keyword list.** It is deliberately broad, but a real classifier needs a labelled evaluation set and a measured recall target (see the metrics doc).
4. **Wording is unresearched.** "AI-generated", "Check important information" and the rest are reasonable defaults. Study S1 should test comprehension.
5. **Regulatory fit is unreviewed.** Counsel must confirm disclosure duties by market and the status of the adverse-action guidance.
6. **Chase benchmarks are absent.** No verifiable consumer-AI figures were found. Bank of America's published figures stand in as the only industry benchmark.
7. **Window-size screens only on the web.** The conversation layout was checked at 320 to 430pt and desktop, not on a phone's real keyboard behaviour.

## Suggested next steps

1. Run S6 (assistive technology) and S1/S3 (disclosure, human-exit findability): cheap, and they can change the component design.
2. Replace the scripted engine with a model behind the same `respond` contract, and build the offline evaluation set for dispute and fraud recall first.
3. Decide, with Product and Compliance, whether AI may ever act without per-action confirmation. This system assumes it may not.
