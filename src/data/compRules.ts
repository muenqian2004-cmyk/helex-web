import type { CompRule } from '@/types';

export const compRules: CompRule[] = [
  {
    ruleId: 'c1',
    metricName: 'all_ad',
    condition: '阵容中5个英雄均为AD伤害类型',
    warningTemplate: '⚠ 阵容全AD伤害，敌方堆护甲将极大削弱团队输出',
    recommendationTemplate: '建议至少1人转型AP出装或选择法术向强化',
    confidence: 'high',
  },
  {
    ruleId: 'c2',
    metricName: 'all_ap',
    condition: '阵容中5个英雄均为AP伤害类型',
    warningTemplate: '⚠ 阵容全AP伤害，敌方堆魔抗将极大削弱团队输出',
    recommendationTemplate: '建议至少1人转型AD出装或选择物理向强化',
    confidence: 'high',
  },
  {
    ruleId: 'c3',
    metricName: 'no_tank',
    condition: '阵容中无前排坦克型英雄',
    warningTemplate: '⚠ 阵容缺少前排，团战容易被冲散',
    recommendationTemplate: '建议至少1人选择防御/坦克向强化和出装',
    confidence: 'high',
  },
  {
    ruleId: 'c4',
    metricName: 'no_cc',
    condition: '阵容中无稳定控制英雄',
    warningTemplate: '⚠ 阵容缺少控制，难以限制敌方关键英雄',
    recommendationTemplate: '建议有控制技能的选择控制向强化',
    confidence: 'medium',
  },
  {
    ruleId: 'c5',
    metricName: 'no_waveclear',
    condition: '阵容清线能力弱',
    warningTemplate: '⚠ 阵容清线慢，容易被推线压制',
    recommendationTemplate: '建议至少1人选择AOE/清线向出装或强化',
    confidence: 'medium',
  },
  {
    ruleId: 'c6',
    metricName: 'no_protection',
    condition: '阵容无保护/治疗型英雄',
    warningTemplate: '⚠ 阵容缺乏保护和续航',
    recommendationTemplate: '建议有辅助能力的英雄选择治疗/保护向强化',
    confidence: 'medium',
  },
];
