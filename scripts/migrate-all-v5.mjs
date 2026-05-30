import { readFileSync, writeFileSync } from 'fs';

const suitJson = JSON.parse(readFileSync('D:/桌面/arammayhem_augment_suitable_heroes_v3.json', 'utf8'));
const skillJson = JSON.parse(readFileSync('D:/桌面/arammayhem_hero_skill_plans_v1.1.json', 'utf8'));
const augJson = JSON.parse(readFileSync('D:/桌面/arammayhem_hero_augments_and_skills_v2.json', 'utf8'));
// Augment list for tier lookup
const allAugs = JSON.parse(readFileSync('D:/桌面/arammayhem_augments_v6_availability_fixed.json', 'utf8'));
const augTierMap = {};
for (const a of allAugs.augments) {
  augTierMap[a.augmentId] = a.rarityEn; // 'prismatic', 'gold', 'silver' (lowercase)
}

function esc(s) {
  return (s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, '\\n').replace(/\r/g, '');
}

// ─── Paraphrase ───
const REWRITE_RULES = [
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
  r = r.replace(/[，,。\.！!；;]+$/g, '').trim();
  return r;
}

const TYPE_RENAME = {
  '专属推荐': '最佳推荐',
  '适用于该职业': '较为推荐',
  '组合推荐': '套路可玩',
  '相关英雄': '相关英雄',
};

function renameType(t) { return TYPE_RENAME[t] || t; }

// ─── Step 1: Process all augment→hero entries ───
// Build: heroId → { augmentId, augmentNameCn, tierCn, recommendationTypeCn, reasonCn, confidence, heroTier }
const heroAugMap = new Map();

for (const a of suitJson.augmentSuitableHeroes) {
  for (const h of a.suitableHeroes || []) {
    let reason = paraphraseReason(h.reasonCn);
    let type = renameType(h.recommendationTypeCn);
    let tier = h.comboTierCn || '';

    // Requirement 3: assign tier for entries without reason
    if (!reason) {
      if (type === '最佳推荐') tier = 'S';
      else if (type === '较为推荐') tier = 'A';
    }

    if (!heroAugMap.has(h.heroId)) heroAugMap.set(h.heroId, []);
    heroAugMap.get(h.heroId).push({
      augmentId: a.augmentId,
      augmentNameCn: a.augmentNameCn,
      tierCn: tier,
      recommendationTypeCn: type,
      reasonCn: reason,
      confidence: h.confidence || 'medium',
    });
  }
}

// ─── Step 2: Generate augmentSuitableHeroes.ts ───
const out1 = [];
out1.push("import type { AugmentSuitableHero } from '@/types';");
out1.push('');
out1.push('export const augmentSuitableHeroes: Record<string, AugmentSuitableHero[]> = {');

for (const a of suitJson.augmentSuitableHeroes) {
  if (!a.suitableHeroes || a.suitableHeroes.length === 0) continue;
  const heroes = a.suitableHeroes.map((h) => {
    let reason = paraphraseReason(h.reasonCn);
    let type = renameType(h.recommendationTypeCn);
    let tier = h.comboTierCn || '';

    // Requirement 3: assign tier for entries without reason
    if (!reason) {
      if (type === '最佳推荐') tier = 'S';
      else if (type === '较为推荐') tier = 'A';
    }

    const sections = '[' + (h.sourceSectionsCn || []).map(s => `'${esc(s)}'`).join(', ') + ']';
    return `{ heroId: '${esc(h.heroId)}', heroNameCn: '${esc(h.heroNameCn)}', heroTitleCn: '${esc(h.heroTitleCn)}', displayNameCn: '${esc(h.displayNameCn)}', recommendationTypeCn: '${esc(type)}', comboTierCn: '${esc(tier)}', reasonCn: '${esc(reason)}', sourceSectionsCn: ${sections}, confidence: '${esc(h.confidence || 'medium')}' }`;
  });
  out1.push(`  '${esc(a.augmentId)}': [${heroes.join(', ')}],`);
}
out1.push('};');
out1.push('');

writeFileSync('src/data/augmentSuitableHeroes.ts', out1.join('\n'), 'utf8');
console.log('1. augmentSuitableHeroes.ts: tier-assigned for entries without reasons');

// ─── Step 3: Generate heroDetails.ts with cross-reference reverse mapping ───
const skillMap = new Map();
for (const h of skillJson.heroSkillPlans) skillMap.set(h.heroId, h.skillPlans);

const out2 = [];
out2.push("import type { HeroDetail } from '@/types';");
out2.push('');
out2.push('export const heroDetails: HeroDetail[] = [');

for (const h of augJson.heroAugmentsAndSkills) {
  const augs = h.recommendedAugmentsByTier || {};

  // Existing augment IDs from augJson (the original hero→augment mapping)
  const existingIds = new Set();
  for (const tier of ['prismatic', 'gold', 'silver']) {
    for (const a of augs[tier] || []) existingIds.add(a.augmentId);
  }

  // Build enriched augment entries for existing ones
  const enrichedMap = new Map();
  const reverseEntries = heroAugMap.get(h.heroId) || [];
  for (const re of reverseEntries) {
    enrichedMap.set(re.augmentId, re);
  }

  // Requirement 1: Add missing augments from reverse mapping
  // For each reverse entry, if not in hero's existing list, add it to the appropriate tier
  const mergedAugs = { prismatic: [...(augs.prismatic || [])], gold: [...(augs.gold || [])], silver: [...(augs.silver || [])] };

  for (const re of reverseEntries) {
    if (existingIds.has(re.augmentId)) continue; // already present

    // Determine tier from augTierMap
    const rarity = augTierMap[re.augmentId] || 'silver';
    const tierKey = rarity === 'prismatic' ? 'prismatic' : rarity === 'gold' ? 'gold' : 'silver';

    // Build a synthetic augment entry
    mergedAugs[tierKey].push({
      augmentId: re.augmentId,
      augmentNameCn: re.augmentNameCn,
      tierCn: tierKey === 'prismatic' ? '棱彩阶' : tierKey === 'gold' ? '金色阶' : '银色阶',
      displayOrder: 99,
      sourceUrl: '',
      confidence: re.confidence || 'medium',
      // Enriched fields
      recommendationTypeCn: re.recommendationTypeCn,
      comboHeroTierCn: re.tierCn,
      reasonHeroCn: re.reasonCn,
      _fromReverse: true,
    });
  }

  const addedCount = mergedAugs.prismatic.length + mergedAugs.gold.length + mergedAugs.silver.length
    - (augs.prismatic || []).length - (augs.gold || []).length - (augs.silver || []).length;

  function augArrEnriched(tier) {
    const arr = mergedAugs[tier] || [];
    return '[' + arr.map((a) => {
      const recType = a.recommendationTypeCn || '';
      const recReason = a.reasonHeroCn || '';
      const recTier = a.comboHeroTierCn || '';
      return `{ augmentId: '${esc(a.augmentId)}', augmentNameCn: '${esc(a.augmentNameCn)}', tierCn: '${esc(a.tierCn)}', displayOrder: ${a.displayOrder || 0}, sourceUrl: '${esc(a.sourceUrl || '')}', confidence: '${esc(a.confidence || 'medium')}', recommendationTypeCn: '${esc(recType)}', comboHeroTierCn: '${esc(recTier)}', reasonHeroCn: '${esc(recReason)}' }`;
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
console.log('2. heroDetails.ts: cross-referenced with reverse mapping');

// Summary
let totalAdded = 0;
for (const h of augJson.heroAugmentsAndSkills) {
  const merged = { prismatic: [...(h.recommendedAugmentsByTier?.prismatic || [])], gold: [...(h.recommendedAugmentsByTier?.gold || [])], silver: [...(h.recommendedAugmentsByTier?.silver || [])] };
  const existingIds = new Set();
  for (const tier of ['prismatic', 'gold', 'silver']) {
    for (const a of merged[tier]) existingIds.add(a.augmentId);
  }
  const reverseEntries = heroAugMap.get(h.heroId) || [];
  for (const re of reverseEntries) {
    if (!existingIds.has(re.augmentId)) totalAdded++;
  }
}
console.log('3. Total missing hero-augment links added:', totalAdded);
console.log('4. All migrations complete');
