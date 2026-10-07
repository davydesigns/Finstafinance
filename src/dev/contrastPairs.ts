import type { SemanticColors } from '@/theme/themes';

/** Dev-only: not part of the shipped design-system API. */
/**
 * Contrast contract. Each row is a foreground/background pair that real UI
 * will use, and the WCAG ratio it must meet: 4.5 for text, 3 for UI
 * boundaries and focus indicators. The foundations screen displays these,
 * and `npm run check:contrast` fails if any pair regresses.
 */
export interface ContrastPair {
  label: string;
  fg: (c: SemanticColors) => string;
  bg: (c: SemanticColors) => string;
  min: 3 | 4.5;
}

export const contrastPairs: ContrastPair[] = [
  { label: 'Primary text on background', fg: (c) => c.text.primary, bg: (c) => c.background.primary, min: 4.5 },
  { label: 'Primary text on background (secondary)', fg: (c) => c.text.primary, bg: (c) => c.background.secondary, min: 4.5 },
  { label: 'Primary text on surface', fg: (c) => c.text.primary, bg: (c) => c.surface.primary, min: 4.5 },
  { label: 'Primary text on elevated surface', fg: (c) => c.text.primary, bg: (c) => c.surface.elevated, min: 4.5 },
  { label: 'Secondary text on background', fg: (c) => c.text.secondary, bg: (c) => c.background.primary, min: 4.5 },
  { label: 'Secondary text on surface', fg: (c) => c.text.secondary, bg: (c) => c.surface.primary, min: 4.5 },
  { label: 'Secondary text on elevated surface', fg: (c) => c.text.secondary, bg: (c) => c.surface.elevated, min: 4.5 },
  { label: 'Link on surface', fg: (c) => c.text.link, bg: (c) => c.surface.primary, min: 4.5 },
  { label: 'Link on background', fg: (c) => c.text.link, bg: (c) => c.background.primary, min: 4.5 },
  { label: 'Secondary icon on pressed surface (chevron)', fg: (c) => c.text.secondary, bg: (c) => c.surface.pressed, min: 3 },
  { label: 'Action label on primary', fg: (c) => c.action.onPrimary, bg: (c) => c.action.primary, min: 4.5 },
  { label: 'Action label on primary (pressed)', fg: (c) => c.action.onPrimary, bg: (c) => c.action.primaryPressed, min: 4.5 },
  { label: 'Inverse text on primary action', fg: (c) => c.text.inverse, bg: (c) => c.action.primary, min: 4.5 },
  { label: 'Label on destructive action', fg: (c) => c.action.onDestructive, bg: (c) => c.action.destructive, min: 4.5 },
  { label: 'Label on destructive action (pressed)', fg: (c) => c.action.onDestructive, bg: (c) => c.action.destructivePressed, min: 4.5 },
  { label: 'Text on subtle action tint', fg: (c) => c.action.onSubtle, bg: (c) => c.action.subtle, min: 4.5 },
  { label: 'Action as text on surface', fg: (c) => c.action.primary, bg: (c) => c.surface.primary, min: 4.5 },
  { label: 'Success on its tint', fg: (c) => c.status.success.text, bg: (c) => c.status.success.background, min: 4.5 },
  { label: 'Success on surface', fg: (c) => c.status.success.text, bg: (c) => c.surface.primary, min: 4.5 },
  { label: 'Warning on its tint', fg: (c) => c.status.warning.text, bg: (c) => c.status.warning.background, min: 4.5 },
  { label: 'Warning on surface', fg: (c) => c.status.warning.text, bg: (c) => c.surface.primary, min: 4.5 },
  { label: 'Danger on its tint', fg: (c) => c.status.danger.text, bg: (c) => c.status.danger.background, min: 4.5 },
  { label: 'Danger on surface', fg: (c) => c.status.danger.text, bg: (c) => c.surface.primary, min: 4.5 },
  { label: 'Info on its tint', fg: (c) => c.status.info.text, bg: (c) => c.status.info.background, min: 4.5 },
  { label: 'Info on surface', fg: (c) => c.status.info.text, bg: (c) => c.surface.primary, min: 4.5 },
  { label: 'Neutral on its tint', fg: (c) => c.status.neutral.text, bg: (c) => c.status.neutral.background, min: 4.5 },
  { label: 'Neutral on surface', fg: (c) => c.status.neutral.text, bg: (c) => c.surface.primary, min: 4.5 },
  { label: 'Input border on surface', fg: (c) => c.border.strong, bg: (c) => c.surface.primary, min: 3 },
  { label: 'Focus ring on surface', fg: (c) => c.border.focus, bg: (c) => c.surface.primary, min: 3 },
  { label: 'Focus ring on background', fg: (c) => c.border.focus, bg: (c) => c.background.primary, min: 3 },
  // Combinations components actually produce (added by accessibility audit)
  { label: 'Action label on subtle tint (pressed secondary button)', fg: (c) => c.action.primary, bg: (c) => c.action.subtle, min: 4.5 },
  { label: 'Primary text on pressed surface', fg: (c) => c.text.primary, bg: (c) => c.surface.pressed, min: 4.5 },
  { label: 'Secondary text on pressed surface', fg: (c) => c.text.secondary, bg: (c) => c.surface.pressed, min: 4.5 },
  { label: 'Success on pressed surface', fg: (c) => c.status.success.text, bg: (c) => c.surface.pressed, min: 4.5 },
  { label: 'Success on background', fg: (c) => c.status.success.text, bg: (c) => c.background.primary, min: 4.5 },
  { label: 'Danger on background (input errors)', fg: (c) => c.status.danger.text, bg: (c) => c.background.primary, min: 4.5 },
  { label: 'Success on elevated surface', fg: (c) => c.status.success.text, bg: (c) => c.surface.elevated, min: 4.5 },
  { label: 'Danger on elevated surface', fg: (c) => c.status.danger.text, bg: (c) => c.surface.elevated, min: 4.5 },
  { label: 'Link on elevated surface', fg: (c) => c.text.link, bg: (c) => c.surface.elevated, min: 4.5 },
  { label: 'Icon (link) on accent surface', fg: (c) => c.text.link, bg: (c) => c.surface.accent, min: 3 },
  { label: 'Input border on background', fg: (c) => c.border.strong, bg: (c) => c.background.primary, min: 3 },
  { label: 'Secondary button border on background', fg: (c) => c.action.primary, bg: (c) => c.background.primary, min: 3 },
  { label: 'Focus ring on elevated surface', fg: (c) => c.border.focus, bg: (c) => c.surface.elevated, min: 3 },
  { label: 'Tertiary button label on background', fg: (c) => c.action.primary, bg: (c) => c.background.primary, min: 4.5 },
  { label: 'Tertiary button label on elevated surface', fg: (c) => c.action.primary, bg: (c) => c.surface.elevated, min: 4.5 },
  { label: 'Primary action fill on background', fg: (c) => c.action.primary, bg: (c) => c.background.primary, min: 3 },
  { label: 'Destructive fill on background', fg: (c) => c.action.destructive, bg: (c) => c.background.primary, min: 3 },
  // AI surfaces
  { label: 'AI label text on page background', fg: (c) => c.ai.accent, bg: (c) => c.background.primary, min: 4.5 },
  { label: 'AI label text on surface', fg: (c) => c.ai.accent, bg: (c) => c.surface.primary, min: 4.5 },
  { label: 'AI label text on elevated surface', fg: (c) => c.ai.accent, bg: (c) => c.surface.elevated, min: 4.5 },
  { label: 'AI label text on its tint', fg: (c) => c.ai.accent, bg: (c) => c.ai.subtle, min: 4.5 },
  { label: 'Text on AI tint', fg: (c) => c.ai.onSubtle, bg: (c) => c.ai.subtle, min: 4.5 },
  { label: 'Primary text on AI tint', fg: (c) => c.text.primary, bg: (c) => c.ai.subtle, min: 4.5 },
  { label: 'Secondary text on AI tint', fg: (c) => c.text.secondary, bg: (c) => c.ai.subtle, min: 4.5 },
  { label: 'AI border on page background', fg: (c) => c.ai.border, bg: (c) => c.background.primary, min: 3 },
  { label: 'AI border on surface', fg: (c) => c.ai.border, bg: (c) => c.surface.primary, min: 3 },
  { label: 'Link on AI tint', fg: (c) => c.text.link, bg: (c) => c.ai.subtle, min: 4.5 },
  { label: 'Action label on AI tint', fg: (c) => c.action.primary, bg: (c) => c.ai.subtle, min: 4.5 },
  { label: 'Focus ring on AI tint', fg: (c) => c.border.focus, bg: (c) => c.ai.subtle, min: 3 },
  { label: 'Success on AI tint', fg: (c) => c.status.success.text, bg: (c) => c.ai.subtle, min: 4.5 },
  { label: 'Danger on AI tint', fg: (c) => c.status.danger.text, bg: (c) => c.ai.subtle, min: 4.5 },
  // Confidence levels: text on its own tint and on the surface
  { label: 'Confidence high on its tint', fg: (c) => c.confidence.high.text, bg: (c) => c.confidence.high.background, min: 4.5 },
  { label: 'Confidence high on surface', fg: (c) => c.confidence.high.text, bg: (c) => c.surface.primary, min: 4.5 },
  { label: 'Confidence medium on its tint', fg: (c) => c.confidence.medium.text, bg: (c) => c.confidence.medium.background, min: 4.5 },
  { label: 'Confidence medium on surface', fg: (c) => c.confidence.medium.text, bg: (c) => c.surface.primary, min: 4.5 },
  { label: 'Confidence low on its tint', fg: (c) => c.confidence.low.text, bg: (c) => c.confidence.low.background, min: 4.5 },
  { label: 'Confidence low on surface', fg: (c) => c.confidence.low.text, bg: (c) => c.surface.primary, min: 4.5 },
  { label: 'Confidence high on AI tint', fg: (c) => c.confidence.high.text, bg: (c) => c.ai.subtle, min: 4.5 },
  { label: 'Confidence medium on AI tint', fg: (c) => c.confidence.medium.text, bg: (c) => c.ai.subtle, min: 4.5 },
  { label: 'Confidence low on AI tint', fg: (c) => c.confidence.low.text, bg: (c) => c.ai.subtle, min: 4.5 },
  // Banner action buttons sit on every status tint
  { label: 'Action on success tint', fg: (c) => c.action.primary, bg: (c) => c.status.success.background, min: 4.5 },
  { label: 'Action on warning tint', fg: (c) => c.action.primary, bg: (c) => c.status.warning.background, min: 4.5 },
  { label: 'Action on danger tint', fg: (c) => c.action.primary, bg: (c) => c.status.danger.background, min: 4.5 },
  { label: 'Action on info tint', fg: (c) => c.action.primary, bg: (c) => c.status.info.background, min: 4.5 },
  { label: 'Action on neutral tint', fg: (c) => c.action.primary, bg: (c) => c.status.neutral.background, min: 4.5 },
  { label: 'Link on success tint', fg: (c) => c.text.link, bg: (c) => c.status.success.background, min: 4.5 },
  { label: 'Focus ring on warning tint', fg: (c) => c.border.focus, bg: (c) => c.status.warning.background, min: 3 },
  { label: 'Focus ring on danger tint', fg: (c) => c.border.focus, bg: (c) => c.status.danger.background, min: 3 },
  { label: 'Secondary button border on tints (danger)', fg: (c) => c.action.primary, bg: (c) => c.status.danger.background, min: 3 },
];
