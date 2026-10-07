import type { ReactNode } from 'react';

import { Banner, Button, Chip, ProgressBar, type BannerTone, type ButtonSize, type ButtonVariant } from '@/components/core';
import { MoneyText, StatusBadge, type BadgeStatus } from '@/components/fintech';
import type { Theme } from '@/theme';
import { contrastRatio } from '@/utils/contrast';
import { money, spokenMoney } from '@/utils/money';

/**
 * Specs for the playground: each says which props can be changed, how to draw the component, how to write it
 * as code, and what is true about its accessibility right now. Documentation only, not part of the design system.
 */

export type Values = Record<string, string | boolean>;

export type Knob =
  | { key: string; label: string; kind: 'choice'; options: readonly string[] }
  | { key: string; label: string; kind: 'flag' }
  | { key: string; label: string; kind: 'text' };

export interface Fact {
  label: string;
  value: string;
}

export interface Spec {
  name: string;
  summary: string;
  knobs: Knob[];
  defaults: Values;
  render: (v: Values) => ReactNode;
  /** Props to write, in order, as [name, value, defaultValue]. Props equal to their default are left out. */
  props: (v: Values) => [string, string | boolean | number, string | boolean | number | undefined][];
  facts: (v: Values, theme: Theme) => Fact[];
  /** The tokens this component draws from. */
  tokens: (v: Values) => string[];
}

const noop = () => undefined;

function ratio(fg: string, bg: string, min: number): string {
  const r = contrastRatio(fg, bg);
  return `${r.toFixed(2)}:1, needs ${min}:1 (${r >= min ? 'passes' : 'FAILS'})`;
}

export function writeCode(name: string, props: ReturnType<Spec['props']>, selfClosing = true): string {
  const lines = props
    .filter(([, value, fallback]) => value !== fallback && value !== false && value !== '')
    .map(([key, value]) => (value === true ? `  ${key}` : typeof value === 'number' ? `  ${key}={${value}}` : `  ${key}="${value}"`));
  return lines.length ? `<${name}\n${lines.join('\n')}${selfClosing ? '\n/>' : '\n>'}` : `<${name} />`;
}

const BUTTON: Spec = {
  name: 'Button',
  summary: 'The one way to start an action. Four variants, three sizes, loading and disabled states.',
  knobs: [
    { key: 'label', label: 'label', kind: 'text' },
    { key: 'variant', label: 'variant', kind: 'choice', options: ['primary', 'secondary', 'tertiary', 'destructive'] },
    { key: 'size', label: 'size', kind: 'choice', options: ['small', 'medium', 'large'] },
    { key: 'disabled', label: 'disabled', kind: 'flag' },
    { key: 'loading', label: 'loading', kind: 'flag' },
  ],
  defaults: { label: 'Send money', variant: 'primary', size: 'medium', disabled: false, loading: false },
  render: (v) => (
    <Button
      label={String(v.label) || 'Button'}
      variant={v.variant as ButtonVariant}
      size={v.size as ButtonSize}
      disabled={Boolean(v.disabled)}
      loading={Boolean(v.loading)}
      onPress={noop}
    />
  ),
  props: (v) => [
    ['label', String(v.label), undefined],
    ['variant', String(v.variant), 'primary'],
    ['size', String(v.size), 'medium'],
    ['disabled', Boolean(v.disabled), false],
    ['loading', Boolean(v.loading), false],
  ],
  facts: (v, { colors, controlHeight, touchTarget }) => {
    const solid = v.variant === 'primary' || v.variant === 'destructive';
    const fg = solid ? (v.variant === 'destructive' ? colors.action.onDestructive : colors.action.onPrimary) : colors.action.primary;
    const bg = v.variant === 'destructive' ? colors.action.destructive : solid ? colors.action.primary : colors.surface.primary;
    return [
      { label: 'Role', value: 'button' },
      { label: 'Accessible name', value: String(v.label) || 'Button' },
      { label: 'State', value: [v.disabled ? 'disabled' : null, v.loading ? 'busy (announced as "Loading")' : null].filter(Boolean).join(', ') || 'enabled' },
      { label: 'Label contrast', value: v.disabled ? 'exempt while disabled' : ratio(fg, bg, 4.5) },
      { label: 'Size', value: `${controlHeight[v.size as ButtonSize]}pt tall; tappable area at least ${touchTarget}pt` },
      { label: 'Keyboard', value: 'Enter or Space; a 2pt focus ring' },
    ];
  },
  tokens: (v) => [
    v.variant === 'destructive' ? 'colors.action.destructive' : 'colors.action.primary',
    'radius.md',
    'controlHeight',
    'depth.control (Soft)',
    'borderWidth.medium (secondary)',
  ],
};

const CHIP: Spec = {
  name: 'Chip',
  summary: 'A compact choice or suggestion. A toggle when selected, violet when the assistant offers it.',
  knobs: [
    { key: 'label', label: 'label', kind: 'text' },
    { key: 'tone', label: 'tone', kind: 'choice', options: ['default', 'ai'] },
    { key: 'selected', label: 'selected', kind: 'flag' },
    { key: 'icon', label: 'icon', kind: 'flag' },
    { key: 'disabled', label: 'disabled', kind: 'flag' },
  ],
  defaults: { label: 'This month', tone: 'default', selected: false, icon: false, disabled: false },
  render: (v) => (
    <Chip
      label={String(v.label) || 'Chip'}
      tone={v.tone as 'default' | 'ai'}
      selected={Boolean(v.selected)}
      icon={v.icon ? 'sparkles' : undefined}
      disabled={Boolean(v.disabled)}
      onPress={noop}
    />
  ),
  props: (v) => [
    ['label', String(v.label), undefined],
    ['tone', String(v.tone), 'default'],
    ['selected', Boolean(v.selected), false],
    ['icon', v.icon ? 'sparkles' : '', ''],
    ['disabled', Boolean(v.disabled), false],
    ['onPress', '{handlePress}', undefined],
  ],
  facts: (v, { colors, controlHeight, touchTarget }) => {
    const ai = v.tone === 'ai';
    const fg = ai ? colors.ai.onSubtle : v.selected ? colors.action.onSubtle : colors.text.primary;
    const bg = ai ? colors.ai.subtle : v.selected ? colors.action.subtle : colors.surface.primary;
    return [
      { label: 'Role', value: 'button' },
      { label: 'Accessible name', value: String(v.label) || 'Chip' },
      { label: 'State', value: [v.selected ? 'selected' : null, v.disabled ? 'disabled' : null].filter(Boolean).join(', ') || 'not selected' },
      { label: 'Label contrast', value: v.disabled ? 'exempt while disabled' : ratio(fg, bg, 4.5) },
      { label: 'Size', value: `${controlHeight.small}pt tall; tappable area ${touchTarget}pt` },
      { label: 'Selected is also', value: 'a thicker border, so it never depends on colour' },
    ];
  },
  tokens: (v) => [v.tone === 'ai' ? 'colors.ai.*' : 'colors.border.strong', 'radius.full', 'controlHeight.small', 'depth.control (Soft)'],
};

const STATUS_TONE: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  neutral: 'neutral',
  pending: 'info',
};

const BADGE: Spec = {
  name: 'StatusBadge',
  summary: 'A status you can read in greyscale: its own colour, its own icon shape, and a word.',
  knobs: [
    { key: 'status', label: 'status', kind: 'choice', options: ['success', 'warning', 'danger', 'neutral', 'pending'] },
    { key: 'label', label: 'label', kind: 'text' },
  ],
  defaults: { status: 'success', label: 'Active' },
  render: (v) => <StatusBadge status={v.status as BadgeStatus} label={String(v.label) || 'Status'} />,
  props: (v) => [
    ['status', String(v.status), undefined],
    ['label', String(v.label), undefined],
  ],
  facts: (v, { colors }) => {
    const tone = STATUS_TONE[String(v.status)];
    return [
      { label: 'Role', value: 'text, read as one phrase' },
      { label: 'Accessible name', value: String(v.label) || 'Status' },
      { label: 'Three cues', value: 'colour, icon shape and the word, so colour is never alone' },
      { label: 'Text contrast', value: ratio(colors.status[tone].text, colors.status[tone].background, 4.5) },
    ];
  },
  tokens: (v) => [`colors.status.${STATUS_TONE[String(v.status)]}.*`, 'radius.full'],
};

const PROGRESS_STATUS: Record<string, string> = { warning: 'Close to the limit', danger: 'Over budget', success: 'Goal reached' };

const PROGRESS: Spec = {
  name: 'ProgressBar',
  summary: 'How far along something is. Any tone but the default must carry a word.',
  knobs: [
    { key: 'label', label: 'label', kind: 'text' },
    { key: 'tone', label: 'tone', kind: 'choice', options: ['default', 'warning', 'danger', 'success'] },
    { key: 'percent', label: 'percent used', kind: 'choice', options: ['25', '60', '90', '120'] },
  ],
  defaults: { label: 'Dining', tone: 'default', percent: '60' },
  render: (v) => {
    const percent = Number(v.percent);
    const common = { label: String(v.label) || 'Budget', value: percent, max: 100, valueLabel: `${percent}% used` };
    return v.tone === 'default' ? (
      <ProgressBar {...common} />
    ) : (
      <ProgressBar {...common} tone={v.tone as 'warning' | 'danger' | 'success'} statusLabel={PROGRESS_STATUS[String(v.tone)]} />
    );
  },
  props: (v) => [
    ['label', String(v.label), undefined],
    ['value', Number(v.percent), undefined],
    ['max', 100, undefined],
    ['valueLabel', `${v.percent}% used`, undefined],
    ['tone', String(v.tone), 'default'],
    ['statusLabel', v.tone === 'default' ? '' : PROGRESS_STATUS[String(v.tone)], ''],
  ],
  facts: (v, { colors }) => {
    const tone = v.tone as string;
    const fill = tone === 'default' ? colors.action.primary : colors.status[tone as 'warning' | 'danger' | 'success'].text;
    const spoken = [String(v.label) || 'Budget', `${v.percent}% used`, tone === 'default' ? null : PROGRESS_STATUS[tone], `${v.percent} percent`].filter(Boolean).join(', ');
    return [
      { label: 'Role', value: 'progressbar, value 0 to 100' },
      { label: 'Spoken as', value: spoken },
      { label: 'Fill contrast', value: ratio(fill, colors.background.secondary, 3) },
      { label: 'Over 100%', value: 'the bar stops at full; the spoken percentage keeps going' },
    ];
  },
  tokens: (v) => [v.tone === 'default' ? 'colors.action.primary' : `colors.status.${v.tone}.text`, 'colors.background.secondary', 'depth.field (Soft)'],
};

const BANNER: Spec = {
  name: 'Banner',
  summary: 'A notice with an icon and words, so its meaning never depends on colour.',
  knobs: [
    { key: 'tone', label: 'tone', kind: 'choice', options: ['info', 'success', 'warning', 'danger', 'neutral', 'ai'] },
    { key: 'title', label: 'title', kind: 'text' },
    { key: 'action', label: 'action', kind: 'flag' },
  ],
  defaults: { tone: 'info', title: 'Your transfer is on its way', action: false },
  render: (v) => (
    <Banner tone={v.tone as BannerTone} title={String(v.title) || 'Title'} action={v.action ? { label: 'View receipt', onPress: noop } : undefined}>
      It usually arrives within one business day.
    </Banner>
  ),
  props: (v) => [
    ['tone', String(v.tone), 'info'],
    ['title', String(v.title), undefined],
    ['action', v.action ? '{{ label: "View receipt", onPress }}' : '', ''],
  ],
  facts: (v, { colors }) => {
    const ai = v.tone === 'ai';
    const tone = v.tone as 'info' | 'success' | 'warning' | 'danger' | 'neutral';
    const fg = ai ? colors.ai.onSubtle : colors.status[tone].text;
    const bg = ai ? colors.ai.subtle : colors.status[tone].background;
    return [
      { label: 'Role', value: 'text group; title and body read as one sentence' },
      { label: 'Not colour alone', value: 'every tone has its own icon and a title' },
      { label: 'Text contrast', value: ratio(fg, bg, 4.5) },
      { label: 'Action', value: 'stays separately focusable' },
    ];
  },
  tokens: (v) => [v.tone === 'ai' ? 'colors.ai.*' : `colors.status.${v.tone}.*`, 'radius.lg'],
};

const AMOUNTS: Record<string, number> = { '-8214': -8214, '342000': 342000, '2482042': 2482042 };

const MONEY: Spec = {
  name: 'MoneyText',
  summary: 'An amount, as an exact integer of minor units, formatted for the locale.',
  knobs: [
    { key: 'amount', label: 'minor units', kind: 'choice', options: ['-8214', '342000', '2482042'] },
    { key: 'variant', label: 'variant', kind: 'choice', options: ['money', 'moneyLarge'] },
    { key: 'signTone', label: 'signTone', kind: 'choice', options: ['none', 'credits', 'both'] },
    { key: 'masked', label: 'masked', kind: 'flag' },
  ],
  defaults: { amount: '-8214', variant: 'money', signTone: 'none', masked: false },
  render: (v) => (
    <MoneyText
      amount={money(AMOUNTS[String(v.amount)], 'USD')}
      variant={v.variant as 'money' | 'moneyLarge'}
      signTone={v.signTone as 'none' | 'credits' | 'both'}
      masked={Boolean(v.masked)}
    />
  ),
  props: (v) => [
    ['amount', `{money(${v.amount}, 'USD')}`, undefined],
    ['variant', String(v.variant), 'money'],
    ['signTone', String(v.signTone), 'none'],
    ['masked', Boolean(v.masked), false],
  ],
  facts: (v, { colors }) => {
    const amount = money(AMOUNTS[String(v.amount)], 'USD');
    const credit = amount.minor > 0;
    const tinted = (v.signTone === 'credits' && credit) || v.signTone === 'both';
    const fg = tinted ? (credit ? colors.status.success.text : colors.status.danger.text) : colors.text.primary;
    return [
      { label: 'Spoken as', value: v.masked ? 'Amount hidden' : spokenMoney(amount, { signDisplay: v.signTone === 'none' ? 'auto' : 'always' }) },
      { label: 'Signs', value: 'always written as well as coloured; spoken as "plus" and "minus"' },
      { label: 'Numerals', value: 'tabular, so columns of amounts line up' },
      { label: 'Text contrast', value: ratio(fg, colors.surface.primary, 4.5) },
    ];
  },
  tokens: (v) => [`typography.${v.variant}`, 'colors.status.success.text', 'colors.status.danger.text'],
};

export const SPECS: Spec[] = [BUTTON, CHIP, BADGE, PROGRESS, BANNER, MONEY];
