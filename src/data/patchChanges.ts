import type { PatchChange } from '@/types';

export const patchChanges: PatchChange[] = [
  // ─── Heroes (8 heroes, 13 changes) ───
  {
    patchId: 'p528_hero_smolder_q', patchVersion: '5.28', date: '2026-05-28', category: 'hero',
    target: '斯莫德（炽炎雏龙）', changeSummary: 'Q技能【超级灼热龙息】伤害下调：60-120 → 60-100（+130%额外攻击力不变）',
    impactOnRecommendations: 'Q后期伤害上限降低，斯莫德后期carry能力小幅削弱', sourceUrl: '', confidence: 'high',
  },
  {
    patchId: 'p528_hero_smolder_base', patchVersion: '5.28', date: '2026-05-28', category: 'hero',
    target: '斯莫德（炽炎雏龙）', changeSummary: '基础攻击力调整、承受伤害调整（102%→未知）',
    impactOnRecommendations: '斯莫德前期对线和坦度微调', sourceUrl: '', confidence: 'low',
  },
  {
    patchId: 'p528_hero_fizz', patchVersion: '5.28', date: '2026-05-28', category: 'hero',
    target: '菲兹（潮汐海灵）', changeSummary: '造成伤害调整 + 韧性效果移除',
    impactOnRecommendations: '菲兹生存能力降低，AP刺客出装方向不变，需注意被控风险', sourceUrl: '', confidence: 'medium',
  },
  {
    patchId: 'p528_hero_fiddlesticks', patchVersion: '5.28', date: '2026-05-28', category: 'hero',
    target: '费德提克（远古恐惧）', changeSummary: '造成伤害与承受伤害调整',
    impactOnRecommendations: '末日输出和坦度微调，AP出装方向不变', sourceUrl: '', confidence: 'medium',
  },
  {
    patchId: 'p528_hero_varus', patchVersion: '5.28', date: '2026-05-28', category: 'hero',
    target: '韦鲁斯（惩戒之箭）', changeSummary: '承受伤害调整',
    impactOnRecommendations: '韦鲁斯坦度微调，出装方向不变', sourceUrl: '', confidence: 'medium',
  },
  {
    patchId: 'p528_hero_kassadin', patchVersion: '5.28', date: '2026-05-28', category: 'hero',
    target: '卡萨丁（虚空行者）', changeSummary: 'R技能冷却时间缩短（加强）',
    impactOnRecommendations: '卡萨丁后期机动性和输出频率提升，AP出装优先级不变', sourceUrl: '', confidence: 'medium',
  },
  {
    patchId: 'p528_hero_tristana', patchVersion: '5.28', date: '2026-05-28', category: 'hero',
    target: '崔丝塔娜（麦林炮手）', changeSummary: '造成伤害调整',
    impactOnRecommendations: '小炮输出能力微调，AD出装方向不变', sourceUrl: '', confidence: 'medium',
  },
  {
    patchId: 'p528_hero_teemo', patchVersion: '5.28', date: '2026-05-28', category: 'hero',
    target: '提莫（迅捷斥候）', changeSummary: 'E技能【毒性射击】调整',
    impactOnRecommendations: '提莫持续伤害能力调整，AP出装方向不变', sourceUrl: '', confidence: 'medium',
  },
  {
    patchId: 'p528_hero_heimerdinger', patchVersion: '5.28', date: '2026-05-28', category: 'hero',
    target: '黑默丁格（大发明家）', changeSummary: 'Q炮台新增距离机制 + 攻击距离调整',
    impactOnRecommendations: '大头炮台放置更灵活，阵地战能力增强', sourceUrl: '', confidence: 'medium',
  },

  // ─── Augments (1 augment, 1 change) ───
  {
    patchId: 'p528_aug_devil_dance', patchVersion: '5.28', date: '2026-05-28', category: 'augment',
    target: '魔鬼之舞（金色）', changeSummary: '机制重做：不再根据属性锻造器生效，改为独立判定机制',
    impactOnRecommendations: '魔鬼之舞触发机制变更，依赖属性锻造器的英雄选择优先级降低', sourceUrl: '', confidence: 'low',
  },

  // ─── Items (5 items, 8 changes) ───
  {
    patchId: 'p528_item_statikk', patchVersion: '5.28', date: '2026-05-28', category: 'item',
    target: '斯塔缇克电刃（全模式）', changeSummary: '攻击力提升：40 → 45',
    impactOnRecommendations: '电刀攻击力小幅提升，AD射手出装收益增加', sourceUrl: '', confidence: 'high',
  },
  {
    patchId: 'p528_item_hexplate', patchVersion: '5.28', date: '2026-05-28', category: 'item',
    target: '海克斯注力刚壁（全模式）', changeSummary: '过载持续时长统一为8秒（远程英雄受益，近战不变）',
    impactOnRecommendations: '远程英雄出此装备的收益提升', sourceUrl: '', confidence: 'medium',
  },
  {
    patchId: 'p528_item_imperial_recipe', patchVersion: '5.28', date: '2026-05-28', category: 'item',
    target: '帝国指令（ARAM）', changeSummary: '合成配方变更：爆裂魔杖(850)+班德尔玻璃镜(900)+700=2400金币',
    impactOnRecommendations: '合成路线更平滑，辅助AP出装更灵活', sourceUrl: '', confidence: 'high',
  },
  {
    patchId: 'p528_item_imperial_passive', patchVersion: '5.28', date: '2026-05-28', category: 'item',
    target: '帝国指令（ARAM）', changeSummary: '移除一个唯一被动，新增一个唯一被动；协同开火调整为持续4秒施加易损、敌人受百分比额外伤害',
    impactOnRecommendations: '被动效果重组，协同开火团队增伤效果更明确', sourceUrl: '', confidence: 'medium',
  },
  {
    patchId: 'p528_item_infinity_edge', patchVersion: '5.28', date: '2026-05-28', category: 'item',
    target: '无尽之刃（ARAM）', changeSummary: '存在改动（OCR证据不完整，具体数值待确认）',
    impactOnRecommendations: '待人工确认后更新推荐', sourceUrl: '', confidence: 'low',
  },
  {
    patchId: 'p528_item_thornmail', patchVersion: '5.28', date: '2026-05-28', category: 'item',
    target: '荆棘之甲（ARAM）', changeSummary: '存在改动（OCR证据不完整，具体数值待确认）',
    impactOnRecommendations: '待人工确认后更新推荐', sourceUrl: '', confidence: 'low',
  },
];

export const currentVersion = '5.28';
