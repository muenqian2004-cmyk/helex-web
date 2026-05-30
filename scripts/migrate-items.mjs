import { readFileSync, writeFileSync } from 'fs';

const data = JSON.parse(readFileSync('D:/桌面/lol_arammayhem_items_v2.1_cn_changes.json', 'utf8'));

function esc(s) {
  return (s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, '\\n').replace(/\r/g, '');
}

const out = [];
out.push("import type { GameItem } from '@/types';");
out.push('');
out.push('export const gameItems: GameItem[] = [');

for (const it of data.items) {
  const tags = '[' + (it.tags || []).map(t => `'${esc(t)}'`).join(', ') + ']';
  const from = '[' + ((it.build?.from) || []).map(i => `'${esc(i)}'`).join(', ') + ']';
  const into = '[' + ((it.build?.into) || []).map(i => `'${esc(i)}'`).join(', ') + ']';

  out.push('  {');
  out.push(`    itemId: '${esc(it.itemId)}',`);
  out.push(`    nameCn: '${esc(it.nameCn)}',`);
  out.push(`    categoryCn: '${esc(it.categoryCn)}',`);
  out.push(`    price: ${it.price || 0},`);
  out.push(`    iconUrl: '${esc(it.icon?.iconUrl || '')}',`);
  out.push(`    descriptionCn: '${esc(it.descriptionCn)}',`);
  out.push(`    plainTextCn: '${esc(it.plainTextCn)}',`);
  out.push(`    tags: ${tags},`);
  out.push(`    buildFrom: ${from},`);
  out.push(`    buildInto: ${into},`);
  out.push(`    isAramModified: ${!!it.isAramModified},`);
  out.push(`    aramChangeCn: '${esc(it.aramMayhem?.aramChangeCn)}',`);
  out.push('  },');
}

out.push('];');
out.push('');
out.push('export const itemsById: Record<string, GameItem> = Object.fromEntries(');
out.push('  gameItems.map((i) => [i.itemId, i])');
out.push(');');
out.push('');

writeFileSync('src/data/gameItems.ts', out.join('\n'), 'utf8');
console.log(`Written ${data.items.length} items`);
