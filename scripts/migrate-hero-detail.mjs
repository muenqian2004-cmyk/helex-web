import { readFileSync, writeFileSync } from 'fs';

const augData = JSON.parse(readFileSync('D:/桌面/arammayhem_hero_augments_and_skills_v2.json', 'utf8'));
const skillData = JSON.parse(readFileSync('D:/桌面/arammayhem_hero_skill_plans_v1.1.json', 'utf8'));

function esc(s) {
  return (s || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, '\\n')
    .replace(/\r/g, '');
}

const skillMap = new Map();
for (const h of skillData.heroSkillPlans) {
  skillMap.set(h.heroId, h.skillPlans);
}

const out = [];
out.push("import type { HeroDetail } from '@/types';");
out.push('');
out.push('export const heroDetails: HeroDetail[] = [');

for (const h of augData.heroAugmentsAndSkills) {
  const augs = h.recommendedAugmentsByTier || {};

  function augArr(tier) {
    const arr = augs[tier] || [];
    return '[' + arr.map((a) =>
      `{ augmentId: '${esc(a.augmentId)}', augmentNameCn: '${esc(a.augmentNameCn)}', tierCn: '${esc(a.tierCn)}', displayOrder: ${a.displayOrder || 0}, sourceUrl: '${esc(a.sourceUrl)}', confidence: '${esc(a.confidence || 'medium')}' }`
    ).join(', ') + ']';
  }

  // Skill plans (3 per hero from v1.1)
  const plans = skillMap.get(h.heroId) || [];
  const plansStr = '[' + plans.map((p) => {
    const priorityArr = '[' + (p.skillPriority || []).map(s => `'${esc(s)}'`).join(', ') + ']';
    const orderArr = '[' + (p.levelUpOrder || []).map(s => `'${esc(s)}'`).join(', ') + ']';
    return `{ planOrder: ${p.planOrder || 0}, skillPriority: ${priorityArr}, skillPriorityCn: '${esc(p.skillPriorityCn)}', levelUpOrder: ${orderArr}, sourceTextCn: '${esc(p.sourceTextCn)}', confidence: '${esc(p.confidence || 'medium')}', notes: '${esc(p.notes)}', sourceUrl: '${esc(p.sourceUrl)}' }`;
  }).join(', ') + ']';

  out.push('  {');
  out.push(`    heroId: '${esc(h.heroId)}',`);
  out.push(`    prismaticAugments: ${augArr('prismatic')},`);
  out.push(`    goldAugments: ${augArr('gold')},`);
  out.push(`    silverAugments: ${augArr('silver')},`);
  out.push(`    skillPlans: ${plansStr},`);
  out.push('  },');
}

out.push('];');
out.push('');
out.push('export const heroDetailsByHeroId: Record<string, HeroDetail> = Object.fromEntries(');
out.push('  heroDetails.map((h) => [h.heroId, h])');
out.push(');');
out.push('');

writeFileSync('src/data/heroDetails.ts', out.join('\n'), 'utf8');
console.log(`Written ${augData.heroAugmentsAndSkills.length} hero detail entries`);
console.log(`Skill plan counts: ${skillData.heroSkillPlans.length} heroes`);
