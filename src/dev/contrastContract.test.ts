import * as fs from 'fs';
import * as path from 'path';

import { allThemes, type SemanticColors } from '@/theme/themes';
import { contrastRatio } from '@/utils/contrast';

import { contrastPairs } from './contrastPairs';

describe.each(allThemes.map((theme) => [`${theme.style} ${theme.name}`, theme] as const))('contrast contract: %s theme', (_label, theme) => {
  it.each(contrastPairs.map((pair) => [pair.label, pair] as const))('%s', (_label, pair) => {
    const ratio = contrastRatio(pair.fg(theme.colors), pair.bg(theme.colors));
    expect(ratio).toBeGreaterThanOrEqual(pair.min);
  });
});

/** Records every token path a function reads, e.g. "text.primary", "status.success.text". */
function recordPaths(read: (c: SemanticColors) => unknown, into: Set<string>) {
  const make = (prefix: string): unknown =>
    new Proxy(
      {},
      {
        get(_target, key) {
          const next = prefix ? `${prefix}.${String(key)}` : String(key);
          into.add(next);
          return make(next);
        },
      },
    );
  read(make('') as SemanticColors);
}

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.tsx?$/.test(entry.name) && !/\.test\./.test(entry.name) ? [full] : [];
  });
}

/**
 * Tokens that legitimately need no pair, with the reason:
 *  - disabled colours are exempt from WCAG contrast
 *  - border.default is a decorative container edge, not an identifying boundary
 */
const EXEMPT = new Set(['text.disabled', 'action.disabled', 'border.default']);

describe('contrast coverage', () => {
  const covered = new Set<string>();
  for (const pair of contrastPairs) {
    recordPaths(pair.fg, covered);
    recordPaths(pair.bg, covered);
  }

  it('every colour token a component reads appears in a contrast pair (or is exempt)', () => {
    const used = new Map<string, string>();
    const pattern = /\b(?:colors|c)\.(background|surface|text|border|action|status)\.(\w+)(?:\.(text|background))?/g;
    for (const file of sourceFiles(path.join(__dirname, '../components'))) {
      for (const match of fs.readFileSync(file, 'utf8').matchAll(pattern)) {
        const [, group, name, leaf] = match;
        const tokenPath = group === 'status' && leaf ? `${group}.${name}.${leaf}` : `${group}.${name}`;
        used.set(tokenPath, path.basename(file));
      }
    }

    const uncovered = [...used].filter(([p]) => !covered.has(p) && !EXEMPT.has(p)).map(([p, f]) => `${p} (used in ${f})`);
    expect(uncovered).toEqual([]);
  });

  it.each(['success', 'warning', 'danger', 'info', 'neutral'])('status "%s" text and tint are both covered', (tone) => {
    expect(covered.has(`status.${tone}.text`)).toBe(true);
    expect(covered.has(`status.${tone}.background`)).toBe(true);
  });
});
