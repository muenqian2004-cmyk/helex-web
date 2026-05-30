import { readFileSync, writeFileSync } from 'fs';

const json = JSON.parse(readFileSync('D:/桌面/arammayhem_heroes_v1.json', 'utf8'));

function esc(s) {
  return (s || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, '\\n')
    .replace(/\r/g, '');
}

const lines = [];
lines.push("import type { Hero } from '@/types';");
lines.push('');
lines.push('export const heroes: Hero[] = [');

for (const h of json.heroes) {
  const rolesArr = '[' + (h.rolesCn || []).map((r) => `'${esc(r)}'`).join(', ') + ']';

  lines.push('  {');
  lines.push(`    heroId: '${esc(h.heroId)}',`);
  lines.push(`    heroNameCn: '${esc(h.heroNameCn)}',`);
  lines.push(`    heroTitleCn: '${esc(h.heroTitleCn)}',`);
  lines.push(`    displayNameCn: '${esc(h.displayNameCn)}',`);
  lines.push(`    roles: ${rolesArr},`);
  lines.push(`    primaryRoleCn: '${esc(h.primaryRoleCn)}',`);
  lines.push(`    tierCn: '${esc(h.tierCn)}',`);
  lines.push(`    tierCode: '${esc(h.tierCode)}',`);
  lines.push(`    iconUrl: '${esc(h.championIconUrl)}',`);
  lines.push(`    sourceUrl: '${esc(h.sourceUrl)}',`);
  lines.push(`    confidence: '${h.confidence === 'high' ? 'high' : 'medium'}',`);
  lines.push(`    status: 'active',`);
  lines.push('  },');
}

lines.push('];');
lines.push('');

writeFileSync('src/data/heroes.ts', lines.join('\n'), 'utf8');
console.log(`Written ${json.heroes.length} heroes to src/data/heroes.ts`);
