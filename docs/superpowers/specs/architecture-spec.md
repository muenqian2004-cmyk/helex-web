# 海克斯大乱斗工具网站 — 架构规格

## 产品定位

第一版不追求"全英雄胜率榜"或"绝对最优解推荐器"，而是做一个可信、清晰、可扩展的海克斯大乱斗决策工具。

核心关键词：官方机制清晰、强化信息可查、推荐依据透明、社区内容隔离、后续数据可扩展。

## 技术栈

- **框架**: React 18 + TypeScript
- **构建**: Vite 5
- **样式**: Tailwind CSS 3 + shadcn/ui
- **路由**: react-router-dom v6
- **数据**: 静态 TypeScript 文件（编译时打包）

## 路由结构

| 路径 | 页面 | 优先级 |
|------|------|--------|
| `/` | HomePage — 6 个工具入口卡片 | P0 |
| `/augments` | AugmentEncyclopedia — 强化百科 | P0 |
| `/triple-choice` | TripleChoiceHelper — 三选一强化助手 | P0 |
| `/heroes` | HeroCards — 英雄速查卡 | P1 |
| `/builds` | BuildRecommendations — 强化驱动出装 | P1 |
| `/comp-synergy` | CompSynergyPanel — 阵容协同面板 | P1 |
| `/versions` | VersionTracker — 版本追踪 | P0 |
| `/fun-builds` | FunBuildsWorkshop — 娱乐套路工坊 | P1 |

## 目录结构

```
src/
├── components/          # 共享 UI 组件
│   ├── ui/              # shadcn/ui 基础组件
│   ├── ConfidenceBadge.tsx
│   ├── SourceTag.tsx
│   ├── AugmentCard.tsx
│   ├── HeroCard.tsx
│   ├── SearchInput.tsx
│   ├── TierBadge.tsx
│   └── EmptyState.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── AugmentEncyclopedia.tsx
│   ├── TripleChoiceHelper.tsx
│   ├── HeroCards.tsx
│   ├── BuildRecommendations.tsx
│   ├── CompSynergyPanel.tsx
│   ├── VersionTracker.tsx
│   └── FunBuildsWorkshop.tsx
├── data/
│   ├── heroes.ts
│   ├── augments.ts
│   ├── heroAugmentRules.ts
│   ├── augmentItemSynergies.ts
│   ├── patchChanges.ts
│   ├── communityBuilds.ts
│   └── compRules.ts
├── types/
│   └── index.ts
├── lib/
│   ├── decision-engine.ts
│   └── search.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 数据模型

见 types/index.ts，包含 7 张核心表：
- heroes, augments, hero_augment_rules, augment_item_synergies, patch_changes, community_builds, comp_rules

所有数据标记 confidence（high/medium/low/unverified）和 sourceType（official/community/inferred）。

## 核心组件

- **ConfidenceBadge**: 可信度徽章（4 级，不同颜色）
- **SourceTag**: 来源标签（3 类）
- **AugmentCard**: 强化信息卡片（百科、三选一复用）
- **TierBadge**: 品质标签（Silver/Gold/Prismatic）

## 三选一强化助手

决策引擎位于 lib/decision-engine.ts，纯函数输入英雄+已有强化+3 候选+阵容缺口，输出优先级排序和推荐理由。

决策优先级：英雄角色匹配 > 已有强化协同 > 阵容缺口填补 > 显式冲突检测。

## 边缘情况

- 搜索无结果 → EmptyState
- 数据不足 → confidence: unverified 标记
- 强化冲突 → 黄牌警告
- 图片加载失败 → 占位图 fallback
- 未录入英雄 → 搜索不可选
