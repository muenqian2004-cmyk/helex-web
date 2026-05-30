import { readFileSync, writeFileSync } from 'fs';

// ─── Load source data ───
const suitJson = JSON.parse(readFileSync('D:/桌面/arammayhem_augment_suitable_heroes_v3.json', 'utf8'));
const skillJson = JSON.parse(readFileSync('D:/桌面/arammayhem_hero_skill_plans_v1.1.json', 'utf8'));
const heroJson = JSON.parse(readFileSync('D:/桌面/arammayhem_heroes_v1.json', 'utf8'));

function esc(s) {
  return (s || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, '\\n')
    .replace(/\r/g, '');
}

// ─── 1. Paraphrase reason ───
const REWRITE_RULES = [
  // Remove filler/emotional expressions
  [/怕不怕|敢不敢|就完了|没毛病|懂了吧|明白吗|懂？|爽不爽/g, ''],
  [/超强|变态|爆炸|逆天|无敌|碾压/g, '极强'],
  [/每一个/g, '每次'],
  [/增加/g, '提升'],
  [/大幅/g, '显著'],
  [/非常/g, ''],
  [/极其/g, ''],
  [/可吃到/g, '可触发'],
  [/普通攻击/g, '普攻'],
  [/大招/g, '终极技能'],
  [/R技能/g, '终极技能'],
  [/基本攻/g, '基础攻'],
  [/少不了/g, '不可或缺'],
  [/必选/g, '首选'],
  [/核心中的核心/g, '首选'],
  [/锦上添花/g, '进一步提升'],
  [/画龙点睛/g, '完美补强'],
  [/雪中送炭/g, '质变提升'],
  [/如虎添翼/g, '显著增强'],
  [/简直是/g, ''],
  [/太适合了/g, '高度适配'],
  [/不二之选/g, '首选'],
  [/不解释/g, ''],
  [/懂得都懂/g, ''],
  [/谁用谁知道/g, '效果显著'],
  [/简直是绝配/g, '高度适配'],
  [/完美的/g, '理想的'],
  [/无法替代/g, '难以替代'],
  [/脱颖而出/g, '表现出色'],
  [/不可思议/g, '惊人'],
  [/毫无疑问/g, ''],
  [/确实/g, ''],
  [/真的/g, ''],
  [/非常/g, ''],
  [/特别/g, ''],
  [/相当/g, ''],
  [/简直/g, ''],
  [/直接/g, ''],
  [/完全/g, ''],
  [/可以/g, '可'],
  [/能够/g, '能'],
  [/你/g, ''],
  [/一枪一个/g, '秒杀能力极强'],
  [/秒天秒地/g, '爆发极高'],
  [/指数增长/g, '逐层递增'],
  [/滚雪球/g, '持续累积优势'],
  [/起飞/g, '质变'],
  [/质变/g, '质变'],
  [/拉满/g, '最大化'],
  [/点满/g, '升满后'],
  [/叠满/g, '叠满后'],
  [/触发频率高/g, '高频触发'],
  [/双倍快乐/g, '双重增益'],
  [/双重增益/g, '双重增益'],
  // Punctuation cleanup
  [/！+/g, ''],
  [/\.{2,}/g, ''],
  [/~+/g, ''],
  [/\s{2,}/g, ' '],
];

function paraphraseReason(reason) {
  if (!reason || reason.trim() === '') return '';
  let r = reason;
  for (const [pattern, replacement] of REWRITE_RULES) {
    r = r.replace(pattern, replacement);
  }
  // Trim trailing punctuation/whitespace
  r = r.replace(/[，,。\.！!；;]+$/g, '').trim();
  // Ensure it ends properly
  if (r && !/[。！？\)」]$/.test(r)) {
    r = r + '';
  }
  return r;
}

// ─── 2. Rename recommendation type ───
const TYPE_RENAME = {
  '专属推荐': '最佳推荐',
  '适用于该职业': '较为推荐',
  '组合推荐': '套路可玩',
  '相关英雄': '相关英雄',
};

function renameType(t) {
  return TYPE_RENAME[t] || t;
}

// ─── 3. Generate augmentSuitableHeroes.ts ───
const out1 = [];
out1.push("import type { AugmentSuitableHero } from '@/types';");
out1.push('');
out1.push('export const augmentSuitableHeroes: Record<string, AugmentSuitableHero[]> = {');

for (const a of suitJson.augmentSuitableHeroes) {
  if (!a.suitableHeroes || a.suitableHeroes.length === 0) continue;
  const heroes = a.suitableHeroes.map((h) => {
    const newReason = paraphraseReason(h.reasonCn);
    const newType = renameType(h.recommendationTypeCn);
    const sections = '[' + (h.sourceSectionsCn || []).map(s => `'${esc(s)}'`).join(', ') + ']';
    return `{ heroId: '${esc(h.heroId)}', heroNameCn: '${esc(h.heroNameCn)}', heroTitleCn: '${esc(h.heroTitleCn)}', displayNameCn: '${esc(h.displayNameCn)}', recommendationTypeCn: '${esc(newType)}', comboTierCn: '${esc(h.comboTierCn)}', reasonCn: '${esc(newReason)}', sourceSectionsCn: ${sections}, confidence: '${esc(h.confidence || 'medium')}' }`;
  });
  out1.push(`  '${esc(a.augmentId)}': [${heroes.join(', ')}],`);
}
out1.push('};');
out1.push('');

writeFileSync('src/data/augmentSuitableHeroes.ts', out1.join('\n'), 'utf8');
console.log('1. augmentSuitableHeroes.ts: reasons paraphrased, types renamed');

// ─── 4. Build reverse mapping: heroId → enriched augments ───
const heroAugMap = new Map();
for (const a of suitJson.augmentSuitableHeroes) {
  for (const h of a.suitableHeroes || []) {
    if (!heroAugMap.has(h.heroId)) heroAugMap.set(h.heroId, []);
    heroAugMap.get(h.heroId).push({
      augmentId: a.augmentId,
      augmentNameCn: a.augmentNameCn,
      tierCn: h.comboTierCn,
      recommendationTypeCn: renameType(h.recommendationTypeCn),
      reasonCn: paraphraseReason(h.reasonCn),
      confidence: h.confidence || 'medium',
    });
  }
}

// ─── 5. Update heroDetails.ts (augments + skill plans) ───
const augJson = JSON.parse(readFileSync('D:/桌面/arammayhem_hero_augments_and_skills_v2.json', 'utf8'));
const skillMap = new Map();
for (const h of skillJson.heroSkillPlans) skillMap.set(h.heroId, h.skillPlans);

const out2 = [];
out2.push("import type { HeroDetail } from '@/types';");
out2.push('');
out2.push('export const heroDetails: HeroDetail[] = [');

for (const h of augJson.heroAugmentsAndSkills) {
  const augs = h.recommendedAugmentsByTier || {};

  function augArr(tier) {
    const arr = augs[tier] || [];
    return '[' + arr.map((a) =>
      `{ augmentId: '${esc(a.augmentId)}', augmentNameCn: '${esc(a.augmentNameCn)}', tierCn: '${esc(a.tierCn)}', displayOrder: ${a.displayOrder || 0}, sourceUrl: '${esc(a.sourceUrl)}', confidence: '${esc(a.confidence || 'medium')}' }`
    ).join(', ') + ']';
  }

  // Enriched augments from reverse mapping
  const enriched = heroAugMap.get(h.heroId) || [];
  // Merge: deduplicate by augmentId, sort by tier
  const enrichedByTier = { prismatic: [], gold: [], silver: [] };
  const seen = new Set();
  for (const ea of enriched) {
    if (seen.has(ea.augmentId)) continue;
    seen.add(ea.augmentId);
    const tierKey = h.recommendedAugmentsByTier?.prismatic?.some(a => a.augmentId === ea.augmentId) ? 'prismatic' :
                    h.recommendedAugmentsByTier?.gold?.some(a => a.augmentId === ea.augmentId) ? 'gold' :
                    h.recommendedAugmentsByTier?.silver?.some(a => a.augmentId === ea.augmentId) ? 'silver' : null;
    if (tierKey) {
      enrichedByTier[tierKey].push(ea);
    }
  }

  // Add enriched data as comments in the augment entries
  const enrichedAugMap = new Map();
  for (const ea of enriched) enrichedAugMap.set(ea.augmentId, ea);

  function augArrEnriched(tier) {
    const arr = augs[tier] || [];
    return '[' + arr.map((a) => {
      const enr = enrichedAugMap.get(a.augmentId);
      const recType = enr ? renameType(enr.recommendationTypeCn) : '';
      const recReason = enr ? paraphraseReason(enr.reasonCn) : '';
      const recTier = enr?.tierCn || '';
      return `{ augmentId: '${esc(a.augmentId)}', augmentNameCn: '${esc(a.augmentNameCn)}', tierCn: '${esc(a.tierCn)}', displayOrder: ${a.displayOrder || 0}, sourceUrl: '${esc(a.sourceUrl)}', confidence: '${esc(a.confidence || 'medium')}', recommendationTypeCn: '${esc(recType)}', comboHeroTierCn: '${esc(recTier)}', reasonHeroCn: '${esc(recReason)}' }`;
    }).join(', ') + ']';
  }

  // Skill plans
  const plans = skillMap.get(h.heroId) || [];
  const plansStr = '[' + plans.map((p) => {
    const priorityArr = '[' + (p.skillPriority || []).map(s => `'${esc(s)}'`).join(', ') + ']';
    const orderArr = '[' + (p.levelUpOrder || []).map(s => `'${esc(s)}'`).join(', ') + ']';
    return `{ planOrder: ${p.planOrder || 0}, skillPriority: ${priorityArr}, skillPriorityCn: '${esc(p.skillPriorityCn)}', levelUpOrder: ${orderArr}, sourceTextCn: '${esc(p.sourceTextCn)}', confidence: '${esc(p.confidence || 'medium')}', notes: '${esc(p.notes)}', sourceUrl: '${esc(p.sourceUrl)}' }`;
  }).join(', ') + ']';

  out2.push('  {');
  out2.push(`    heroId: '${esc(h.heroId)}',`);
  out2.push(`    prismaticAugments: ${augArrEnriched('prismatic')},`);
  out2.push(`    goldAugments: ${augArrEnriched('gold')},`);
  out2.push(`    silverAugments: ${augArrEnriched('silver')},`);
  out2.push(`    skillPlans: ${plansStr},`);
  out2.push('  },');
}

out2.push('];');
out2.push('');
out2.push('export const heroDetailsByHeroId: Record<string, HeroDetail> = Object.fromEntries(');
out2.push('  heroDetails.map((h) => [h.heroId, h])');
out2.push(');');
out2.push('');

writeFileSync('src/data/heroDetails.ts', out2.join('\n'), 'utf8');
console.log('2. heroDetails.ts: enriched with reverse-mapped augment suitability data');

console.log('3. All migrations complete');
