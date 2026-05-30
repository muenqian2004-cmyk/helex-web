import type { HeroAugmentRule } from '@/types';

export const heroAugmentRules: HeroAugmentRule[] = [
  // 射手
  { ruleId: 'r1', heroId: '', heroRole: '射手', augmentTag: 'AD', priority: 'recommended', reason: '射手依赖物理输出，AD向强化直接提升伤害', confidence: 'high' },
  { ruleId: 'r2', heroId: '', heroRole: '射手', augmentTag: '物理', priority: 'recommended', reason: '物理向强化提升射手持续输出能力', confidence: 'high' },
  { ruleId: 'r3', heroId: '', heroRole: '射手', augmentTag: '攻速', priority: 'recommended', reason: '攻速提升射手伤害上限', confidence: 'high' },
  { ruleId: 'r4', heroId: '', heroRole: '射手', augmentTag: 'AP', priority: 'not-recommended', reason: '射手通常不依赖法术强度', confidence: 'high' },
  { ruleId: 'r5', heroId: '', heroRole: '射手', augmentTag: '坦克', priority: 'not-recommended', reason: '射手不需要前排向强化', confidence: 'high' },
  // 法师
  { ruleId: 'r6', heroId: '', heroRole: '法师', augmentTag: 'AP', priority: 'recommended', reason: '法师依赖法术强度提升技能伤害', confidence: 'high' },
  { ruleId: 'r7', heroId: '', heroRole: '法师', augmentTag: '法术', priority: 'recommended', reason: '法术向强化直接提升技能伤害', confidence: 'high' },
  { ruleId: 'r8', heroId: '', heroRole: '法师', augmentTag: '技能', priority: 'recommended', reason: '技能强化提升法师连招伤害', confidence: 'medium' },
  { ruleId: 'r9', heroId: '', heroRole: '法师', augmentTag: 'AD', priority: 'not-recommended', reason: '法师不依赖物理攻击', confidence: 'high' },
  { ruleId: 'r10', heroId: '', heroRole: '法师', augmentTag: '坦克', priority: 'not-recommended', reason: '法师选坦克强化会浪费伤害潜力', confidence: 'high' },
  // 坦克
  { ruleId: 'r14', heroId: '', heroRole: '坦克', augmentTag: '坦克', priority: 'recommended', reason: '坦克首选防御向强化', confidence: 'high' },
  { ruleId: 'r15', heroId: '', heroRole: '坦克', augmentTag: '防御', priority: 'recommended', reason: '防御强化直接提升坦度', confidence: 'high' },
  { ruleId: 'r16', heroId: '', heroRole: '坦克', augmentTag: '生命值', priority: 'recommended', reason: '生命值强化提升生存能力', confidence: 'high' },
  { ruleId: 'r17', heroId: '', heroRole: '坦克', augmentTag: 'AP', priority: 'not-recommended', reason: '坦克不需要法术强度', confidence: 'high' },
  { ruleId: 'r18', heroId: '', heroRole: '坦克', augmentTag: '暴击', priority: 'not-recommended', reason: '坦克不需要暴击强化', confidence: 'high' },
  { ruleId: 'r27', heroId: '', heroRole: '坦克', augmentTag: '机动', priority: 'optional', reason: '机动性帮助坦克开团进场', confidence: 'medium' },
  { ruleId: 'r29', heroId: '', heroRole: '坦克', augmentTag: '控制', priority: 'recommended', reason: '控制强化提升坦克开团能力', confidence: 'medium' },
  // 辅助
  { ruleId: 'r19', heroId: '', heroRole: '辅助', augmentTag: '治疗', priority: 'recommended', reason: '治疗增强直接提升保护能力', confidence: 'high' },
  { ruleId: 'r20', heroId: '', heroRole: '辅助', augmentTag: '辅助', priority: 'recommended', reason: '辅助向强化提升团队贡献', confidence: 'high' },
  { ruleId: 'r21', heroId: '', heroRole: '辅助', augmentTag: '生存', priority: 'recommended', reason: '辅助活得越久团队收益越大', confidence: 'high' },
  { ruleId: 'r22', heroId: '', heroRole: '辅助', augmentTag: 'AD', priority: 'not-recommended', reason: '辅助选输出强化浪费定位', confidence: 'high' },
  // 刺客
  { ruleId: 'r23', heroId: '', heroRole: '刺客', augmentTag: 'AD', priority: 'recommended', reason: '物理伤害提升刺客爆发', confidence: 'high' },
  { ruleId: 'r24', heroId: '', heroRole: '刺客', augmentTag: '击杀', priority: 'recommended', reason: '击杀相关强化与刺客高度契合', confidence: 'high' },
  { ruleId: 'r25', heroId: '', heroRole: '刺客', augmentTag: '机动', priority: 'recommended', reason: '机动性帮助刺客进场退场', confidence: 'high' },
  { ruleId: 'r26', heroId: '', heroRole: '刺客', augmentTag: '坦克', priority: 'not-recommended', reason: '刺客不需要防御向强化', confidence: 'high' },
  // 战士
  { ruleId: 'r28', heroId: '', heroRole: '战士', augmentTag: '机动', priority: 'recommended', reason: '机动性帮助战士追击和拉扯', confidence: 'high' },
  { ruleId: 'r30', heroId: '', heroRole: '战士', augmentTag: 'AD', priority: 'recommended', reason: '物理伤害提升战士持续输出', confidence: 'high' },
  { ruleId: 'r31', heroId: '', heroRole: '战士', augmentTag: '攻击', priority: 'recommended', reason: '攻击向强化提升战士伤害', confidence: 'high' },
  { ruleId: 'r32', heroId: '', heroRole: '战士', augmentTag: '生存', priority: 'optional', reason: '生存强化让战士站得更久', confidence: 'medium' },
  { ruleId: 'r33', heroId: '', heroRole: '战士', augmentTag: 'AP', priority: 'not-recommended', reason: '战士通常不需要法术强度', confidence: 'medium' },
  // 通用-economic
  { ruleId: 'r37', heroId: '', heroRole: '法师', augmentTag: '经济', priority: 'optional', reason: '经济强化加速成装进度', confidence: 'medium' },
  { ruleId: 'r38', heroId: '', heroRole: '射手', augmentTag: '经济', priority: 'optional', reason: '经济强化加速成装进度', confidence: 'medium' },
  { ruleId: 'r39', heroId: '', heroRole: '战士', augmentTag: '经济', priority: 'optional', reason: '经济强化加速成装进度', confidence: 'medium' },
  // 通用-高上限
  { ruleId: 'r40', heroId: '', heroRole: '刺客', augmentTag: '高上限', priority: 'optional', reason: '高上限娱乐型强化有奇效', confidence: 'low' },
  { ruleId: 'r42', heroId: '', heroRole: '辅助', augmentTag: '高上限', priority: 'not-recommended', reason: '辅助不应冒险选高上限娱乐强化', confidence: 'medium' },
];
