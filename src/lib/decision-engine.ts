import type { TripleChoiceInput, TripleChoiceResult, Priority, Confidence, SynergyCombo } from '@/types';
import { augmentsById } from '@/data/augments';
import { heroAugmentRules } from '@/data/heroAugmentRules';
import { synergyCombos } from '@/data/synergyCombos';
import { heroes } from '@/data/heroes';

function resolveConfidence(levels: Confidence[]): Confidence {
  if (levels.includes('unverified')) return 'unverified';
  if (levels.includes('low')) return 'low';
  if (levels.includes('medium')) return 'medium';
  return 'high';
}

function sourceBasisFromConfidence(confidence: Confidence): '官方机制' | '社区经验' | '机制推断' {
  if (confidence === 'high') return '官方机制';
  if (confidence === 'medium') return '社区经验';
  return '机制推断';
}

function extractKeywords(text: string): string[] {
  const kw: string[] = [];
  if (/攻击|AD|物理|暴击|攻速/.test(text)) kw.push('AD', '物理', '攻速');
  if (/法术|AP|技能伤害|巫术/.test(text)) kw.push('AP', '法术', '技能');
  if (/治疗|护盾|生命值|回复|治愈/.test(text)) kw.push('治疗', '生存');
  if (/坦克|防御|护甲|魔抗|生命值|双抗/.test(text)) kw.push('坦克', '防御', '生命值');
  if (/移动|移速|位移|突进|机动/.test(text)) kw.push('机动');
  if (/控制|减速|击飞|眩晕|变形|禁锢/.test(text)) kw.push('控制');
  if (/灼烧|燃烧|持续伤害|引燃/.test(text)) kw.push('灼烧');
  if (/击杀|重置|刷新|终结/.test(text)) kw.push('击杀');
  if (/冷却|急速|技能急速/.test(text)) kw.push('冷却');
  if (/金币|经济|发育|工资/.test(text)) kw.push('经济');
  if (/暴击/.test(text)) kw.push('暴击');
  if (/攻击力|额外AD|额外攻击力/.test(text)) kw.push('AD', '攻击');
  return [...new Set(kw)];
}

function comboMatchesHero(combo: SynergyCombo, heroId: string, heroRoles: string[]): boolean {
  if (combo.scopeType === 'hero') return combo.heroIds.includes(heroId);
  if (combo.scopeType === 'hero_type') {
    if (combo.heroIds.length > 0 && combo.heroIds.includes(heroId)) return true;
    return combo.heroTypeTags.some((tag) => heroRoles.includes(tag));
  }
  return false;
}

function findSynergyCombo(candidateId: string, existingIds: string[], heroId: string, heroRoles: string[]): SynergyCombo | null {
  for (const combo of synergyCombos) {
    if (!comboMatchesHero(combo, heroId, heroRoles)) continue;

    const reqIds = combo.requiredAugments.map(a => a.augmentId);
    const optIds = combo.optionalAugments.map(a => a.augmentId);
    const allComboIds = [...reqIds, ...optIds];

    // Candidate must be part of this combo
    if (!allComboIds.includes(candidateId)) continue;

    // Count how many required augments the user already has (excluding candidate)
    const ownedReq = existingIds.filter(id => reqIds.includes(id) && id !== candidateId);
    // Count how many optional augments the user already has
    const ownedOpt = existingIds.filter(id => optIds.includes(id));

    // Scenario 1: Candidate is a required augment, user has ≥1 other required → strong combo forming
    if (reqIds.includes(candidateId) && ownedReq.length >= 1) return combo;

    // Scenario 2: Candidate is an optional augment, user has ALL required → complete combo
    if (optIds.includes(candidateId) && ownedReq.length === reqIds.length) return combo;

    // Scenario 3: Candidate is required augment #2 or #3, user has optional ones → partial synergy
    if (reqIds.includes(candidateId) && ownedOpt.length >= 1) return combo;
  }
  return null;
}

export function evaluateTripleChoice(input: TripleChoiceInput): TripleChoiceResult[] {
  const hero = heroes.find((h) => h.heroId === input.heroId);
  if (!hero) {
    return input.candidateAugmentIds.map((id) => ({
      augmentId: id,
      priority: 'optional' as Priority,
      reason: '未找到该英雄数据',
      impactOnPlaystyle: '无法评估',
      recommendedItemDirection: '无法推荐',
      sourceBasis: '机制推断' as const,
      confidence: 'unverified' as Confidence,
    }));
  }

  const heroRoles = hero.roles;
  const results: TripleChoiceResult[] = [];

  for (const candidateId of input.candidateAugmentIds) {
    const augment = augmentsById[candidateId];
    if (!augment) {
      results.push({
        augmentId: candidateId,
        priority: 'optional',
        reason: '未找到该强化数据',
        impactOnPlaystyle: '无法评估',
        recommendedItemDirection: '无法推荐',
        sourceBasis: '机制推断',
        confidence: 'unverified',
      });
      continue;
    }

    const effectKeywords = extractKeywords(augment.effect);
    const confidences: Confidence[] = [augment.confidence];

    let matchScore = 0;
    const matchReasons: string[] = [];

    // Find matching rules for this hero's roles
    for (const role of heroRoles) {
      for (const rule of heroAugmentRules) {
        if (rule.heroRole !== role) continue;
        if (!effectKeywords.some((kw) => kw === rule.augmentTag)) continue;

        if (rule.priority === 'recommended') {
          matchScore += 2;
          matchReasons.push(rule.reason);
          confidences.push(rule.confidence);
        } else if (rule.priority === 'not-recommended') {
          matchScore -= 3;
          matchReasons.push(rule.reason);
          confidences.push(rule.confidence);
        } else {
          matchScore += 1;
          confidences.push(rule.confidence);
        }
      }
    }

    // Comp gap relevance
    let compGapScore = 0;
    const hasCompMatch = input.compGaps.some((gap) => {
      if (gap === '缺前排' && effectKeywords.some((t) => ['坦克', '防御'].includes(t))) return true;
      if (gap === '缺控制' && effectKeywords.some((t) => ['控制'].includes(t))) return true;
      if (gap === '缺保护' && effectKeywords.some((t) => ['治疗', '生存'].includes(t))) return true;
      if (gap === '缺清线' && effectKeywords.some((t) => ['AP', '法术', '灼烧'].includes(t))) return true;
      if (gap === '全AD' && effectKeywords.some((t) => ['AP', '法术'].includes(t))) return true;
      if (gap === '全AP' && effectKeywords.some((t) => ['AD', '物理'].includes(t))) return true;
      return false;
    });

    if (hasCompMatch) {
      compGapScore = 2;
      matchReasons.push('填补阵容缺口');
    }

    // Synergy combo detection
    let synergyCombo: SynergyCombo | null = null;
    let synergyScore = 0;
    if (input.existingAugmentIds.length > 0) {
      synergyCombo = findSynergyCombo(candidateId, input.existingAugmentIds, hero.heroId, heroRoles);
      if (synergyCombo) {
        synergyScore = 5; // Massive boost for confirmed combo
        matchReasons.push(`连招协同：${synergyCombo.comboNameCn}`);
      }
    }

    // Tier bonus + win rate
    const tierScore = augment.tier === 'Prismatic' ? 2 : augment.tier === 'Gold' ? 1 : 0;
    const winRateBonus = augment.winRate > 52 ? 1 : augment.winRate < 48 ? -1 : 0;
    if (augment.winRate > 52) matchReasons.push(`胜率较高 (${augment.winRate.toFixed(1)}%)`);

    const finalScore = matchScore + compGapScore + synergyScore + tierScore + winRateBonus;

    let priority: Priority;
    if (matchScore < -2) {
      priority = 'not-recommended';
    } else if (finalScore >= 3) {
      priority = 'recommended';
    } else {
      priority = 'optional';
    }

    const reason = matchReasons.length > 0
      ? matchReasons.slice(0, 3).join('；')
      : '缺少足够数据，建议参考社区经验';

    const playstyle = synergyCombo ? synergyCombo.playstyleCn : (augment.tier === 'Prismatic' ? '棱彩级强化，影响力大' : '常规强化');
    const itemDir = synergyCombo && synergyCombo.recommendedItemsCn.length > 0
      ? `推荐装备：${synergyCombo.recommendedItemsCn.join('、')}`
      : '根据强化方向选择匹配装备';

    results.push({
      augmentId: candidateId,
      priority,
      reason,
      impactOnPlaystyle: playstyle,
      recommendedItemDirection: itemDir,
      sourceBasis: sourceBasisFromConfidence(resolveConfidence(confidences)),
      confidence: resolveConfidence(confidences),
      synergyCombo: synergyCombo || undefined,
    });
  }

  // Sort by win rate within priority groups
  results.sort((a, b) => {
    const augA = augmentsById[a.augmentId];
    const augB = augmentsById[b.augmentId];
    const prioOrder = { 'recommended': 0, 'optional': 1, 'fun': 2, 'not-recommended': 3 };
    const prioDiff = prioOrder[a.priority] - prioOrder[b.priority];
    if (prioDiff !== 0) return prioDiff;
    return (augB?.winRate || 0) - (augA?.winRate || 0);
  });

  return results;
}
