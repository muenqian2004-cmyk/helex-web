import { readFileSync, writeFileSync } from 'fs';

const data = JSON.parse(readFileSync('D:/桌面/arammayhem_invincible_combos_v3.json', 'utf8'));

function esc(s) {
  return (s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, '\\n').replace(/\r/g, '');
}

const out = [];
out.push("import type { InvincibleCombo } from '@/types';");
out.push('');
out.push('export const invincibleCombos: InvincibleCombo[] = [');

for (const c of data.invincibleCombos) {
  const aliases = '[' + (c.heroAliasesUsed || []).map(a => `'${esc(a)}'`).join(', ') + ']';
  const typeTags = '[' + (c.heroTypeTags || []).map(t => `'${esc(t)}'`).join(', ') + ']';
  const items = '[' + (c.recommendedItemsCn || []).map(i => `'${esc(i)}'`).join(', ') + ']';

  function augArr(arr) {
    return '[' + (arr || []).map(a =>
      `{ augmentId: '${esc(a.augmentId)}', nameCn: '${esc(a.nameCn)}', rarityCn: '${esc(a.rarityCn)}', roleInComboCn: '${esc(a.roleInComboCn || '')}', reasonCn: '${esc(a.reasonCn || '')}' }`
    ).join(', ') + ']';
  }

  out.push('  {');
  out.push(`    comboId: '${esc(c.comboId)}',`);
  out.push(`    heroId: '${esc(c.heroId)}',`);
  out.push(`    heroNameCn: '${esc(c.heroNameCn)}',`);
  out.push(`    heroAliasesUsed: ${aliases},`);
  out.push(`    heroTypeTags: ${typeTags},`);
  out.push(`    comboNameCn: '${esc(c.comboNameCn)}',`);
  out.push(`    powerLevelCn: '${esc(c.powerLevelCn)}',`);
  out.push(`    powerSpikeCn: '${esc(c.powerSpikeCn)}',`);
  out.push(`    requiredAugments: ${augArr(c.requiredAugments)},`);
  out.push(`    optionalAugments: ${augArr(c.optionalAugments)},`);
  out.push(`    recommendedItemsCn: ${items},`);
  out.push(`    skillOrPlaystyleCn: '${esc(c.skillOrPlaystyleCn)}',`);
  out.push(`    whyBeforeComboNotBrokenCn: '${esc(c.whyBeforeComboNotBrokenCn)}',`);
  out.push(`    whyComboIsBrokenCn: '${esc(c.whyComboIsBrokenCn)}',`);
  out.push(`    counterplayOrWeaknessCn: '${esc(c.counterplayOrWeaknessCn)}',`);
  out.push(`    confidence: '${esc(c.confidence || 'medium')}',`);
  out.push('  },');
}

out.push('];');
out.push('');

writeFileSync('src/data/invincibleCombos.ts', out.join('\n'), 'utf8');
console.log(`Written ${data.invincibleCombos.length} invincible combos`);
