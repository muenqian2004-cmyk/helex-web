import { readFileSync, writeFileSync } from 'fs';

const data = JSON.parse(readFileSync('D:/桌面/arammayhem_augment_suitable_heroes_v3.json', 'utf8'));

function esc(s) {
  return (s || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, '\\n')
    .replace(/\r/g, '');
}

const out = [];
out.push("import type { AugmentSuitableHero } from '@/types';");
out.push('');
out.push('export const augmentSuitableHeroes: Record<string, AugmentSuitableHero[]> = {');

for (const a of data.augmentSuitableHeroes) {
  if (!a.suitableHeroes || a.suitableHeroes.length === 0) continue;

  const heroes = a.suitableHeroes.map((h) => {
    const sections = '[' + (h.sourceSectionsCn || []).map(s => `'${esc(s)}'`).join(', ') + ']';
    return `{ heroId: '${esc(h.heroId)}', heroNameCn: '${esc(h.heroNameCn)}', heroTitleCn: '${esc(h.heroTitleCn)}', displayNameCn: '${esc(h.displayNameCn)}', recommendationTypeCn: '${esc(h.recommendationTypeCn)}', comboTierCn: '${esc(h.comboTierCn)}', reasonCn: '${esc(h.reasonCn)}', sourceSectionsCn: ${sections}, confidence: '${esc(h.confidence || 'medium')}' }`;
  });

  out.push(`  '${esc(a.augmentId)}': [${heroes.join(', ')}],`);
}

out.push('};');
out.push('');

writeFileSync('src/data/augmentSuitableHeroes.ts', out.join('\n'), 'utf8');
console.log(`Written suitable heroes for ${data.augmentSuitableHeroes.length} augments`);
