# AI in consumer banking: research brief and design rationale

Prepared for Davy Designs · 7 October 2026 · Status: v1 for design review

## 1. The question

If a national retail bank (the Chase / Bank of America tier) added AI to its mobile app,
what should a design system provide so that teams ship it **safely, accessibly and consistently**?

We are designing the *system layer*: tokens, primitives, fintech components and patterns.
Individual product features come later and will need their own research.

## 2. Method, and its limits

This is **desk research plus design synthesis**. It is not primary research.

- **Done:** regulator publications, industry press releases, published surveys, and public human-AI design guidelines, each checked against the primary source where possible (see `02-evidence-log.md`).
- **Not done:** no customer interviews, usability tests or analytics. Anything about what *our* users do is a hypothesis, and `03-primary-research-plan.md` says how to test it.
- **Confidence labels:** **H** = regulator, standard or peer-reviewed. **M** = reputable organisation, self-reported or sponsored. **L** = vendor-sponsored, no method stated, or only seen in a search snippet.
- **Evidence IDs (E1…E14)** link every claim here to the log. A claim without an ID is my reasoning, not evidence.

## 3. Quantitative evidence

| ID | Finding | n / date | Conf. |
|---|---|---|---|
| E1 | Bank of America's Erica: >3 billion interactions, nearly 50M users since 2018, >58M interactions/month, >1.7B proactive insights delivered, ">98% of users find the information they need" | BofA, Aug 2025 | **M**: company-reported; "find the information" is BofA's own success definition |
| E2 | All of the 10 largest US commercial banks deploy chatbots; ~37% of the US population (>98M people) used a bank chatbot in 2022, projected 110.9M by 2026 | CFPB, Jun 2023 | **H** |
| E4 | 55% of consumers use AI to aid financial decisions (10% a year earlier); 81% prefer some human involvement when calling their bank; <20% would trust AI to make financial recommendations on its own; ~⅔ are comfortable with AI for fraud detection, recommendations, spend tracking; a majority would rather the bank "take longer and have humans check" | TD Bank, n>2,500, Mar 2026 | **M**: bank-run, self-reported |
| E5 | Only 5% used AI for financial decisions; 63% consulted a professional. Trust in advice was similar whether delivered by AI or a human (57% vs 65% on a home purchase; 34% vs 33% on stocks) | FINRA Foundation, n=1,033, Feb 2024 | **H** (but two years old) |
| E10 | 94.8% of the top million home pages had a detectable WCAG 2 failure; **79.1% had low-contrast text**; 48.2% had unlabelled form inputs | WebAIM, Feb 2025 | **H** |
| E11 | Only about ⅓ of UK adults say they heed bank fraud warnings; 32% find them useful; 75% doubt payment delays work | Tunic Pay / Opinium, UK, n not stated | **L**: sponsor sells fraud products |
| E14 | Retail banking satisfaction 655/1000, up 11 points; improvement credited to personalised engagement, fee clarity and fast problem resolution | J.D. Power, Mar 2025 | **M**: seen via press summary |

**What the numbers do and don't support**

- E4 and E5 are consistent: people accept AI doing *background work* and still want a human accountable for *decisions*. Both are self-reported attitudes, not behaviour.
- E1 shows proactive, conversational AI can reach scale. But ">98% find the information" is not "98% resolved their problem", and BofA does not publish how it is measured. Use it as an adoption benchmark, not a quality benchmark.
- **I found no verifiable Chase consumer-AI statistics.** One widely repeated "25% higher engagement" figure traces to an aggregator site, so it is excluded. JPMorgan's publicly documented AI work is largely employee-facing. Benchmarks here therefore lean on Bank of America and the regulators.

## 4. Qualitative synthesis

Themes drawn from the sources, in rough order of design impact.

| Theme | Summary | Evidence |
|---|---|---|
| **T1. Accept it in the background, want a human on the decision** | Comfort is high for fraud detection and spend tracking, low for AI deciding alone. People will trade speed for a human check. | E4, E5 |
| **T2. The failure regulators watch is being trapped** | The CFPB's "doom loop": repeated unhelpful answers with no route to a person. | E2 |
| **T3. Chatbots miss the moments that carry legal weight** | Scripted or statistical bots fail to recognise that a customer is disputing a transaction or invoking a right. | E2 |
| **T4. Explanations matter most when stakes are high or results surprise** | Explain in response to the user's action; name the factors; offer a counterfactual; say what data was used. | E6, E7, E3 |
| **T5. Confidence displays can mislead** | Prefer categories over percentages; don't show confidence that doesn't change the decision; users may over-trust "high". | E6 |
| **T6. Proactive insight works, if it's relevant, controllable and correctable** | Scale exists (E1). Guidelines call for timing by context, granular feedback, global controls, and notice of changes. | E1, E7 |
| **T7. Generic warnings get ignored** | Directional evidence that click-through warnings fail. Specific, contextual, actionable warnings are the hypothesis to test. | E11 (L) |
| **T8. Accessibility is a differentiator, not a given** | Low contrast and unlabelled controls are the industry's most common failures. Dynamic AI content adds a new risk: unannounced updates. | E10, E9 |

## 5. Regulation and standards that shape the design

This is design input, **not legal advice**. Compliance and counsel must review before anything ships.

| Source | What it says | Consequence for the system |
|---|---|---|
| **EU AI Act, Art. 50(1)** (E8) | Systems that interact with people must inform them they are dealing with AI, unless obvious. Applies from 2 Aug 2026. | A disclosure primitive that is always present, never hidden, and translatable. |
| **ECOA / Reg B adverse-action duty** (E3) | Creditors must give *specific* reasons for adverse credit decisions, and "the model is too complex" is not a defence. The CFPB circular stating this is reported withdrawn (May 2025); the statutory duty is unchanged. Verify with counsel. | Explanation components that carry *named factors*, not a generic "our system decided". |
| **CFPB chatbot report** (E2) | Expects institutions to meet existing obligations; flags wrong answers, missed disputes, doom loops, chat-log privacy. It gives **no prescriptive design rules**. | A persistent route to a human; escalation triggers for regulated intents; minimal retention UI. |
| **Model-risk guidance** (E12) | SR 26-2 (17 Apr 2026) replaced SR 11-7. Secondary sources say generative AI is out of scope; I could not confirm this in the primary text. | Do not rely on regulators defining GenAI rules for us. Build audit-friendly UI: every AI output labelled, explainable and loggable. |
| **WCAG 2.2 SC 4.1.3 Status Messages (AA)** (E9) | Status changes must be announced to assistive tech without moving focus. | Streaming and "thinking" states announce once, politely; no focus theft. |
| **Reg E error resolution** | Disputes of electronic transfers carry formal timelines. *(Design inference, not separately researched.)* | Dispute intents route to a formal flow, never a chat answer. |

## 6. Insights and "how might we"

1. **People want AI to *prepare*, and a human to *decide*.** (T1) → *HMW let AI draft a payment while the customer stays visibly in control of sending it?*
2. **The worst outcome is a dead end.** (T2, T3) → *HMW make "talk to a person" always reachable, and automatic when the topic is regulated or the bot is struggling?*
3. **Trust is built by showing the work at the right moment.** (T4, T5) → *HMW explain an insight in two taps, with real factors and a way to change it?*
4. **Uncertainty is a feature of forecasts, not a flaw to hide.** (T5) → *HMW show an estimate honestly as a range, without false precision or alarm?*
5. **Warnings must earn attention.** (T7) → *HMW make a scam warning specific enough that it changes a decision?*
6. **Dynamic content must be perceivable by everyone.** (T8) → *HMW stream or update AI content without excluding screen-reader, low-vision and motion-sensitive users?*

## 7. Design principles

1. **Say it's AI, plainly and always.** Labels use words plus an icon, never an icon alone. (E8, E7-G1/2)
2. **AI proposes, people dispose.** Money moves only after an explicit human confirmation. (E4, E7-G9)
3. **Always an exit to a person.** Visible from the first message; automatic on regulated or failing conversations. (E2, E4)
4. **Recognise what carries legal weight.** Disputes, fraud and hardship leave the chat and enter a formal flow. (E2)
5. **Show the work.** Name the data and the factors; offer a way to change or stop it. (E6, E7-G11, E3)
6. **Calibrate, don't decorate.** Categorical confidence, only where it informs a choice. Ranges for estimates. (E6)
7. **Consent and control, not buried settings.** Data use is visible, scoped and reversible. (E7-G17, E2)
8. **Accessible by construction.** Dynamic content announced once; no colour-only meaning; motion respects the user's setting. (E9, E10)
9. **Ask for feedback you can act on.** Reasons, not just thumbs. (E7-G15)

## 8. What the design system adds

Each artifact exists because of a principle. A component with no row here should not ship.

| Layer | Addition | Principle | Evidence |
|---|---|---|---|
| **Tokens** | `ai` colour group, `confidence` colours, motion durations, reduced-motion helper, AI icons, AI strings | 1, 6, 8 | E8, E6, E9 |
| **Primitives** | `AILabel` | 1 | E8 |
| | `Banner` | 1, 3 | E2 |
| | `Chip` (suggestions) | 3, 4 | E2 |
| | `Disclosure` (expand/collapse) | 5 | E6 |
| | `ThinkingIndicator`, `StreamingText` | 8 | E9 |
| | `MessageBubble` | 1, 8 | E8, E9 |
| | `FeedbackControl` | 9 | E7 |
| | `ConfidenceIndicator` | 6 | E6 |
| **Fintech** | `InsightCard` | 1, 5, 9 | E1, E6 |
| | `MoneyRangeText` | 6 | E6 |
| | `FraudAlertCard` | 4, 3 | E2, E11 |
| | `ActionProposalCard` | 2 | E4 |
| | `DataUseRow` | 7 | E7, E2 |
| | `HumanHandoff` | 3, 4 | E2, E4 |
| **Patterns** | Assistant conversation (disclosure, suggestions, proposal, dispute escalation, handoff) | 1–4 | E2, E4 |
| | Insights feed with "why am I seeing this" | 5, 9 | E1, E6 |
| | Fraud alert triage | 3, 4 | E2, E11 |
| | AI and data controls | 7 | E7 |

## 9. Success measures (summary)

Full definitions, instrumentation and sample sizes are in `04-metrics-and-experiments.md`. In short:
**task success**, **time to a human**, **doom-loop rate**, **dispute-intent recall**, **appropriate reliance** (do people accept correct suggestions and reject wrong ones?), **explanation use**, **opt-out rate**, **complaint rate**, **accessibility conformance**.
*Raw "containment" is deliberately not a success metric:* a bot that traps people scores well on it, which is exactly the failure the CFPB describes (E2).

## 10. Risks and open questions

- **Everything about our users is a hypothesis** until `03-primary-research-plan.md` is run.
- **Evidence age and bias:** E4 is bank-run, E5 is two years old, E11 is vendor-sponsored.
- **Two product choices are unresolved:** whether a customer can ever authorise AI to act without per-action confirmation (this system assumes **no**), and what AI chat retention the bank can legally and ethically offer.
- **Regulatory flux:** model-risk guidance has just changed (E12) and Art. 50 has only just taken effect (E8). Counsel must confirm which duties apply per market.
- **A demo is not a model.** The patterns here use scripted responses. Real accuracy, latency and failure behaviour need an actual model and an evaluation set.
