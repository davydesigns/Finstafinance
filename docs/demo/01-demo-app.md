# The demo app

A small banking app built only from the design system, on sample data. It exists to show the system under real conditions: forms, money, errors, loading, empty results, and an AI assistant, in both styles and both colour schemes.

Everything in it is invented. Names, merchants, balances and budgets are in `src/demo/data.ts`, the demo's "today" is fixed at Wednesday 7 October 2026, and every screen says it is a demo.

## Screens

| Screen | Route | What it demonstrates |
|---|---|---|
| Overview | `/accounts` | A balance with a trend, a chart that states its point, budgets, accounts, an AI insight, recent activity. Loading skeletons on first visit. Two columns on desktop. |
| Send money | `/send` | A four-step flow with validation, an extra check for larger amounts, a held balance, an error path and a cancel window. |
| Activity | `/activity` | Search and filters that work, a result count that is announced, master-detail, an empty state that helps. |
| Assistant, Security | `/assistant`, `/fraud` | The AI patterns from `docs/ai`, now inside the app frame. |
| Insights, AI and data | `/insights`, `/ai-settings` | Reached from the Overview and Security. |

The folder `src/app/(app)/` is a route group: it shares one frame (`AppShell`) and one set of sample accounts (`DemoProvider`), and the brackets keep it out of the address, so URLs did not change.

## Decisions worth reading

**Every figure is computed.** The chart, the budgets, the balance trend and the insight all come from the same transactions through `src/demo/selectors.ts`, so they cannot disagree. Tests pin the numbers (`demo.test.ts`), and the totals were checked by hand.

**Charts say what they show.** `BarChart` takes a `summary`: "Highest on Friday, $259.75. $747.36 over 7 days." Screen readers hear that instead of seven bars, the peak is labelled as well as coloured, and every value is one tap away in a table.

**Budgets never rely on colour.** `ProgressBar` speaks the figures and the percentage. A tone other than the default must carry a word (the type system enforces it): "Over budget by $30.15", "Close to the limit", each with its own icon.

**Errors wait their turn.** On the Send screen, "enter an amount" is not shown until the first attempt to continue. "More than your available balance" appears the moment it is true, because it cannot become untrue by waiting.

**The money is held at once.** A sent transfer reduces the available balance immediately and appears as pending. Cancelling restores the exact amount (tested). The Overview, Activity and Send screens all read the same state.

**A failure keeps everything.** If the bank rejects a transfer, the person's recipient, amount and note are kept, the message says plainly that nothing was sent and the balance did not change, and "Try again" returns to the review step. "Simulate a bank error" is a labelled demo control, not a product feature.

**An extra check for larger amounts.** From $1,000, the review step asks for the recipient's name to be typed before "Confirm and send" works. The rule is enforced in the logic (`sendFlow.ts`), not only in the interface, and the typed name is cleared if the amount changes, so it cannot be satisfied for a different transfer. This is a **hypothesis**, taken from `docs/ai/03-primary-research-plan.md` (S4): a wrong recipient or an extra zero is the costliest slip, and a tap is easy to make on autopilot. It has not been tested with people; the plan says what result would remove it.

**Privacy mode is a system feature.** "Hide amounts" masks every figure, including the chart labels and budgets, and screen readers hear "hidden", not the number. It is part of `MoneyText`, `AccountCard` and `TransactionRow`, not something each screen reinvents.

**Loading is honest.** Skeletons are shaped like the content, a screen reader hears one "Loading", and they hold still under reduced motion. The delay is simulated and shown once per visit.

**Detail opens in place.** On desktop the detail sits beside the list; on a phone it opens under the row you tapped, so you never scroll away from what you chose.

## Limits

- No real data, no model, no network. The assistant is scripted and says so.
- Checked in a desktop browser only: not yet on a physical device, with VoiceOver or TalkBack, or in usability sessions.
- New recipients, deposits and card controls are not part of the demo, and nothing in it pretends otherwise.
