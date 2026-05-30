import { readFileSync, writeFileSync } from 'fs';

const json = JSON.parse(readFileSync('D:/桌面/arammayhem_augments_v6_availability_fixed.json', 'utf8'));

const tierMap = { '棱彩': 'Prismatic', '金色': 'Gold', '银色': 'Silver' };

function esc(s) {
  return (s || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, '\\n')
    .replace(/\r/g, '');
}

const lines = [];
lines.push("import type { Augment } from '@/types';");
lines.push('');
lines.push('export const augments: Augment[] = [');

for (const a of json.augments) {
  const tier = tierMap[a.rarityCn] || 'Silver';
  const stages = a.availabilityStages || [];
  const stageStr = '[' + stages.join(', ') + ']';

  lines.push('  {');
  lines.push(`    augmentId: '${esc(a.augmentId)}',`);
  lines.push(`    augmentNameCn: '${esc(a.augmentNameCn)}',`);
  lines.push(`    tier: '${esc(tier)}',`);
  lines.push(`    effect: '${esc(a.effectCn)}',`);
  lines.push(`    iconUrl: '${esc(a.iconUrl)}',`);
  lines.push(`    winRate: ${a.winRate || 0},`);
  lines.push(`    availabilityStages: ${stageStr},`);
  lines.push(`    sourceType: 'community',`);
  lines.push(`    sourceUrl: '${esc(a.sourceUrl)}',`);
  lines.push(`    confidence: '${a.confidence === 'high' ? 'high' : 'medium'}',`);
  lines.push(`    status: 'active',`);
  lines.push(`    notes: '${esc(a.notes)}',`);
  lines.push('  },');
}

lines.push('];');
lines.push('');
lines.push('export const augmentsById: Record<string, Augment> = Object.fromEntries(');
lines.push('  augments.map((a) => [a.augmentId, a])');
lines.push(');');
lines.push('');

writeFileSync('src/data/augments.ts', lines.join('\n'), 'utf8');
console.log(`Written ${json.augments.length} augments to src/data/augments.ts`);
