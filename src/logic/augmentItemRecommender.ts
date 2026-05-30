import aMechanicTags from '@/data/augmentItemRecommender/augment_mechanic_tags.json';
import itemTags from '@/data/augmentItemRecommender/item_effect_tags.json';
import heroRoles from '@/data/augmentItemRecommender/hero_role_weights.json';
import synergyRules from '@/data/augmentItemRecommender/augment_item_synergy_rules.json';
import fallbackRules from '@/data/augmentItemRecommender/role_item_fallback_rules.json';

// ─── types ───

interface AugMechData { augmentId: string; nameCn: string; mechanicStrength: string; preferredItemTags: string[]; avoidItemTags: string[]; }
interface ItemTagData { itemId: string; nameCn: string; iconUrl: string; statTags: string[]; }
interface HeroRoleData { heroId: string; heroNameCn: string; titleCn: string; roles: string[]; roleWeights: { role: string; weight: number }[]; primaryRole: string; preferredItemTags: string[]; avoidItemTags: string[]; }
interface SynRule { ruleId: string; augmentId: string; augmentNameCn: string; ruleType: string; mechanicStrength: string; matchedItemTags: string[]; preferredItemIds: string[]; preferredItemNamesCn: string[]; avoidItemTags: string[]; avoidItemIds: string[]; scoreTier: string; scoreBonus: number; reasonCn: string; }
interface FallbackRule { role: string; preferredItemTags: { tag: string; weight: number; reasonCn: string }[]; avoidItemTags: { tag: string; reasonCn: string }[]; }

type AugMechMap = Record<string, AugMechData>;
type ItemTagMap = Record<string, ItemTagData>;
type HeroRoleMap = Record<string, HeroRoleData>;

const augData = aMechanicTags.data as AugMechData[];
const itemData = itemTags.data as ItemTagData[];
const heroData = heroRoles.data as HeroRoleData[];
const synData = synergyRules.data as SynRule[];
const fallbackData = fallbackRules.data as FallbackRule[];

const augMap: AugMechMap = Object.fromEntries(augData.map(a => [a.augmentId, a]));
const itemMap: ItemTagMap = Object.fromEntries(itemData.map(i => [i.itemId, i]));
const heroMap: HeroRoleMap = Object.fromEntries(heroData.map(h => [h.heroId, h]));

// ─── public types ───

export interface BuildInput { heroId: string; selectedAugmentIds: string[]; }
export interface RecommendedItem {
  itemId: string; nameCn: string; iconUrl: string;
  score: number; scoreTier: string;
  sourceType: string; sourceLabelCn: string;
  matchedTags: string[]; reasonsCn: string[];
}
export interface BuildResult {
  hero: { heroId: string; heroNameCn: string; titleCn: string; roles: string[]; };
  selectedAugments: { augmentId: string; nameCn: string; mechanicStrength: string; sourceType: string; }[];
  sourceSummary: { augmentSynergyCount: number; roleFallbackCount: number; dualMatchCount: number; antiSynergyCount: number; };
  groups: { core: RecommendedItem[]; optional: RecommendedItem[]; situational: RecommendedItem[]; avoid: RecommendedItem[]; };
}

// ─── core engine ───

// Map itemRoleTags → matching item statTags
const ROLE_TAG_TO_STAT: Record<string, string[]> = {
  'hp_item': ['hp'],
  'mana_item': ['mana'],
  'ap_item': ['ap'],
  'ad_item': ['ad'],
  'attack_speed_item': ['attack_speed'],
  'crit_item': ['crit'],
  'defensive_item': ['armor', 'magic_resist'],
  'sustain_item': ['lifesteal', 'hp'],
  'burst_item': ['ap', 'ad', 'lethality', 'armor_penetration', 'magic_penetration'],
  'poke_item': ['ap', 'mana', 'ability_haste'],
  'on_hit_item': ['attack_speed', 'ad'],
  'scaling_item': ['ap', 'ad', 'hp', 'mana'],
  'mage': ['ap', 'mana', 'ability_haste', 'magic_penetration'],
  'marksman': ['ad', 'attack_speed', 'crit'],
  'assassin': ['ad', 'lethality', 'armor_penetration'],
  'fighter': ['hp', 'ad', 'attack_speed'],
  'tank': ['hp', 'armor', 'magic_resist'],
  'ability_haste': ['ability_haste'],
  'utility_item': ['ability_haste', 'heal_shield_power', 'move_speed'],
};

function tagMatchesItem(roleTag: string, itemStatTags: string[]): boolean {
  const mapped = ROLE_TAG_TO_STAT[roleTag];
  if (mapped) return mapped.some(s => itemStatTags.includes(s));
  // If it's a raw stat tag, match directly
  return itemStatTags.includes(roleTag);
}

const SCORE_TABLE: Record<string, number> = { core: 40, good: 25, optional: 12, neutral: 0, avoid: -25 };

export function recommendItems(input: BuildInput): BuildResult {
  const { heroId, selectedAugmentIds } = input;
  const hero = heroMap[heroId];
  const augs = selectedAugmentIds.map(id => augMap[id]).filter(Boolean);

  // ── 1. Hero data ──
  const heroRolesList = hero?.roles || [];
  const heroPreferredTags = hero?.preferredItemTags || [];
  const heroAvoidTags = new Set(hero?.avoidItemTags || []);
  const primaryRole = hero?.primaryRole || heroRolesList[0] || '';
  const fallback = fallbackData.find(f => f.role === primaryRole);

  // ── 2. Augment data ──
  const augPreferredTags = new Set<string>();
  const augAvoidTags = new Set<string>();
  const augMechanicStrengths: string[] = [];
  for (const a of augs) {
    for (const t of a.preferredItemTags) augPreferredTags.add(t);
    for (const t of a.avoidItemTags) augAvoidTags.add(t);
    augMechanicStrengths.push(a.mechanicStrength || 'weak');
  }

  // ── 3. Synergy rules ──
  const activeRules: SynRule[] = [];
  const synergyItemIds = new Set<string>();
  const synergyItemTags = new Set<string>();
  const antiItemIds = new Set<string>();
  const antiReasons: Record<string, string[]> = {};

  for (const augId of selectedAugmentIds) {
    const rules = synData.filter(r => r.augmentId === augId);
    for (const r of rules) {
      activeRules.push(r);
      for (const id of r.preferredItemIds) synergyItemIds.add(id);
      for (const t of r.matchedItemTags) synergyItemTags.add(t);
      for (const id of r.avoidItemIds) {
        antiItemIds.add(id);
        if (!antiReasons[id]) antiReasons[id] = [];
        antiReasons[id].push(r.reasonCn);
      }
    }
  }

  // ── 4. Score every item ──
  const scored: Map<string, { score: number; reasons: string[]; matchedTags: string[]; sourceTypes: Set<string> }> = new Map();
  for (const item of itemData) {
    const reasons: string[] = [];
    const matchedTags: string[] = [];
    const sourceTypes = new Set<string>();
    let score = 0;

    // Anti-synergy
    if (antiItemIds.has(item.itemId)) {
      score -= 25;
      reasons.push(...(antiReasons[item.itemId] || []));
      sourceTypes.add('anti_synergy');
      scored.set(item.itemId, { score, reasons, matchedTags, sourceTypes });
      continue;
    }

    // Synergy: preferred item IDs
    if (synergyItemIds.has(item.itemId)) {
      for (const r of activeRules) {
        if (r.preferredItemIds.includes(item.itemId) || r.preferredItemNamesCn.includes(item.nameCn)) {
          score += SCORE_TABLE[r.scoreTier] || 0;
          reasons.push(r.reasonCn);
          matchedTags.push(...r.matchedItemTags);
          sourceTypes.add('augment_synergy');
        }
      }
    }

    // Synergy: matched tags
    if (!sourceTypes.has('augment_synergy')) {
      let tagScore = 0;
      for (const t of synergyItemTags) {
        if (tagMatchesItem(t, item.statTags)) {
          matchedTags.push(t);
          tagScore += 12;
        }
      }
      if (tagScore > 0) {
        score += tagScore;
        // Find reason from matched rules
        for (const r of activeRules) {
          if (r.matchedItemTags.some(t => tagMatchesItem(t, item.statTags))) {
            reasons.push(r.reasonCn);
            break;
          }
        }
        if (reasons.length === 0) {
          reasons.push('该装备命中当前强化的关键标签，在当前配置下优先级提高。');
        }
        sourceTypes.add('augment_synergy');
      }
    }

    // Hero role fallback
    if (fallback && heroPreferredTags.length > 0) {
      let fbScore = 0;
      const fbReasons: string[] = [];
      for (const fbTag of fallback.preferredItemTags) {
        if (tagMatchesItem(fbTag.tag, item.statTags)) {
          fbScore += fbTag.weight;
          matchedTags.push(fbTag.tag);
          fbReasons.push(fbTag.reasonCn);
        }
      }
      if (fbScore > 0) {
        const normalizedFb = Math.min(fbScore / 40, 1) * 25;
        score += normalizedFb;
        reasons.push(...fbReasons.slice(0, 2));
        sourceTypes.add('hero_role_fallback');
      }
    }

    // Avoid tags from hero or augment
    for (const t of heroAvoidTags) { if (tagMatchesItem(t, item.statTags)) score -= 10; }
    for (const t of augAvoidTags) { if (tagMatchesItem(t, item.statTags)) score -= 10; }

    // Dual match bonus
    if (sourceTypes.has('augment_synergy') && sourceTypes.has('hero_role_fallback')) {
      score += 8;
      sourceTypes.clear();
      sourceTypes.add('dual_match');
    }

    // Deduplicate reasons
    const uniqueReasons = [...new Set(reasons)].filter(r => r.length > 0);
    const uniqueTags = [...new Set(matchedTags)];

    if (scored.has(item.itemId)) {
      const existing = scored.get(item.itemId)!;
      existing.score += score;
      existing.reasons = [...new Set([...existing.reasons, ...uniqueReasons])];
      existing.matchedTags = [...new Set([...existing.matchedTags, ...uniqueTags])];
      if (sourceTypes.has('dual_match')) { existing.sourceTypes.clear(); existing.sourceTypes.add('dual_match'); }
      else for (const s of sourceTypes) existing.sourceTypes.add(s);
    } else {
      scored.set(item.itemId, { score, reasons: uniqueReasons, matchedTags: uniqueTags, sourceTypes });
    }
  }

  // ── 5. Dynamic weights ──
  const hasStrong = augMechanicStrengths.includes('strong');
  const hasMedium = augMechanicStrengths.includes('medium');
  let augWeight = 0.25, heroWeight = 0.60;
  if (hasStrong) { augWeight = 0.70; heroWeight = 0.20; }
  else if (hasMedium) { augWeight = 0.55; heroWeight = 0.35; }

  // ── 6. Build result ──
  const results: RecommendedItem[] = [];
  for (const [itemId, s] of scored) {
    const item = itemMap[itemId];
    if (!item) continue;
    let sourceType = s.sourceTypes.size === 0 ? 'situational' : [...s.sourceTypes][0];
    if (s.sourceTypes.has('anti_synergy')) sourceType = 'anti_synergy';

    // Apply weights for final scoring
    let finalScore = s.score;
    if (sourceType === 'augment_synergy') finalScore = finalScore * augWeight * 3;
    else if (sourceType === 'hero_role_fallback') finalScore = finalScore * heroWeight * 3;
    else if (sourceType === 'dual_match') finalScore = (finalScore * augWeight + finalScore * heroWeight) * 1.5;
    else if (sourceType === 'anti_synergy') finalScore = finalScore;

    let scoreTier = 'neutral';
    if (finalScore >= 45) scoreTier = 'core';
    else if (finalScore >= 25) scoreTier = 'good';
    else if (finalScore >= 10) scoreTier = 'optional';
    else if (sourceType === 'anti_synergy') scoreTier = 'avoid';
    else scoreTier = 'situational';

    const sourceLabelMap: Record<string, string> = {
      'augment_synergy': '强化联动', 'hero_role_fallback': '英雄定位',
      'dual_match': '双重命中', 'situational': '情况补充', 'anti_synergy': '反协同' };

    if (s.reasons.length === 0) {
      s.reasons.push('该装备命中了当前强化或英雄定位的关键标签，因此在当前配置下优先级提高。');
    }

    results.push({
      itemId, nameCn: item.nameCn, iconUrl: item.iconUrl,
      score: Math.round(finalScore * 10) / 10,
      scoreTier,
      sourceType,
      sourceLabelCn: sourceLabelMap[sourceType] || '情况补充',
      matchedTags: [...new Set(s.matchedTags)].slice(0, 5),
      reasonsCn: [...new Set(s.reasons)].slice(0, 3),
    });
  }

  // Sort
  results.sort((a, b) => b.score - a.score);

  // Group
  const core = results.filter(r => r.score >= 45 && r.sourceType !== 'anti_synergy').slice(0, 8);
  const optional = results.filter(r => r.score >= 25 && r.score < 45 && !core.includes(r) && r.sourceType !== 'anti_synergy').slice(0, 8);
  const situational = results.filter(r => r.score >= 10 && r.score < 25 && !core.includes(r) && !optional.includes(r) && r.sourceType !== 'anti_synergy').slice(0, 8);
  const avoid = results.filter(r => r.sourceType === 'anti_synergy' || r.score < 0).slice(0, 8);

  // Source summary
  const allItems = [...core, ...optional, ...situational, ...avoid];
  const augmentSynergyCount = allItems.filter(r => r.sourceType === 'augment_synergy').length;
  const roleFallbackCount = allItems.filter(r => r.sourceType === 'hero_role_fallback').length;
  const dualMatchCount = allItems.filter(r => r.sourceType === 'dual_match').length;
  const antiSynergyCount = avoid.length;

  return {
    hero: hero ? { heroId: hero.heroId, heroNameCn: hero.heroNameCn, titleCn: hero.titleCn, roles: hero.roles } : { heroId, heroNameCn: heroId, titleCn: '', roles: [] },
    selectedAugments: augs.map(a => ({ augmentId: a.augmentId, nameCn: a.nameCn, mechanicStrength: a.mechanicStrength, sourceType: 'augment_synergy' })),
    sourceSummary: { augmentSynergyCount, roleFallbackCount, dualMatchCount, antiSynergyCount },
    groups: { core, optional, situational, avoid },
  };
}
