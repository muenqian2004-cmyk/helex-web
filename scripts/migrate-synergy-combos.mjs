import { readFileSync, writeFileSync } from 'fs';

const data = JSON.parse(readFileSync('D:/桌面/arammayhem_augment_synergy_combos_v4.json', 'utf8'));

function esc(s) {
  return (s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, '\\n').replace(/\r/g, '');
}

const out = [];
out.push("import type { SynergyCombo } from '@/types';");
out.push('');
out.push('export const synergyCombos: SynergyCombo[] = [');

for (const r of data.comboRules) {
  const heroIds = '[' + (r.heroIds || []).map(h => `'${esc(h)}'`).join(', ') + ']';
  const heroNames = '[' + (r.heroNamesCn || []).map(h => `'${esc(h)}'`).join(', ') + ']';
  const heroTypeTags = '[' + (r.heroTypeTags || []).map(t => `'${esc(t)}'`).join(', ') + ']';
  const items = '[' + (r.recommendedItemsCn || []).map(i => `'${esc(i)}'`).join(', ') + ']';
  const evidence = '[' + (r.evidence || []).map(e =>
    `{ platform: '${esc(e.platform)}', sourceTitle: '${esc(e.sourceTitle)}', sourceUrl: '${esc(e.sourceUrl)}', matchedText: '${esc(e.matchedText)}' }`
  ).join(', ') + ']';

  function augArr(arr) {
    return '[' + (arr || []).map(a =>
      `{ augmentId: '${esc(a.augmentId)}', nameCn: '${esc(a.nameCn)}', rarityCn: '${esc(a.rarityCn)}', roleInComboCn: '${esc(a.roleInComboCn || '')}' }`
    ).join(', ') + ']';
  }

  out.push('  {');
  out.push(`    comboId: '${esc(r.comboId)}',`);
  out.push(`    scopeType: '${esc(r.scopeType)}',`);
  out.push(`    heroIds: ${heroIds},`);
  out.push(`    heroNamesCn: ${heroNames},`);
  out.push(`    heroTypeTags: ${heroTypeTags},`);
  out.push(`    comboNameCn: '${esc(r.comboNameCn)}',`);
  out.push(`    comboTypeCn: '${esc(r.comboTypeCn)}',`);
  out.push(`    requiredAugments: ${augArr(r.requiredAugments)},`);
  out.push(`    optionalAugments: ${augArr(r.optionalAugments)},`);
  out.push(`    recommendedItemsCn: ${items},`);
  out.push(`    playstyleCn: '${esc(r.playstyleCn)}',`);
  out.push(`    whyBeforeComboNotFormedCn: '${esc(r.whyBeforeComboNotFormedCn)}',`);
  out.push(`    comboReasonCn: '${esc(r.comboReasonCn)}',`);
  out.push(`    weaknessCn: '${esc(r.weaknessCn)}',`);
  out.push(`    evidence: ${evidence},`);
  out.push(`    confidence: '${esc(r.confidence || 'medium')}',`);
  out.push(`    needsManualReview: ${r.needsManualReview || false},`);
  out.push('  },');
}

out.push('];');
out.push('');

writeFileSync('src/data/synergyCombos.ts', out.join('\n'), 'utf8');
console.log(`Written ${data.comboRules.length} synergy combos`);
