import { readFileSync, writeFileSync } from 'fs';

const heroJson = JSON.parse(readFileSync('D:/桌面/arammayhem_heroes_v1.json', 'utf8'));
const aliasJson = JSON.parse(readFileSync('D:/桌面/lol_hero_aliases_v3.json', 'utf8'));

function esc(s) {
  return (s || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, '\\n')
    .replace(/\r/g, '');
}

// Build alias map: heroId → unique aliases
const aliasMap = new Map();
for (const h of aliasJson.heroAliases) {
  const unique = [...new Set(h.aliases.map(a => a.aliasCn))];
  aliasMap.set(h.heroId, unique);
}

const lines = [];
lines.push("import type { Hero } from '@/types';");
lines.push('');
lines.push('export const heroes: Hero[] = [');

for (const h of heroJson.heroes) {
  const aliases = aliasMap.get(h.heroId) || [];
  const aliasStr = '[' + aliases.map(a => `'${esc(a)}'`).join(', ') + ']';
  const rolesArr = '[' + (h.rolesCn || []).map((r) => `'${esc(r)}'`).join(', ') + ']';

  lines.push('  {');
  lines.push(`    heroId: '${esc(h.heroId)}',`);
  lines.push(`    heroNameCn: '${esc(h.heroNameCn)}',`);
  lines.push(`    heroTitleCn: '${esc(h.heroTitleCn)}',`);
  lines.push(`    displayNameCn: '${esc(h.displayNameCn)}',`);
  lines.push(`    aliases: ${aliasStr},`);
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

const totalAliases = [...aliasMap.values()].reduce((s, a) => s + a.length, 0);
console.log(`Written ${heroJson.heroes.length} heroes with ${totalAliases} aliases`);
