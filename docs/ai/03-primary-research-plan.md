# Primary research plan

The brief's insights are hypotheses. These six studies test them with real people. None has been run.

**Recruiting rule for every study:** include at least **5 participants who use assistive technology** (screen reader, voice control, magnification) and a mix of ages and digital confidence. Accessibility is a design requirement here (principle 8), not a separate workstream.

**Sample-size basis.** For qualitative usability work, the common problem-discovery model (Nielsen and Landauer, L = 0.31) gives about **84% of problems found at n=5, 95% at n=8, 99% at n=12**. It assumes homogeneous users and similar tasks, so recruit **per segment**, not in total.

| # | Study | Question | Method | Sample | Primary measure | Decision it informs |
|---|---|---|---|---|---|---|
| **S1** | Disclosure comprehension | Do people understand "AI-generated" and "Check important info"? Does the AI label change trust? | Moderated think-aloud + 5-question comprehension quiz, with and without the label | 12 to 15 | Correct paraphrase of "who/what am I talking to"; trust rating (7-pt) | Wording of `AILabel` and `Banner`; whether the label is dismissible (assumption: **no**) |
| **S2** | Trust calibration | Do people accept good AI suggestions and reject bad ones? | Moderated scenario test. Seed insights with a known-correct and a known-wrong claim. Compare with and without "Why am I seeing this?" | 12 to 15 per segment | **Appropriate reliance**: accepted-correct + rejected-wrong, divided by all | Whether `Disclosure`/explanations and `ConfidenceIndicator` improve decisions or only increase confidence |
| **S3** | Human-exit findability | Can people reach a person quickly, at any point? | Unmoderated first-click + timed task on three screens | 40 or more | % first click correct; median seconds | Placement and persistence of `HumanHandoff` |
| **S4** | Proposal verification | Do people catch a wrong AI-drafted transfer before confirming? | Moderated. Seed an error (wrong payee, amount ×10). Eye-tracking optional | 12 to 15 | **Catch rate** of the seeded error | Layout of `ActionProposalCard`; whether a typed re-confirmation is needed for large amounts |
| **S5** | Fraud-alert decision quality | Does a *specific* alert change decisions versus a *generic* warning? | Scenario survey experiment, randomised between subjects | 100 or more per arm | % correct decision on a genuine and on a fake alert | Content model of `FraudAlertCard` |
| **S6** | Assistive-tech walkthrough | Are streamed answers, thinking states and alerts perceivable and operable? | Task walkthroughs with VoiceOver, TalkBack, Switch Control and Voice Control on real devices | 5 or more AT users | Task completion; announcements heard exactly once; no focus loss | Streaming and live-region behaviour; releasing the patterns |

**Sequencing**
1. S6 first, on the existing prototypes. It needs no new build and surfaces blockers early.
2. S1, S3 in parallel (fast, cheap).
3. S4, S2 after those findings.
4. S5 last (largest sample).

**Ethics and safety**
- Use fictitious accounts and amounts only. Never ask participants to reveal real financial data.
- Tell participants the assistant is a prototype with scripted answers.
- Record consent for any session recording.

**What would change the design**
- If S1 shows people read "AI-generated" as "approved", reword it.
- If S2 shows explanations raise confidence in *wrong* suggestions, remove or restructure them.
- If S4's catch rate is below 80% with no friction, add explicit friction (re-type the payee) for AI-drafted money movement.
- If S3 median time to a person exceeds 10 seconds, move the exit up.
