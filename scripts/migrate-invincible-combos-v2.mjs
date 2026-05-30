import { readFileSync, writeFileSync } from 'fs';

// Read current data from the TypeScript file directly
const currentTs = readFileSync('src/data/invincibleCombos.ts', 'utf8');
// Parse by extracting the JSON-like structure
const jsonMatch = currentTs.match(/export const invincibleCombos: InvincibleCombo\[\] = (\[[\s\S]*?\]);/);
if (!jsonMatch) { console.error('Could not parse invincibleCombos.ts'); process.exit(1); }
const currentCombos = eval(jsonMatch[1] + '');
const original = { invincibleCombos: currentCombos };
const ryzeNew = JSON.parse(readFileSync('D:/桌面/douyin_local_video_combo_瑞天帝_v1.json', 'utf8'));

function esc(s) {
  return (s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, '\\n').replace(/\r/g, '');
}

// Find and replace the Ryze combo, or add if not found
const ryzeRecord = ryzeNew.records[0];
const newRyze = {
  comboId: 'hero_ryze_infinite_loop',
  primarySourcePlatform: '抖音',
  isPlatformQuotaCombo: false,
  heroId: 'ryze',
  heroNameCn: ryzeRecord.hero.heroNameCn + '：' + (ryzeRecord.hero.heroTitleCn || ''),
  heroAliasesUsed: ryzeRecord.hero.aliasesInVideo || [],
  heroTypeTags: ['法师', '持续伤害型'],
  comboNameCn: '瑞天帝·无限属性循环',
  powerLevelCn: '近似无敌',
  powerSpikeCn: ryzeRecord.powerSpikeCn || '',
  requiredAugments: ryzeRecord.coreAugments.map(a => ({
    augmentId: a.augmentId,
    nameCn: a.augmentNameCn,
    rarityCn: a.rarityCn || '银色阶',
    roleInComboCn: a.reasonCn || '',
  })),
  optionalAugments: [],
  recommendedItemsCn: (ryzeRecord.recommendedItems || []).map(i => i.itemNameCn),
  skillOrPlaystyleCn: ryzeRecord.comboLogicCn || '',
  whyBeforeComboNotBrokenCn: '单独拥有物理转魔法或由心及物只能提供单一属性转换，无法形成循环链，瑞兹仍是一个普通法师。',
  whyComboIsBrokenCn: '一旦闭环形成，每件装备和海克斯都在放大属性：魔宗提供攻击力→物理转魔法转AP→被动转法力→由心及物转HP→霸王血铠转回攻击力。每一轮循环属性都被百分比加成放大，理论上可达到21亿属性上限。',
  counterplayOrWeaknessCn: ryzeRecord.weaknessCn || '',
  evidence: [{
    platform: '抖音',
    sourceTitle: '瑞天帝',
    sourceUrl: (ryzeRecord.evidence?.localVideoPath || ''),
    matchedText: (ryzeRecord.evidence?.matchedTextCn || ''),
  }],
  confidence: 'medium',
  needsManualReview: false,
};

// Replace existing ryze combo or add
const combos = [...original.invincibleCombos];
const idx = combos.findIndex(c => c.heroId === 'ryze');
if (idx >= 0) {
  combos[idx] = newRyze;
} else {
  combos.push(newRyze);
}

const out = [];
out.push("import type { InvincibleCombo } from '@/types';");
out.push('');
out.push('export const invincibleCombos: InvincibleCombo[] = [');

for (const c of combos) {
  const aliases = '[' + (c.heroAliasesUsed || []).map(a => `'${esc(a)}'`).join(', ') + ']';
  const typeTags = '[' + (c.heroTypeTags || []).map(t => `'${esc(t)}'`).join(', ') + ']';
  const items = '[' + (c.recommendedItemsCn || []).map(i => `'${esc(i)}'`).join(', ') + ']';
  const evidence = '[' + ((c.evidence || []).map(e =>
    `{ platform: '${esc(e.platform)}', sourceTitle: '${esc(e.sourceTitle)}', sourceUrl: '${esc(e.sourceUrl)}', matchedText: '${esc(e.matchedText)}' }`
  )).join(', ') + ']';

  function augArr(arr) {
    return '[' + (arr || []).map(a =>
      `{ augmentId: '${esc(a.augmentId || a.augmentId)}', nameCn: '${esc(a.nameCn)}', rarityCn: '${esc(a.rarityCn || '')}', roleInComboCn: '${esc(a.roleInComboCn || '')}', reasonCn: '${esc(a.reasonCn || '')}' }`
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
  out.push(`    evidence: ${evidence},`);
  out.push(`    confidence: '${esc(c.confidence || 'medium')}',`);
  out.push(`    needsManualReview: ${c.needsManualReview || false},`);
  out.push('  },');
}

out.push('];');
out.push('');

writeFileSync('src/data/invincibleCombos.ts', out.join('\n'), 'utf8');
console.log(`Written ${combos.length} invincible combos (Ryze combo ${idx >= 0 ? 'replaced' : 'added'})`);
