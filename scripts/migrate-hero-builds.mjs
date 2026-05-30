import { readFileSync, writeFileSync } from 'fs';

const augData = JSON.parse(readFileSync('D:/桌面/arammayhem_hero_recommended_augments_v1.json', 'utf8'));
const itemData = JSON.parse(readFileSync('D:/桌面/arammayhem_hero_item_equipment_v3.json', 'utf8'));

function esc(s) {
  return (s || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, '\\n')
    .replace(/\r/g, '');
}

const heroBuildMap = new Map();
for (const h of itemData.heroItemBuilds) {
  heroBuildMap.set(h.heroId, h.itemBuilds);
}

function itemsGroup(group) {
  if (!group || !Array.isArray(group)) return '[]';
  return '[' + group.map((g) => {
    const items = (g.items || []).map((it) =>
      `{ itemNameCn: '${esc(it.itemNameCn)}', itemIconUrl: '${esc(it.itemIconUrl || '')}', notes: '${esc(it.notes)}' }`
    );
    return `{ buildOrder: ${g.buildOrder || 0}, winRate: ${g.winRate != null ? g.winRate : 'null'}, items: [${items.join(', ')}] }`;
  }).join(', ') + ']';
}

function bootsArray(boots) {
  if (!boots || !Array.isArray(boots)) return '[]';
  return '[' + boots.map((b) =>
    `{ itemOrder: ${b.itemOrder || 0}, itemNameCn: '${esc(b.itemNameCn)}', itemIconUrl: '${esc(b.itemIconUrl || '')}', winRate: ${b.winRate != null ? b.winRate : 'null'}, notes: '${esc(b.notes)}' }`
  ).join(', ') + ']';
}

// Part 1: heroBuilds
const out = [];
out.push("import type { HeroBuild } from '@/types';");
out.push('');
out.push('export const heroBuilds: HeroBuild[] = [');

let totalAugLinks = 0;
for (const h of augData.heroRecommendedAugments) {
  const bh = heroBuildMap.get(h.heroId) || {};
  const augs = (h.recommendedAugments || []).map((a) => {
    totalAugLinks++;
    return `{ augmentId: '${esc(a.augmentId)}', augmentNameCn: '${esc(a.augmentNameCn)}', rarityCn: '${esc(a.rarityCn)}', recommendationOrder: ${a.recommendationOrder || 1}, recommendationGroupCn: '${esc(a.recommendationGroupCn)}', matchConfidence: '${esc(a.matchConfidence || 'medium')}', notes: '${esc(a.notes)}' }`;
  });

  out.push('  {');
  out.push(`    heroId: '${esc(h.heroId)}',`);
  out.push(`    recommendedAugments: [${augs.join(', ')}],`);
  out.push(`    startingItems: ${itemsGroup(bh.startingItems)},`);
  out.push(`    boots: ${bootsArray(bh.boots)},`);
  out.push(`    coreBuilds: ${itemsGroup(bh.coreBuilds)},`);
  out.push(`    lateGameBuilds: ${itemsGroup(bh.lateGameBuilds)},`);
  out.push('  },');
}

out.push('];');
out.push('');
out.push('export const heroBuildsByHeroId: Record<string, HeroBuild> = Object.fromEntries(');
out.push('  heroBuilds.map((h) => [h.heroId, h])');
out.push(');');
out.push('');

// Part 2: Reverse mapping
const augmentHeroMap = {};
for (const h of augData.heroRecommendedAugments) {
  for (const a of h.recommendedAugments) {
    if (!augmentHeroMap[a.augmentId]) augmentHeroMap[a.augmentId] = [];
    if (!augmentHeroMap[a.augmentId].includes(h.heroId)) {
      augmentHeroMap[a.augmentId].push(h.heroId);
    }
  }
}

out.push('export const augmentHeroMap: Record<string, string[]> = {');
for (const [augId, heroIds] of Object.entries(augmentHeroMap)) {
  const heroStr = heroIds.map(id => `'${esc(id)}'`).join(', ');
  out.push(`  '${esc(augId)}': [${heroStr}],`);
}
out.push('};');

writeFileSync('src/data/heroBuilds.ts', out.join('\n'), 'utf8');
console.log(`Written hero builds for ${augData.heroRecommendedAugments.length} heroes`);
console.log(`Total hero-augment links: ${totalAugLinks}`);
console.log(`Unique augments with heroes: ${Object.keys(augmentHeroMap).length}`);
