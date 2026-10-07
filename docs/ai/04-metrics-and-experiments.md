# Metrics and experiments

**All targets below are hypotheses.** They are placeholders to be set with Product, Compliance and Risk using real baselines.

## Principle: measure outcomes, not containment

"Containment" (conversations never reaching a human) rewards a bot that traps people, which is the doom loop the CFPB describes (E2). It is **not** a success metric here. It may be tracked only alongside the quality measures below.

## Metric tree

| Goal | Metric | Definition | Direction | Starting hypothesis |
|---|---|---|---|---|
| **Customers get it done** | Task success | Share of AI-assisted tasks completed with the intended outcome, confirmed by a downstream event (payment sent, alert resolved), not by "no further messages" | up | ≥ 80% on top-5 intents |
| | Re-contact rate | Same customer, same issue, within 7 days | down | below the human-channel baseline |
| **Always an exit** | Time to a person | Seconds from tapping "Talk to a person" to a human reply or a scheduled callback confirmation | down | median < 60 s *(or a callback offered within 10 s)* |
| | **Doom-loop rate** | Sessions with 3 or more consecutive fallback or "I didn't understand" turns without escalation offered | down | **target 0**; any occurrence is reviewed |
| **Regulated intents** | Dispute-intent recall | Of conversations that *are* disputes, the share routed to the formal flow (offline labelled set) | up | set with Compliance; treat any miss as an incident |
| **Appropriate trust** | Appropriate reliance | (accepted correct + rejected wrong) ÷ all AI suggestions *(from S2; in production, sample audits)* | up | beat the no-explanation control by ≥ 10 points |
| | Explanation use | "Why am I seeing this?" opens ÷ insights shown | monitor | no target. Low can mean trust or can mean unnoticed |
| | Feedback quality | Share of negative feedback that includes a reason | up | ≥ 40% |
| **Control and consent** | Opt-out rate | Customers who turn off an AI feature or data use | monitor | a rising rate is a signal, not a failure |
| | Control reachability | Taps from an insight to its controls | down | ≤ 2 |
| **Safety** | Money-movement confirmations | AI-drafted transfers executed *without* an explicit human confirm | down | **must be 0 by construction**, verified in audit |
| | Seeded-error catch rate | From S4 | up | ≥ 80% |
| **Accessible** | AT task completion | From S6 | up | 100% of core tasks |
| | Contrast and target conformance | Automated contract (already in CI): every colour pair ≥ AA, targets ≥ 48pt | hold | 100% |
| **Complaints** | AI-related complaints per 10k sessions | Tagged in the complaint system | down | below the pre-AI baseline |

## Instrumentation (event names)

Keep events free of message content and personal data. Log *types* and *counts*.

| Event | Properties |
|---|---|
| `ai_disclosure_shown` | surface, variant |
| `ai_message_rendered` | intent_category, streamed (bool), latency_ms |
| `ai_fallback_turn` | consecutive_count |
| `ai_human_exit_tapped` | surface, trigger (`user` or `auto_regulated` or `auto_fallback`) |
| `ai_regulated_intent_routed` | intent (`dispute`, `fraud`, `hardship`), recognised_by |
| `ai_explanation_opened` | insight_type |
| `ai_feedback_submitted` | polarity, reason_code |
| `ai_proposal_shown` / `ai_proposal_confirmed` / `ai_proposal_edited` / `ai_proposal_dismissed` | amount_band (not amount), edited_fields |
| `ai_data_control_changed` | control_id, new_state |
| `fraud_alert_decision` | decision, seconds_to_decide |

## Experiments

**A/B power calculations** (two-sided α = 0.05, power 0.80, two-proportion test, per arm):

| Scenario | Baseline → target | n per arm |
|---|---|---|
| A rate falls modestly (e.g. complaint-type contacts) | 20% → 18% | **6,039** |
| Same measure, larger effect | 20% → 15% | **906** |
| Task success improves | 80% → 84% | **1,447** |
| Explanation open rate rises | 10% → 13% | **1,774** |

Small effects need thousands of sessions. For low-traffic surfaces, use S1 to S6 (qualitative) and ship behind a flag with guardrail metrics instead of waiting for significance.

**Candidate experiments (post-launch)**
1. **Exit placement:** persistent bar versus appearing after the first fallback. *Guardrail: doom-loop rate must not increase.*
2. **Insight copy:** amount-first versus reason-first. *Measure: explanation use and feedback reasons.*
3. **Warning specificity:** generic versus specific fraud copy (mirrors S5).
4. **Confidence display:** none versus categorical. *Measure: appropriate reliance. Ship only if it improves.*

**Guardrails for every experiment:** doom-loop rate, dispute-intent recall, AT task completion, complaint rate. An experiment that harms any of them stops.

## Baselines this design system already tracks (before this work)

Measured on the existing codebase, so we can show change:

- 188 automated tests; every foreground/background colour pair meets WCAG AA (contrast contract + a coverage test that fails if a component uses an untested colour).
- Minimum touch target 48pt; text scales to 200% for all sizes up to 22pt.
- Production web bundle: see `05-delivery-notes.md` for before/after size.
