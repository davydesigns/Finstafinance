import { contrastPairs } from '../src/dev/contrastPairs';
import { allThemes } from '../src/theme/themes';
import { contrastRatio } from '../src/utils/contrast';

let failures = 0;
for (const theme of allThemes) {
  console.log(`\n${theme.style.toUpperCase()} ${theme.name.toUpperCase()}`);
  for (const pair of contrastPairs) {
    const ratio = contrastRatio(pair.fg(theme.colors), pair.bg(theme.colors));
    const ok = ratio >= pair.min;
    if (!ok) failures += 1;
    console.log(`${ok ? 'pass' : 'FAIL'}  ${ratio.toFixed(2).padStart(5)} (needs ${pair.min})  ${pair.label}`);
  }
}
if (failures > 0) {
  console.error(`\n${failures} contrast pair(s) below WCAG AA.`);
  process.exit(1);
}
console.log('\nAll contrast pairs pass.');
