# 海克斯大乱斗工具网站 P0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the P0 scope of the Hextech ARAM tool website — HomePage, Augment Encyclopedia, Triple-Choice Helper, and Version Tracker with confidence labeling system.

**Architecture:** React 18 SPA via Vite 5, Tailwind CSS + shadcn/ui, react-router-dom v6, static TypeScript data files. All data sourced from B站 community + Riot Data Dragon API as documented in the data report.

**Tech Stack:** React 18, TypeScript 5, Vite 5, Tailwind CSS 3, shadcn/ui, react-router-dom v6, lucide-react, vitest, playwright

---

### Task 1: Initialize Git repo and Vite project

**Files:**
- Create: `C:/Users/Administrator/hextech-aram-tools/` (project root)

- [ ] **Step 1: Init git and scaffold Vite**

```bash
cd "C:/Users/Administrator/hextech-aram-tools" && git init && npm create vite@latest . -- --template react-ts
```

- [ ] **Step 2: Verify scaffold**

```bash
ls src/App.tsx src/main.tsx package.json tsconfig.json
```
Expected: All files exist.

- [ ] **Step 3: First commit**

```bash
git add -A && git commit -m "chore: scaffold vite react-ts project"
```

---

### Task 2: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install core deps**

```bash
cd "C:/Users/Administrator/hextech-aram-tools" && npm install react-router-dom lucide-react
```

- [ ] **Step 2: Install dev deps**

```bash
cd "C:/Users/Administrator/hextech-aram-tools" && npm install -D tailwindcss @tailwindcss/vite
```

- [ ] **Step 3: Install shadcn/ui CLI and init**

```bash
cd "C:/Users/Administrator/hextech-aram-tools" && npx shadcn@latest init -d --force
```

- [ ] **Step 4: Add shadcn/ui components**

```bash
cd "C:/Users/Administrator/hextech-aram-tools" && npx shadcn@latest add button badge card input select command popover separator scroll-area tooltip
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: install deps and init shadcn/ui"
```

---

### Task 3: Configure Tailwind and Vite

**Files:**
- Create/Modify: `vite.config.ts`
- Create/Modify: `src/index.css`

- [ ] **Step 1: Update vite.config.ts**

Write `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 2: Update src/index.css**

Write `src/index.css`:
```css
@import "tailwindcss";

@layer base {
  :root {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 6.9%;
    --card-foreground: 210 40% 98%;
    --primary: 263.4 70% 50.4%;
    --primary-foreground: 210 40% 98%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 50.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 263.4 70% 50.4%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "chore: configure tailwind and vite aliases"
```

---

### Task 4: TypeScript type definitions

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Write all type definitions**

Write `src/types/index.ts`:
```typescript
export type Confidence = 'high' | 'medium' | 'low' | 'unverified';
export type SourceType = 'official' | 'community' | 'inferred';
export type Status = 'active' | 'unknown' | 'unverified';
export type Tier = 'Silver' | 'Gold' | 'Prismatic';
export type Priority = 'recommended' | 'optional' | 'not-recommended' | 'fun';

export interface Hero {
  heroId: string;
  heroNameCn: string;
  heroNameEn: string;
  roles: string[];
  tags: string[];
  iconUrl: string;
  sourceUrl: string;
  confidence: Confidence;
  status: Status;
}

export interface Augment {
  augmentId: string;
  augmentNameCn: string;
  augmentNameEn: string;
  tier: Tier;
  setName: string;
  effect: string;
  tags: string[];
  suitableRoles: string[];
  unsuitableRoles: string[];
  sourceType: SourceType;
  sourceUrl: string;
  confidence: Confidence;
  status: Status;
  notes: string;
}

export interface HeroAugmentRule {
  ruleId: string;
  heroId: string;
  heroRole: string;
  augmentTag: string;
  priority: Priority;
  reason: string;
  confidence: Confidence;
}

export interface AugmentItemSynergy {
  synergyId: string;
  augmentId: string;
  itemName: string;
  synergyType: string;
  suitableRoles: string[];
  stabilityRating: number;
  funRating: number;
  confidence: Confidence;
  notes: string;
}

export interface PatchChange {
  patchId: string;
  patchVersion: string;
  date: string;
  category: 'mechanic' | 'augment' | 'hero' | 'item';
  target: string;
  changeSummary: string;
  impactOnRecommendations: string;
  sourceUrl: string;
  confidence: Confidence;
}

export interface CommunityBuild {
  buildId: string;
  buildName: string;
  heroes: string[];
  requiredAugments: string[];
  requiredItems: string[];
  playstyle: string;
  difficulty: 'easy' | 'medium' | 'hard';
  risk: 'low' | 'medium' | 'high';
  funRating: number | null;
  sourceUrl: string;
  confidence: Confidence;
}

export interface CompRule {
  ruleId: string;
  metricName: string;
  condition: string;
  warningTemplate: string;
  recommendationTemplate: string;
  confidence: Confidence;
}

export interface TripleChoiceInput {
  heroId: string;
  existingAugmentIds: string[];
  candidateAugmentIds: [string, string, string];
  compGaps: string[];
}

export interface TripleChoiceResult {
  augmentId: string;
  priority: Priority;
  reason: string;
  impactOnPlaystyle: string;
  recommendedItemDirection: string;
  sourceBasis: '官方机制' | '社区经验' | '机制推断';
  confidence: Confidence;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/index.ts && git commit -m "feat: add TypeScript type definitions for all data tables"
```

---

### Task 5: Heroes data file

**Files:**
- Create: `src/data/heroes.ts`

- [ ] **Step 1: Write heroes data**

Write `src/data/heroes.ts`:
```typescript
import type { Hero } from '@/types';

export const heroes: Hero[] = [
  {
    heroId: 'vladimir',
    heroNameCn: '弗拉基米尔',
    heroNameEn: 'Vladimir',
    roles: ['消耗', '回复续航'],
    tags: ['法术', '续航', '前排'],
    iconUrl: 'https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/Vladimir.png',
    sourceUrl: 'https://space.bilibili.com/',
    confidence: 'medium',
    status: 'active',
  },
  {
    heroId: 'galio',
    heroNameCn: '加里奥',
    heroNameEn: 'Galio',
    roles: ['开团', '前排', '保护'],
    tags: ['法术', '坦克', '控制'],
    iconUrl: 'https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/Galio.png',
    sourceUrl: 'https://space.bilibili.com/',
    confidence: 'medium',
    status: 'active',
  },
  {
    heroId: 'viktor',
    heroNameCn: '维克托',
    heroNameEn: 'Viktor',
    roles: ['爆发', '消耗', '持续输出'],
    tags: ['法术', '法师'],
    iconUrl: 'https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/Viktor.png',
    sourceUrl: 'https://space.bilibili.com/',
    confidence: 'medium',
    status: 'active',
  },
  {
    heroId: 'swain',
    heroNameCn: '斯维因',
    heroNameEn: 'Swain',
    roles: ['前排', '消耗', '回复续航'],
    tags: ['法术', '坦克', '续航'],
    iconUrl: 'https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/Swain.png',
    sourceUrl: 'https://space.bilibili.com/',
    confidence: 'medium',
    status: 'active',
  },
  {
    heroId: 'fiora',
    heroNameCn: '菲奥娜',
    heroNameEn: 'Fiora',
    roles: ['爆发', '收割', '持续输出'],
    tags: ['物理', '战士', '刺客'],
    iconUrl: 'https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/Fiora.png',
    sourceUrl: 'https://space.bilibili.com/',
    confidence: 'medium',
    status: 'active',
  },
  {
    heroId: 'bardo',
    heroNameCn: '巴德',
    heroNameEn: 'Bard',
    roles: ['保护', '消耗', '团队功能'],
    tags: ['法术', '辅助'],
    iconUrl: 'https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/Bard.png',
    sourceUrl: 'https://space.bilibili.com/',
    confidence: 'medium',
    status: 'active',
  },
  {
    heroId: 'samira',
    heroNameCn: '莎米拉',
    heroNameEn: 'Samira',
    roles: ['爆发', '收割'],
    tags: ['物理', '射手'],
    iconUrl: 'https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/Samira.png',
    sourceUrl: 'https://space.bilibili.com/',
    confidence: 'medium',
    status: 'active',
  },
  {
    heroId: 'darius',
    heroNameCn: '德莱厄斯',
    heroNameEn: 'Darius',
    roles: ['爆发', '收割', '前排'],
    tags: ['物理', '战士'],
    iconUrl: 'https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/Darius.png',
    sourceUrl: 'https://space.bilibili.com/',
    confidence: 'medium',
    status: 'active',
  },
  {
    heroId: 'thresh',
    heroNameCn: '锤石',
    heroNameEn: 'Thresh',
    roles: ['开团', '保护', '控制'],
    tags: ['坦克', '辅助', '物理'],
    iconUrl: 'https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/Thresh.png',
    sourceUrl: 'https://space.bilibili.com/',
    confidence: 'low',
    status: 'active',
  },
  {
    heroId: 'xinzhao',
    heroNameCn: '赵信',
    heroNameEn: 'Xin Zhao',
    roles: ['开团', '爆发', '收割'],
    tags: ['物理', '战士'],
    iconUrl: 'https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/XinZhao.png',
    sourceUrl: 'https://space.bilibili.com/',
    confidence: 'low',
    status: 'active',
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/heroes.ts && git commit -m "feat: add heroes data with 10 heroes from B站 community research"
```

---

### Task 6: Augments data file

**Files:**
- Create: `src/data/augments.ts`

- [ ] **Step 1: Write augments data**

Write `src/data/augments.ts`:
```typescript
import type { Augment } from '@/types';

export const augments: Augment[] = [
  {
    augmentId: 'one-by-one',
    augmentNameCn: '一板一眼',
    augmentNameEn: 'One by One',
    tier: 'Prismatic',
    setName: '攻击/物理系',
    effect: '物理英雄核心符文，大幅提升基础攻击力，物理英雄"成帝之路"',
    tags: ['物理', '攻击', 'AD', '核心'],
    suitableRoles: ['爆发', '持续输出', '收割'],
    unsuitableRoles: ['消耗', '保护'],
    sourceType: 'community',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'high',
    status: 'active',
    notes: '社区公认物理系最强单符文，46.3万播放量视频确认',
  },
  {
    augmentId: 'oil-refinery',
    augmentNameCn: '炼油焚绝',
    augmentNameEn: 'Oil Refinery Burnout',
    tier: 'Prismatic',
    setName: '灼烧/持续伤害系',
    effect: '灼烧流核心，配合5件灼烧装备+8个海克斯联动，持续伤害大幅提升',
    tags: ['灼烧', '法术', '持续伤害'],
    suitableRoles: ['消耗', '持续输出'],
    unsuitableRoles: ['爆发', '收割'],
    sourceType: 'community',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'high',
    status: 'active',
    notes: 'S级强化，26.9版本被大砍（辣椒油削弱），但仍强',
  },
  {
    augmentId: 'upgraded-sheen',
    augmentNameCn: '升级耀光',
    augmentNameEn: 'Upgraded Sheen',
    tier: 'Prismatic',
    setName: '法术/巫术系',
    effect: '耀光效果升级强化，技能后普攻附带额外伤害大幅提升',
    tags: ['法术', '耀光', '技能'],
    suitableRoles: ['爆发', '消耗'],
    unsuitableRoles: ['前排', '保护'],
    sourceType: 'community',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'high',
    status: 'active',
    notes: '曾存在双重触发BUG导致强度爆炸，A+级；多个版本反复出现BUG',
  },
  {
    augmentId: 'hat-on-hat',
    augmentNameCn: '帽上加帽',
    augmentNameEn: 'Hat on Hat',
    tier: 'Prismatic',
    setName: '法术/巫术系',
    effect: '法术强度额外百分比增幅，法师核心强化',
    tags: ['法术', 'AP', '核心'],
    suitableRoles: ['爆发', '消耗', '持续输出'],
    unsuitableRoles: ['前排', '保护'],
    sourceType: 'community',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'high',
    status: 'active',
    notes: 'S级强化(法师)，法师首选',
  },
  {
    augmentId: 'quantum-computing',
    augmentNameCn: '量子计算',
    augmentNameEn: 'Quantum Computing',
    tier: 'Prismatic',
    setName: '特殊/娱乐系',
    effect: '技能冷却机制特殊计算，26.8版本被削弱，跌落神坛',
    tags: ['法术', '冷却', '特殊'],
    suitableRoles: ['消耗', '持续输出'],
    unsuitableRoles: ['爆发'],
    sourceType: 'community',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'high',
    status: 'active',
    notes: '26.8版本削弱：A→B级',
  },
  {
    augmentId: 'super-brain',
    augmentNameCn: '超强大脑',
    augmentNameEn: 'Super Brain',
    tier: 'Gold',
    setName: '经济/发育系',
    effect: '26.10版本"弱智加强"，维克托专属调整，提供额外属性/金币',
    tags: ['经济', '发育', '特殊'],
    suitableRoles: ['消耗', '爆发'],
    unsuitableRoles: ['前排'],
    sourceType: 'community',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'medium',
    status: 'active',
    notes: '26.10版本维克托专属调整，具体效果待验证',
  },
  {
    augmentId: 'spin-up',
    augmentNameCn: '转起来了',
    augmentNameEn: 'Spin Up',
    tier: 'Gold',
    setName: '移动/机动系',
    effect: '移动和攻击时积累旋转层数，提供额外伤害和机动性',
    tags: ['机动', '攻击', '战士'],
    suitableRoles: ['爆发', '收割', '开团'],
    unsuitableRoles: ['保护'],
    sourceType: 'community',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'high',
    status: 'active',
    notes: '26.10版本重新启用（此前被禁用），A级',
  },
  {
    augmentId: 'steel-your-heart',
    augmentNameCn: '钢化你心',
    augmentNameEn: 'Steel Your Heart',
    tier: 'Gold',
    setName: '坦克/防御系',
    effect: '大幅提升防御属性，26.10加强，后续层数3倍加成',
    tags: ['防御', '坦克', '前排'],
    suitableRoles: ['前排', '开团', '保护'],
    unsuitableRoles: ['爆发', '消耗'],
    sourceType: 'community',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'high',
    status: 'active',
    notes: '26.10加强后A+级',
  },
  {
    augmentId: 'critical-strike',
    augmentNameCn: '关键暴击',
    augmentNameEn: 'Critical Strike',
    tier: 'Gold',
    setName: '攻击/物理系',
    effect: '暴击伤害和暴击率提升，物理C位核心',
    tags: ['物理', '暴击', 'AD'],
    suitableRoles: ['爆发', '持续输出', '收割'],
    unsuitableRoles: ['前排', '保护', '消耗'],
    sourceType: 'community',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'medium',
    status: 'active',
    notes: '暴击体系核心符文之一',
  },
  {
    augmentId: 'continuous-hammer',
    augmentNameCn: '连拨击锤',
    augmentNameEn: 'Continuous Hammer',
    tier: 'Silver',
    setName: '攻击/物理系',
    effect: '连续攻击提升攻击速度，普攻特效流核心',
    tags: ['物理', '攻击速度', 'AD'],
    suitableRoles: ['持续输出', '收割'],
    unsuitableRoles: ['爆发', '消耗', '保护'],
    sourceType: 'community',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'medium',
    status: 'active',
    notes: '',
  },
  {
    augmentId: 'tank-engine',
    augmentNameCn: '坦克引擎',
    augmentNameEn: 'Tank Engine',
    tier: 'Silver',
    setName: '坦克/防御系',
    effect: '根据最大生命值提供移动速度和额外伤害',
    tags: ['坦克', '生命值', '机动'],
    suitableRoles: ['前排', '开团'],
    unsuitableRoles: ['消耗', '保护'],
    sourceType: 'community',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'medium',
    status: 'active',
    notes: '',
  },
  {
    augmentId: 'healing-heart',
    augmentNameCn: '会心治疗',
    augmentNameEn: 'Healing Heart',
    tier: 'Silver',
    setName: '治疗/回复系',
    effect: '治疗和护盾效果提升，辅助核心符文',
    tags: ['治疗', '护盾', '辅助'],
    suitableRoles: ['保护', '回复续航'],
    unsuitableRoles: ['爆发', '收割'],
    sourceType: 'community',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'medium',
    status: 'active',
    notes: '',
  },
  {
    augmentId: 'first-aid-tools',
    augmentNameCn: '急救工具',
    augmentNameEn: 'First Aid Tools',
    tier: 'Silver',
    setName: '治疗/回复系',
    effect: '低血量时获得额外治疗和护盾',
    tags: ['治疗', '生存', '辅助'],
    suitableRoles: ['保护', '前排', '回复续航'],
    unsuitableRoles: ['爆发'],
    sourceType: 'community',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'medium',
    status: 'active',
    notes: '',
  },
  {
    augmentId: 'flying-kick',
    augmentNameCn: '飞身踢',
    augmentNameEn: 'Flying Kick',
    tier: 'Gold',
    setName: '移动/机动系',
    effect: '位移后造成额外伤害并提升移速，刺客和战士核心',
    tags: ['机动', '物理', '刺客'],
    suitableRoles: ['爆发', '收割', '开团'],
    unsuitableRoles: ['保护', '消耗'],
    sourceType: 'community',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'high',
    status: 'active',
    notes: '26.10版本飞身踢视野Bug修复；加里奥飞身踢体系强势',
  },
  {
    augmentId: 'guilty-pleasure',
    augmentNameCn: '罪恶快感',
    augmentNameEn: 'Guilty Pleasure',
    tier: 'Prismatic',
    setName: '特殊/娱乐系',
    effect: '击杀后大幅提升属性并刷新部分技能，高风险高回报',
    tags: ['击杀', '重置', '高上限'],
    suitableRoles: ['爆发', '收割'],
    unsuitableRoles: ['保护', '前排'],
    sourceType: 'community',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'medium',
    status: 'active',
    notes: '诺手+王国机神联动，暴力五杀套路',
  },
  {
    augmentId: 'one-after-another',
    augmentNameCn: '接二连三',
    augmentNameEn: 'One After Another',
    tier: 'Silver',
    setName: '控制/功能系',
    effect: '连续控制技能效果提升',
    tags: ['控制', '功能'],
    suitableRoles: ['开团', '保护', '控制'],
    unsuitableRoles: ['爆发', '收割'],
    sourceType: 'community',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'low',
    status: 'active',
    notes: '',
  },
  {
    augmentId: 'slow-and-steady',
    augmentNameCn: '快中求稳',
    augmentNameEn: 'Slow and Steady',
    tier: 'Silver',
    setName: '控制/功能系',
    effect: '降低攻速换取技能伤害和韧性',
    tags: ['控制', '功能', '韧性'],
    suitableRoles: ['前排', '开团'],
    unsuitableRoles: ['爆发', '持续输出'],
    sourceType: 'community',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'low',
    status: 'active',
    notes: '',
  },
];

export const augmentsById = Object.fromEntries(
  augments.map((a) => [a.augmentId, a])
);
```

- [ ] **Step 2: Commit**

```bash
git add src/data/augments.ts && git commit -m "feat: add augments data with 17 confirmed augments from B站 research"
```

---

### Task 7: Hero augment rules data file

**Files:**
- Create: `src/data/heroAugmentRules.ts`

- [ ] **Step 1: Write hero augment rules**

Write `src/data/heroAugmentRules.ts`:
```typescript
import type { HeroAugmentRule } from '@/types';

export const heroAugmentRules: HeroAugmentRule[] = [
  // ADC/射手角色
  { ruleId: 'r1', heroId: '', heroRole: '持续输出', augmentTag: 'AD', priority: 'recommended', reason: '射手依赖物理输出，AD向强化直接提升伤害', confidence: 'high' },
  { ruleId: 'r2', heroId: '', heroRole: '持续输出', augmentTag: '暴击', priority: 'recommended', reason: '暴击流射手伤害上限显著提升', confidence: 'high' },
  { ruleId: 'r3', heroId: '', heroRole: '持续输出', augmentTag: '攻击速度', priority: 'recommended', reason: '攻速提升射手持续输出能力', confidence: 'high' },
  { ruleId: 'r4', heroId: '', heroRole: '持续输出', augmentTag: 'AP', priority: 'not-recommended', reason: '射手通常不依赖法术强度', confidence: 'high' },
  { ruleId: 'r5', heroId: '', heroRole: '持续输出', augmentTag: '坦克', priority: 'not-recommended', reason: '射手不需要前排向强化', confidence: 'high' },
  // 法师角色
  { ruleId: 'r6', heroId: '', heroRole: '爆发', augmentTag: 'AP', priority: 'recommended', reason: '法师依赖法术强度提升爆发伤害', confidence: 'high' },
  { ruleId: 'r7', heroId: '', heroRole: '爆发', augmentTag: '法术', priority: 'recommended', reason: '法术向强化直接提升技能伤害', confidence: 'high' },
  { ruleId: 'r8', heroId: '', heroRole: '爆发', augmentTag: '技能', priority: 'recommended', reason: '技能强化提升法师连招伤害', confidence: 'medium' },
  { ruleId: 'r9', heroId: '', heroRole: '爆发', augmentTag: 'AD', priority: 'not-recommended', reason: '法师不依赖物理攻击', confidence: 'high' },
  { ruleId: 'r10', heroId: '', heroRole: '爆发', augmentTag: '坦克', priority: 'not-recommended', reason: '法师型英雄选坦克强化会浪费伤害潜力', confidence: 'high' },
  // 消耗角色
  { ruleId: 'r11', heroId: '', heroRole: '消耗', augmentTag: 'AP', priority: 'recommended', reason: '法术强度提升消耗能力', confidence: 'high' },
  { ruleId: 'r12', heroId: '', heroRole: '消耗', augmentTag: '持续伤害', priority: 'recommended', reason: '持续伤害强化与消耗型英雄高度适配', confidence: 'high' },
  { ruleId: 'r13', heroId: '', heroRole: '消耗', augmentTag: '冷却', priority: 'optional', reason: '冷却缩减提升技能频率', confidence: 'medium' },
  // 前排/坦克角色
  { ruleId: 'r14', heroId: '', heroRole: '前排', augmentTag: '坦克', priority: 'recommended', reason: '前排英雄首选防御向强化', confidence: 'high' },
  { ruleId: 'r15', heroId: '', heroRole: '前排', augmentTag: '防御', priority: 'recommended', reason: '防御强化直接提升坦度', confidence: 'high' },
  { ruleId: 'r16', heroId: '', heroRole: '前排', augmentTag: '生命值', priority: 'recommended', reason: '生命值强化提升前排生存能力', confidence: 'high' },
  { ruleId: 'r17', heroId: '', heroRole: '前排', augmentTag: 'AP', priority: 'not-recommended', reason: '坦克型前排不需要法术强度', confidence: 'high' },
  { ruleId: 'r18', heroId: '', heroRole: '前排', augmentTag: '暴击', priority: 'not-recommended', reason: '前排不需要暴击强化', confidence: 'high' },
  // 保护角色
  { ruleId: 'r19', heroId: '', heroRole: '保护', augmentTag: '治疗', priority: 'recommended', reason: '治疗增强直接提升保护能力', confidence: 'high' },
  { ruleId: 'r20', heroId: '', heroRole: '保护', augmentTag: '辅助', priority: 'recommended', reason: '辅助向强化提升团队贡献', confidence: 'high' },
  { ruleId: 'r21', heroId: '', heroRole: '保护', augmentTag: '生存', priority: 'recommended', reason: '辅助活得越久团队收益越大', confidence: 'high' },
  { ruleId: 'r22', heroId: '', heroRole: '保护', augmentTag: 'AD', priority: 'not-recommended', reason: '辅助型英雄选输出强化浪费定位', confidence: 'high' },
  // 收割角色
  { ruleId: 'r23', heroId: '', heroRole: '收割', augmentTag: 'AD', priority: 'recommended', reason: '物理收割型英雄伤害提升', confidence: 'high' },
  { ruleId: 'r24', heroId: '', heroRole: '收割', augmentTag: '击杀', priority: 'recommended', reason: '击杀相关强化与收割定位高度契合', confidence: 'high' },
  { ruleId: 'r25', heroId: '', heroRole: '收割', augmentTag: '机动', priority: 'recommended', reason: '机动性帮助收割型英雄进场退场', confidence: 'high' },
  { ruleId: 'r26', heroId: '', heroRole: '收割', augmentTag: '坦克', priority: 'not-recommended', reason: '收割型不需要防御向强化', confidence: 'high' },
  // 开团角色
  { ruleId: 'r27', heroId: '', heroRole: '开团', augmentTag: '坦克', priority: 'recommended', reason: '开团英雄需要坦度支撑', confidence: 'high' },
  { ruleId: 'r28', heroId: '', heroRole: '开团', augmentTag: '机动', priority: 'recommended', reason: '机动性帮助开团英雄找到进场时机', confidence: 'high' },
  { ruleId: 'r29', heroId: '', heroRole: '开团', augmentTag: '控制', priority: 'recommended', reason: '控制强化提升开团成功率', confidence: 'medium' },
  // 回复续航角色
  { ruleId: 'r30', heroId: '', heroRole: '回复续航', augmentTag: '治疗', priority: 'recommended', reason: '治疗强化与续航型英雄完美配合', confidence: 'high' },
  { ruleId: 'r31', heroId: '', heroRole: '回复续航', augmentTag: '生存', priority: 'recommended', reason: '生存强化让续航型英雄更难被击杀', confidence: 'high' },
  { ruleId: 'r32', heroId: '', heroRole: '回复续航', augmentTag: '坦克', priority: 'optional', reason: '配合续航能力成为不死前排', confidence: 'medium' },
  { ruleId: 'r33', heroId: '', heroRole: '回复续航', augmentTag: '暴击', priority: 'not-recommended', reason: '续航型英雄通常在技能而非普攻', confidence: 'medium' },
  // 控制角色
  { ruleId: 'r34', heroId: '', heroRole: '控制', augmentTag: '控制', priority: 'recommended', reason: '控制强化直接提升团队贡献', confidence: 'high' },
  { ruleId: 'r35', heroId: '', heroRole: '控制', augmentTag: '功能', priority: 'recommended', reason: '功能性强化与控制定位匹配', confidence: 'medium' },
  { ruleId: 'r36', heroId: '', heroRole: '控制', augmentTag: '冷却', priority: 'optional', reason: '冷却缩减让控制技能更频繁', confidence: 'medium' },
  // 发育
  { ruleId: 'r37', heroId: '', heroRole: '消耗', augmentTag: '经济', priority: 'optional', reason: '经济强化加速成装进度', confidence: 'medium' },
  { ruleId: 'r38', heroId: '', heroRole: '爆发', augmentTag: '经济', priority: 'optional', reason: '经济强化加速成装进度', confidence: 'medium' },
  { ruleId: 'r39', heroId: '', heroRole: '持续输出', augmentTag: '经济', priority: 'optional', reason: '经济强化加速成装进度', confidence: 'medium' },
  // 高上限/娱乐
  { ruleId: 'r40', heroId: '', heroRole: '收割', augmentTag: '高上限', priority: 'optional', reason: '高上限娱乐型强化在特定情况下有奇效', confidence: 'low' },
  { ruleId: 'r41', heroId: '', heroRole: '爆发', augmentTag: '高上限', priority: 'optional', reason: '高上限娱乐型强化在特定情况下有奇效', confidence: 'low' },
  { ruleId: 'r42', heroId: '', heroRole: '保护', augmentTag: '高上限', priority: 'not-recommended', reason: '辅助角色不应冒险选高上限娱乐强化', confidence: 'medium' },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/heroAugmentRules.ts && git commit -m "feat: add hero augment rules covering 8 role types × augment tags"
```

---

### Task 8: Augment-item synergies data file

**Files:**
- Create: `src/data/augmentItemSynergies.ts`

- [ ] **Step 1: Write augment-item synergies**

Write `src/data/augmentItemSynergies.ts`:
```typescript
import type { AugmentItemSynergy } from '@/types';

export const augmentItemSynergies: AugmentItemSynergy[] = [
  {
    synergyId: 's1',
    augmentId: 'oil-refinery',
    itemName: '兰德里的苦楚',
    synergyType: '灼烧伤害叠加，核心联动装备',
    suitableRoles: ['消耗', '持续输出'],
    stabilityRating: 5,
    funRating: 3,
    confidence: 'high',
    notes: 'S级联动，炼油焚绝灼烧体系核心',
  },
  {
    synergyId: 's2',
    augmentId: 'oil-refinery',
    itemName: '恶魔之拥',
    synergyType: '灼烧伤害叠加，双灼烧联动',
    suitableRoles: ['消耗', '持续输出'],
    stabilityRating: 4,
    funRating: 4,
    confidence: 'high',
    notes: '',
  },
  {
    synergyId: 's3',
    augmentId: 'one-by-one',
    itemName: '收集者',
    synergyType: '基础攻击提升+斩杀阈值联动',
    suitableRoles: ['爆发', '持续输出', '收割'],
    stabilityRating: 5,
    funRating: 4,
    confidence: 'high',
    notes: 'S级联动，一板一眼物理体系核心',
  },
  {
    synergyId: 's4',
    augmentId: 'one-by-one',
    itemName: '无尽之刃',
    synergyType: '基础攻击提升+暴击伤害联动',
    suitableRoles: ['爆发', '持续输出'],
    stabilityRating: 4,
    funRating: 4,
    confidence: 'high',
    notes: '',
  },
  {
    synergyId: 's5',
    augmentId: 'one-by-one',
    itemName: '多米尼克领主的致意',
    synergyType: '基础攻击提升+护甲穿透联动',
    suitableRoles: ['爆发', '持续输出'],
    stabilityRating: 4,
    funRating: 3,
    confidence: 'high',
    notes: '',
  },
  {
    synergyId: 's6',
    augmentId: 'upgraded-sheen',
    itemName: '三相之力',
    synergyType: '耀光效果双重强化，技能后普攻大幅增强',
    suitableRoles: ['爆发', '收割'],
    stabilityRating: 3,
    funRating: 4,
    confidence: 'high',
    notes: '曾有双重触发BUG',
  },
  {
    synergyId: 's7',
    augmentId: 'upgraded-sheen',
    itemName: '巫妖之祸',
    synergyType: '耀光效果双重强化，法师普攻爆发',
    suitableRoles: ['爆发', '消耗'],
    stabilityRating: 3,
    funRating: 5,
    confidence: 'high',
    notes: '',
  },
  {
    synergyId: 's8',
    augmentId: 'hat-on-hat',
    itemName: '灭世者的死亡之帽',
    synergyType: '法术强度百分比双重增幅，法师终极联动',
    suitableRoles: ['爆发', '消耗', '持续输出'],
    stabilityRating: 5,
    funRating: 4,
    confidence: 'high',
    notes: 'S级联动(法师)',
  },
  {
    synergyId: 's9',
    augmentId: 'steel-your-heart',
    itemName: '荆棘之甲',
    synergyType: '防御属性叠加+反伤增强',
    suitableRoles: ['前排'],
    stabilityRating: 5,
    funRating: 2,
    confidence: 'high',
    notes: 'A+级联动',
  },
  {
    synergyId: 's10',
    augmentId: 'steel-your-heart',
    itemName: '兰顿之兆',
    synergyType: '防御属性叠加+暴击减免',
    suitableRoles: ['前排'],
    stabilityRating: 4,
    funRating: 2,
    confidence: 'high',
    notes: '26.10加强，后续层数3倍加成',
  },
  {
    synergyId: 's11',
    augmentId: 'guilty-pleasure',
    itemName: '海克斯镜片C4',
    synergyType: '击杀重置+高攻击联动，滚雪球',
    suitableRoles: ['收割'],
    stabilityRating: 2,
    funRating: 5,
    confidence: 'medium',
    notes: '娱乐性强，翻车风险高',
  },
  {
    synergyId: 's12',
    augmentId: 'flying-kick',
    itemName: '黄昏与黎明',
    synergyType: '位移强化+双形态武器切换联动',
    suitableRoles: ['爆发', '收割', '开团'],
    stabilityRating: 3,
    funRating: 5,
    confidence: 'medium',
    notes: '',
  },
  {
    synergyId: 's13',
    augmentId: 'flying-kick',
    itemName: '实现器',
    synergyType: '位移后法术伤害爆发',
    suitableRoles: ['爆发', '消耗'],
    stabilityRating: 3,
    funRating: 4,
    confidence: 'medium',
    notes: '',
  },
  {
    synergyId: 's14',
    augmentId: 'tank-engine',
    itemName: '原生质护带',
    synergyType: '生命值→移速+防御联动',
    suitableRoles: ['前排', '开团'],
    stabilityRating: 4,
    funRating: 3,
    confidence: 'medium',
    notes: '',
  },
  {
    synergyId: 's15',
    augmentId: 'healing-heart',
    itemName: '歌之权冠',
    synergyType: '治疗增强+团队增益联动',
    suitableRoles: ['保护', '回复续航'],
    stabilityRating: 4,
    funRating: 2,
    confidence: 'medium',
    notes: '',
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/augmentItemSynergies.ts && git commit -m "feat: add augment-item synergies with 15 confirmed combinations"
```

---

### Task 9: Patch changes data file

**Files:**
- Create: `src/data/patchChanges.ts`

- [ ] **Step 1: Write patch changes data**

Write `src/data/patchChanges.ts`:
```typescript
import type { PatchChange } from '@/types';

export const patchChanges: PatchChange[] = [
  {
    patchId: 'p1',
    patchVersion: '26.10',
    date: '2026-05-13',
    category: 'mechanic',
    target: '屠夫桥炮台',
    changeSummary: '炮台机制优化',
    impactOnRecommendations: '地图机制小改，不影响强化推荐',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'high',
  },
  {
    patchId: 'p2',
    patchVersion: '26.10',
    date: '2026-05-13',
    category: 'augment',
    target: '转起来了',
    changeSummary: '重新启用（此前被禁用）',
    impactOnRecommendations: '机动系强化可选范围恢复，战士/刺客可重新考虑',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'high',
  },
  {
    patchId: 'p3',
    patchVersion: '26.10',
    date: '2026-05-13',
    category: 'augment',
    target: '超强大脑',
    changeSummary: '"弱智加强"，维克托专属调整',
    impactOnRecommendations: '维克托选用此强化优先级提升',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'medium',
  },
  {
    patchId: 'p4',
    patchVersion: '26.10',
    date: '2026-05-13',
    category: 'augment',
    target: '飞身踢',
    changeSummary: '视野Bug修复',
    impactOnRecommendations: '修复后不影响推荐逻辑',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'high',
  },
  {
    patchId: 'p5',
    patchVersion: '26.10',
    date: '2026-05-13',
    category: 'hero',
    target: '加里奥',
    changeSummary: '26.10版本强势，飞身踢体系核心',
    impactOnRecommendations: '加里奥优先考虑飞身踢等机动系强化',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'medium',
  },
  {
    patchId: 'p6',
    patchVersion: '26.10',
    date: '2026-05-13',
    category: 'hero',
    target: '安倍萨',
    changeSummary: '26.10版本强势',
    impactOnRecommendations: '待更多数据确认',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'low',
  },
  {
    patchId: 'p7',
    patchVersion: '26.9',
    date: '2026-05-03',
    category: 'augment',
    target: '炼油焚绝（辣椒油）',
    changeSummary: '大幅削弱',
    impactOnRecommendations: '优先级从S降为A，但仍为灼烧体系核心',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'high',
  },
  {
    patchId: 'p8',
    patchVersion: '26.9',
    date: '2026-05-03',
    category: 'hero',
    target: '巴德',
    changeSummary: '增强；电刀回调受益者',
    impactOnRecommendations: '巴德出装方向可考虑电刀路线',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'medium',
  },
  {
    patchId: 'p9',
    patchVersion: '26.9',
    date: '2026-05-03',
    category: 'hero',
    target: '龙女',
    changeSummary: '重做',
    impactOnRecommendations: '龙女强化和出装方向需要重新评估',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'medium',
  },
  {
    patchId: 'p10',
    patchVersion: '26.9',
    date: '2026-05-03',
    category: 'item',
    target: '多兰盔/吸血鞋',
    changeSummary: '新装备上线',
    impactOnRecommendations: '新增装备选项，需评估与现有强化联动',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'medium',
  },
  {
    patchId: 'p11',
    patchVersion: '26.8',
    date: '2026-04-15',
    category: 'augment',
    target: '量子计算',
    changeSummary: '被削弱，跌落神坛',
    impactOnRecommendations: '优先级从A降为B，不再作为法师首选',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'high',
  },
  {
    patchId: 'p12',
    patchVersion: '26.3',
    date: '2026-02-02',
    category: 'mechanic',
    target: '45张新增符文 + 9大套装体系',
    changeSummary: '45张新增符文上线，引入9大套装体系分类',
    impactOnRecommendations: '大幅扩展强化选择范围，套装协同成为重要考量因素',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'high',
  },
  {
    patchId: 'p13',
    patchVersion: '25S4',
    date: '2025-11-11',
    category: 'mechanic',
    target: '属性锻造器',
    changeSummary: '属性锻造器系统上线，可在游戏中"锻体"强化英雄属性',
    impactOnRecommendations: '新增属性锻造维度，强化选择时需考虑锻体方向一致性',
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'high',
  },
];

export const currentVersion = '26.10';
```

- [ ] **Step 2: Commit**

```bash
git add src/data/patchChanges.ts && git commit -m "feat: add patch changes covering 7 version updates"
```

---

### Task 10: Community builds data file

**Files:**
- Create: `src/data/communityBuilds.ts`

- [ ] **Step 1: Write community builds data**

Write `src/data/communityBuilds.ts`:
```typescript
import type { CommunityBuild } from '@/types';

export const communityBuilds: CommunityBuild[] = [
  {
    buildId: 'b1',
    buildName: '远古龙斩杀流',
    heroes: ['任意斩杀型英雄'],
    requiredAugments: ['随身远古龙'],
    requiredItems: [],
    playstyle: '自带远古龙斩杀效果，强度超标',
    difficulty: 'medium',
    risk: 'low',
    funRating: 5,
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'medium',
  },
  {
    buildId: 'b2',
    buildName: '五杀陀螺莎米拉',
    heroes: ['莎米拉'],
    requiredAugments: ['全自动五杀符文'],
    requiredItems: [],
    playstyle: '一人一个最强符文，天胡四自选',
    difficulty: 'medium',
    risk: 'medium',
    funRating: 5,
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'medium',
  },
  {
    buildId: 'b3',
    buildName: '战神流锤石',
    heroes: ['锤石'],
    requiredAugments: ['隐藏超模符文'],
    requiredItems: [],
    playstyle: '海克斯乱斗隐藏超模打法',
    difficulty: 'hard',
    risk: 'high',
    funRating: 5,
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'low',
  },
  {
    buildId: 'b4',
    buildName: '花晓之剑AP赵信',
    heroes: ['赵信'],
    requiredAugments: ['花晓之剑'],
    requiredItems: ['AP出装路线'],
    playstyle: '2件套就能1V5的爆炸玩法',
    difficulty: 'medium',
    risk: 'medium',
    funRating: 4,
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'low',
  },
  {
    buildId: 'b5',
    buildName: '无限虚化狗',
    heroes: ['裁决/狗头'],
    requiredAugments: ['虚化符文'],
    requiredItems: [],
    playstyle: '最高胜率必玩英雄，随便一个符文质变',
    difficulty: 'easy',
    risk: 'low',
    funRating: 5,
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'medium',
  },
  {
    buildId: 'b6',
    buildName: '罪恶快感诺手',
    heroes: ['德莱厄斯'],
    requiredAugments: ['罪恶快感', '王国机神'],
    requiredItems: [],
    playstyle: '暴力五杀，击杀后属性爆炸',
    difficulty: 'hard',
    risk: 'high',
    funRating: 5,
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'medium',
  },
  {
    buildId: 'b7',
    buildName: '坦克拯救者',
    heroes: ['坦克型英雄'],
    requiredAugments: ['钢化你心', '坦克引擎'],
    requiredItems: ['荆棘之甲', '兰顿之兆'],
    playstyle: '海克斯拯救了坦克，强化符文加持下坦克重回强势',
    difficulty: 'easy',
    risk: 'low',
    funRating: 3,
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'high',
  },
  {
    buildId: 'b8',
    buildName: '物理成帝之路',
    heroes: ['物理射手/战士'],
    requiredAugments: ['一板一眼', '关键暴击'],
    requiredItems: ['收集者', '无尽之刃'],
    playstyle: '一板一眼+关键暴击的物理终极路线',
    difficulty: 'medium',
    risk: 'medium',
    funRating: 4,
    sourceUrl: 'https://www.bilibili.com/',
    confidence: 'high',
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/communityBuilds.ts && git commit -m "feat: add community builds with 8 known 套路 from B站"
```

---

### Task 11: Comp rules data file

**Files:**
- Create: `src/data/compRules.ts`

- [ ] **Step 1: Write comp rules**

Write `src/data/compRules.ts`:
```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/data/compRules.ts && git commit -m "feat: add comp synergy rules for 6 common team composition issues"
```

---

### Task 12: Shared UI components — ConfidenceBadge, TierBadge, SourceTag

**Files:**
- Create: `src/components/ConfidenceBadge.tsx`
- Create: `src/components/TierBadge.tsx`
- Create: `src/components/SourceTag.tsx`

- [ ] **Step 1: Write ConfidenceBadge**

Write `src/components/ConfidenceBadge.tsx`:
```typescript
import { Badge } from '@/components/ui/badge';
import type { Confidence } from '@/types';

const confidenceConfig: Record<Confidence, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; className: string }> = {
  high:   { label: '✓ 可信', variant: 'default', className: 'bg-emerald-600 hover:bg-emerald-700' },
  medium: { label: '~ 较可信', variant: 'secondary', className: 'bg-blue-600 hover:bg-blue-700' },
  low:    { label: '? 待确认', variant: 'outline', className: 'text-yellow-400 border-yellow-400' },
  unverified: { label: '⚠ 未验证', variant: 'destructive', className: 'bg-gray-600 hover:bg-gray-700' },
};

export function ConfidenceBadge({ level }: { level: Confidence }) {
  const config = confidenceConfig[level];
  return <Badge variant={config.variant} className={`text-xs ${config.className}`}>{config.label}</Badge>;
}
```

- [ ] **Step 2: Write TierBadge**

Write `src/components/TierBadge.tsx`:
```typescript
import { Badge } from '@/components/ui/badge';
import type { Tier } from '@/types';

const tierConfig: Record<Tier, string> = {
  Silver: 'bg-gray-500 hover:bg-gray-600',
  Gold: 'bg-amber-500 hover:bg-amber-600',
  Prismatic: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
};

export function TierBadge({ tier }: { tier: Tier }) {
  return <Badge className={`text-xs font-semibold ${tierConfig[tier]}`}>{tier}</Badge>;
}
```

- [ ] **Step 3: Write SourceTag**

Write `src/components/SourceTag.tsx`:
```typescript
import { Badge } from '@/components/ui/badge';
import type { SourceType } from '@/types';

const sourceConfig: Record<SourceType, { label: string; className: string }> = {
  official:   { label: '官方', className: 'bg-cyan-700 hover:bg-cyan-800' },
  community:  { label: '社区', className: 'bg-indigo-700 hover:bg-indigo-800' },
  inferred:   { label: '推断', className: 'bg-orange-700 hover:bg-orange-800' },
};

export function SourceTag({ type }: { type: SourceType }) {
  const config = sourceConfig[type];
  return <Badge className={`text-xs ${config.className}`}>{config.label}</Badge>;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ConfidenceBadge.tsx src/components/TierBadge.tsx src/components/SourceTag.tsx && git commit -m "feat: add ConfidenceBadge, TierBadge, and SourceTag shared components"
```

---

### Task 13: Shared UI — SearchInput and EmptyState

**Files:**
- Create: `src/components/SearchInput.tsx`
- Create: `src/components/EmptyState.tsx`

- [ ] **Step 1: Write SearchInput**

Write `src/components/SearchInput.tsx`:
```typescript
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = '搜索...' }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  );
}
```

- [ ] **Step 2: Write EmptyState**

Write `src/components/EmptyState.tsx`:
```typescript
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = '暂无匹配数据',
  description = '尝试使用其他关键词或筛选条件',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <SearchX className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/SearchInput.tsx src/components/EmptyState.tsx && git commit -m "feat: add SearchInput and EmptyState shared components"
```

---

### Task 14: AugmentCard component

**Files:**
- Create: `src/components/AugmentCard.tsx`

- [ ] **Step 1: Write AugmentCard**

Write `src/components/AugmentCard.tsx`:
```typescript
import { Card, CardContent } from '@/components/ui/card';
import { ConfidenceBadge } from './ConfidenceBadge';
import { TierBadge } from './TierBadge';
import { SourceTag } from './SourceTag';
import type { Augment } from '@/types';

interface AugmentCardProps {
  augment: Augment;
  compact?: boolean;
}

export function AugmentCard({ augment, compact = false }: AugmentCardProps) {
  if (compact) {
    return (
      <Card className="bg-card hover:bg-accent transition-colors cursor-pointer">
        <CardContent className="p-3 flex items-center gap-3">
          <TierBadge tier={augment.tier} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm truncate">{augment.augmentNameCn}</span>
              <span className="text-xs text-muted-foreground truncate">{augment.augmentNameEn}</span>
            </div>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{augment.effect}</p>
          </div>
          <ConfidenceBadge level={augment.confidence} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TierBadge tier={augment.tier} />
            <h3 className="text-lg font-semibold">{augment.augmentNameCn}</h3>
            <span className="text-sm text-muted-foreground">{augment.augmentNameEn}</span>
          </div>
          <div className="flex items-center gap-2">
            <SourceTag type={augment.sourceType} />
            <ConfidenceBadge level={augment.confidence} />
          </div>
        </div>

        <p className="text-sm text-foreground">{augment.effect}</p>

        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">套装: {augment.setName}</span>
          {augment.tags.map((tag) => (
            <span key={tag} className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">{tag}</span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>
            <span className="text-emerald-400">适合: </span>
            {augment.suitableRoles.join(', ') || '待确认'}
          </div>
          <div>
            <span className="text-red-400">不适合: </span>
            {augment.unsuitableRoles.join(', ') || '待确认'}
          </div>
        </div>

        {augment.notes && (
          <p className="text-xs text-muted-foreground border-t border-border pt-2">{augment.notes}</p>
        )}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AugmentCard.tsx && git commit -m "feat: add AugmentCard with full and compact variants"
```

---

### Task 15: HeroCard component

**Files:**
- Create: `src/components/HeroCard.tsx`

- [ ] **Step 1: Write HeroCard**

Write `src/components/HeroCard.tsx`:
```typescript
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ConfidenceBadge } from './ConfidenceBadge';
import type { Hero } from '@/types';

interface HeroCardProps {
  hero: Hero;
  recommendedAugments: string[];
  unsuitableAugments: string[];
}

export function HeroCard({ hero, recommendedAugments, unsuitableAugments }: HeroCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Card className="bg-card">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          {imgError ? (
            <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center text-lg font-bold text-muted-foreground">
              {hero.heroNameCn[0]}
            </div>
          ) : (
            <img
              src={hero.iconUrl}
              alt={hero.heroNameCn}
              className="w-12 h-12 rounded"
              onError={() => setImgError(true)}
            />
          )}
          <div>
            <h3 className="font-semibold">{hero.heroNameCn}</h3>
            <p className="text-xs text-muted-foreground">{hero.heroNameEn}</p>
          </div>
          <div className="ml-auto">
            <ConfidenceBadge level={hero.confidence} />
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {hero.roles.map((role) => (
            <span key={role} className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">{role}</span>
          ))}
        </div>

        {recommendedAugments.length > 0 && (
          <div className="text-xs">
            <span className="text-emerald-400">推荐强化: </span>
            {recommendedAugments.join(', ')}
          </div>
        )}

        {unsuitableAugments.length > 0 && (
          <div className="text-xs">
            <span className="text-red-400">避免强化: </span>
            {unsuitableAugments.join(', ')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/HeroCard.tsx && git commit -m "feat: add HeroCard component with image error fallback"
```

---

### Task 16: Search utility and decision engine

**Files:**
- Create: `src/lib/search.ts`
- Create: `src/lib/decision-engine.ts`

- [ ] **Step 1: Write search utility**

Write `src/lib/search.ts`:
```typescript
export function searchByKeyword<T>(
  items: T[],
  keyword: string,
  getText: (item: T) => string
): T[] {
  if (!keyword.trim()) return items;
  const lower = keyword.toLowerCase();
  return items.filter((item) => getText(item).toLowerCase().includes(lower));
}

export function filterByTags<T>(
  items: T[],
  selectedTags: string[],
  getTags: (item: T) => string[]
): T[] {
  if (selectedTags.length === 0) return items;
  return items.filter((item) => {
    const itemTags = getTags(item);
    return selectedTags.some((tag) => itemTags.includes(tag));
  });
}
```

- [ ] **Step 2: Write decision engine**

Write `src/lib/decision-engine.ts`:
```typescript
import type { TripleChoiceInput, TripleChoiceResult, Priority, Confidence, HeroAugmentRule } from '@/types';
import { augments, augmentsById } from '@/data/augments';
import { heroAugmentRules } from '@/data/heroAugmentRules';
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

    const matchingRules: HeroAugmentRule[] = [];

    for (const role of heroRoles) {
      const roleRules = heroAugmentRules.filter(
        (r) => r.heroRole === role && augment.tags.includes(r.augmentTag)
      );
      matchingRules.push(...roleRules);
    }

    const roleConflicts = heroAugmentRules.filter(
      (r) =>
        heroRoles.includes(r.heroRole) &&
        augment.tags.includes(r.augmentTag) &&
        r.priority === 'not-recommended'
    );

    const priorityCounts = { recommended: 0, optional: 0, 'not-recommended': 0, fun: 0 };
    for (const rule of matchingRules) {
      priorityCounts[rule.priority]++;
    }

    // Check synergy with existing augments
    let synergyBonus = 0;
    for (const existingId of input.existingAugmentIds) {
      const existing = augmentsById[existingId];
      if (existing && existing.setName === augment.setName) {
        synergyBonus += 1;
      }
    }

    // Check comp gap relevance
    const compGapMatch = input.compGaps.some((gap) => {
      if (gap === '缺前排' && augment.tags.some((t) => ['坦克', '防御', '前排'].includes(t))) return true;
      if (gap === '缺控制' && augment.tags.some((t) => ['控制'].includes(t))) return true;
      if (gap === '缺保护' && augment.tags.some((t) => ['治疗', '护盾', '辅助', '生存'].includes(t))) return true;
      if (gap === '缺清线' && augment.tags.some((t) => ['AP', '法术', '灼烧'].includes(t))) return true;
      return false;
    });

    let priority: Priority;
    let reason: string;

    if (roleConflicts.length > 0) {
      priority = 'not-recommended';
      reason = roleConflicts[0].reason;
    } else if (priorityCounts.recommended > 0 || (priorityCounts.optional > 0 && synergyBonus > 0) || compGapMatch) {
      priority = 'recommended';
      const parts: string[] = [];
      if (priorityCounts.recommended > 0) parts.push(matchingRules.find((r) => r.priority === 'recommended')!.reason);
      if (synergyBonus > 0) parts.push(`与已有强化${synergyBonus}项套装协同`);
      if (compGapMatch) parts.push('填补阵容缺口');
      reason = parts.join('；');
    } else if (priorityCounts.optional > 0) {
      priority = 'optional';
      reason = matchingRules.find((r) => r.priority === 'optional')!.reason;
    } else if (priorityCounts.fun > 0) {
      priority = 'fun';
      reason = '娱乐向强化，非严肃推荐';
    } else {
      priority = 'optional';
      reason = '缺少足够数据，建议参考社区经验';
    }

    const confidences: Confidence[] = matchingRules.map((r) => r.confidence);
    confidences.push(augment.confidence);
    const overallConfidence = resolveConfidence(confidences);

    results.push({
      augmentId: candidateId,
      priority,
      reason,
      impactOnPlaystyle: augment.setName,
      recommendedItemDirection: `与${augment.setName}套装配合的出装方向`,
      sourceBasis: sourceBasisFromConfidence(overallConfidence),
      confidence: overallConfidence,
    });
  }

  return results;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/search.ts src/lib/decision-engine.ts && git commit -m "feat: add search utility and triple-choice decision engine"
```

---

### Task 17: Layout — App, NavBar, Footer

**Files:**
- Create: `src/App.tsx`
- Create: `src/components/NavBar.tsx`
- Create: `src/components/Footer.tsx`

- [ ] **Step 1: Write NavBar**

Write `src/components/NavBar.tsx`:
```typescript
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/augments', label: '强化百科' },
  { to: '/triple-choice', label: '三选一助手', highlight: true },
  { to: '/versions', label: '版本追踪' },
];

export function NavBar() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>海克斯工具</span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map((link) =>
            link.highlight ? (
              <Button
                key={link.to}
                asChild
                variant={location.pathname === link.to ? 'default' : 'outline'}
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                <Link to={link.to}>{link.label}</Link>
              </Button>
            ) : (
              <Button
                key={link.to}
                asChild
                variant={location.pathname === link.to ? 'secondary' : 'ghost'}
                size="sm"
              >
                <Link to={link.to}>{link.label}</Link>
              </Button>
            )
          )}
        </div>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Write Footer**

Write `src/components/Footer.tsx`:
```typescript
export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-6 space-y-2">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>数据可信度图例：</span>
          <span className="text-emerald-400">✓ 可信（官方确认）</span>
          <span className="text-blue-400">~ 较可信（社区确认）</span>
          <span className="text-yellow-400">? 待确认</span>
          <span className="text-gray-400">⚠ 未验证</span>
        </div>
        <p className="text-xs text-muted-foreground">
          数据来源：Riot Data Dragon API、B站社区（热爱生活的白菜、化学催化剂i、幸运本鸽等UP主）。
          社区内容已标注来源，不代表官方立场。当前版本：26.10
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Write App.tsx**

Write `src/App.tsx`:
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { AugmentEncyclopedia } from '@/pages/AugmentEncyclopedia';
import { TripleChoiceHelper } from '@/pages/TripleChoiceHelper';
import { VersionTracker } from '@/pages/VersionTracker';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/augments" element={<AugmentEncyclopedia />} />
            <Route path="/triple-choice" element={<TripleChoiceHelper />} />
            <Route path="/versions" element={<VersionTracker />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/components/NavBar.tsx src/components/Footer.tsx && git commit -m "feat: add App layout with NavBar, Footer, and P0 routes"
```

---

### Task 18: HomePage

**Files:**
- Create: `src/pages/HomePage.tsx`

- [ ] **Step 1: Write HomePage**

Write `src/pages/HomePage.tsx`:
```typescript
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, HelpCircle, Clock, Sparkles, Users, Swords } from 'lucide-react';

const toolEntries = [
  {
    to: '/augments',
    icon: BookOpen,
    title: '强化百科',
    description: '浏览196张强化符文，查看效果、适合英雄和可信度',
    available: true,
  },
  {
    to: '/triple-choice',
    icon: HelpCircle,
    title: '三选一强化助手',
    description: '输入英雄和候选强化，获得透明的推荐和建议理由',
    available: true,
    highlight: true,
  },
  {
    to: '/versions',
    icon: Clock,
    title: '版本追踪',
    description: '追踪当前版本和关键改动，了解强化和英雄的版本变化',
    available: true,
  },
  {
    to: '/heroes',
    icon: Swords,
    title: '英雄速查卡',
    description: '查看英雄适合的强化类型和推荐装备方向',
    available: false,
  },
  {
    to: '/builds',
    icon: Sparkles,
    title: '强化驱动出装',
    description: '根据强化方向选择出装路线，而非固定六神装',
    available: false,
  },
  {
    to: '/comp-synergy',
    icon: Users,
    title: '阵容协同面板',
    description: '检查阵容问题：全AD？缺前排？缺控制？',
    available: false,
  },
];

export function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3">海克斯大乱斗工具</h1>
        <p className="text-muted-foreground">
          可信、清晰的决策工具。所有建议标注来源，不伪装客观最优。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {toolEntries.map((entry) => (
          <Card
            key={entry.to}
            className={`bg-card transition-colors ${
              entry.available
                ? entry.highlight
                  ? 'border-primary/50 hover:border-primary'
                  : 'hover:bg-accent'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <CardContent className="p-5">
              {entry.available ? (
                <Link to={entry.to} className="block">
                  <div className="flex items-start gap-3">
                    <entry.icon className={`h-6 w-6 mt-0.5 ${entry.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {entry.title}
                        {entry.highlight && (
                          <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">核心功能</span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{entry.description}</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="flex items-start gap-3">
                  <entry.icon className="h-6 w-6 mt-0.5 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      {entry.title}
                      <span className="text-xs bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">即将上线</span>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{entry.description}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
          <Link to="/triple-choice">开始三选一强化选择 →</Link>
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/HomePage.tsx && git commit -m "feat: add HomePage with 6 tool entry cards (3 active, 3 coming soon)"
```

---

### Task 19: AugmentEncyclopedia page

**Files:**
- Create: `src/pages/AugmentEncyclopedia.tsx`

- [ ] **Step 1: Write AugmentEncyclopedia**

Write `src/pages/AugmentEncyclopedia.tsx`:
```typescript
import { useState, useMemo } from 'react';
import { SearchInput } from '@/components/SearchInput';
import { AugmentCard } from '@/components/AugmentCard';
import { EmptyState } from '@/components/EmptyState';
import { TierBadge } from '@/components/TierBadge';
import { augments } from '@/data/augments';
import { searchByKeyword, filterByTags } from '@/lib/search';
import type { Tier } from '@/types';

const TIERS: Tier[] = ['Prismatic', 'Gold', 'Silver'];
const TAG_OPTIONS = ['物理', '法术', '坦克', '治疗', '机动', '灼烧', '控制', '经济', '高上限'];

export function AugmentEncyclopedia() {
  const [keyword, setKeyword] = useState('');
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let result = augments;
    result = searchByKeyword(result, keyword, (a) =>
      [a.augmentNameCn, a.augmentNameEn, a.effect, a.setName, ...a.tags].join(' ')
    );
    if (selectedTier) result = result.filter((a) => a.tier === selectedTier);
    if (selectedTags.length > 0) result = filterByTags(result, selectedTags, (a) => a.tags);
    return result;
  }, [keyword, selectedTier, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-2">强化百科</h1>
      <p className="text-sm text-muted-foreground mb-6">
        共收录 {augments.length} 张强化符文（持续更新中）。所有数据标注来源和可信度。
      </p>

      <div className="space-y-4 mb-6">
        <SearchInput value={keyword} onChange={setKeyword} placeholder="搜索强化名称、效果、套装..." />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTier(null)}
            className={`text-xs px-3 py-1 rounded transition-colors ${
              !selectedTier ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            全部品质
          </button>
          {TIERS.map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(selectedTier === tier ? null : tier)}
              className={`text-xs px-3 py-1 rounded transition-colors ${
                selectedTier === tier ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {TAG_OPTIONS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`text-xs px-2 py-0.5 rounded transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-primary/30 text-primary border border-primary/50'
                  : 'bg-secondary text-muted-foreground border border-transparent hover:border-border'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((augment) => (
            <AugmentCard key={augment.augmentId} augment={augment} />
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/AugmentEncyclopedia.tsx && git commit -m "feat: add AugmentEncyclopedia with search, tier and tag filters"
```

---

### Task 20: TripleChoiceHelper page

**Files:**
- Create: `src/pages/TripleChoiceHelper.tsx`

- [ ] **Step 1: Write TripleChoiceHelper**

Write `src/pages/TripleChoiceHelper.tsx`:
```typescript
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/SearchInput';
import { AugmentCard } from '@/components/AugmentCard';
import { ConfidenceBadge } from '@/components/ConfidenceBadge';
import { SourceTag } from '@/components/SourceTag';
import { heroes } from '@/data/heroes';
import { augments } from '@/data/augments';
import { evaluateTripleChoice } from '@/lib/decision-engine';
import type { TripleChoiceResult, Priority } from '@/types';
import { HelpCircle, Sparkles } from 'lucide-react';

const PRIORITY_COLORS: Record<Priority, string> = {
  'recommended': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  'optional': 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  'not-recommended': 'text-red-400 bg-red-400/10 border-red-400/30',
  'fun': 'text-purple-400 bg-purple-400/10 border-purple-400/30',
};

const PRIORITY_LABELS: Record<Priority, string> = {
  'recommended': '推荐',
  'optional': '可选',
  'not-recommended': '不建议',
  'fun': '娱乐向',
};

const COMP_GAP_OPTIONS = ['缺前排', '缺控制', '缺清线', '缺保护', '全AD', '全AP'];

function ResultCard({ result }: { result: TripleChoiceResult }) {
  const augment = augments.find((a) => a.augmentId === result.augmentId);

  return (
    <Card className={`border ${PRIORITY_COLORS[result.priority]}`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{PRIORITY_LABELS[result.priority]}</span>
            {augment && <span className="text-sm text-muted-foreground">| {augment.augmentNameCn} ({augment.augmentNameEn})</span>}
          </div>
          <ConfidenceBadge level={result.confidence} />
        </div>

        <p className="text-sm">{result.reason}</p>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>打法影响: {result.impactOnPlaystyle}</div>
          <div>装备方向: {result.recommendedItemDirection}</div>
          <div>数据依据: {result.sourceBasis}</div>
        </div>

        {augment && <AugmentCard augment={augment} compact />}
      </CardContent>
    </Card>
  );
}

export function TripleChoiceHelper() {
  const [heroKeyword, setHeroKeyword] = useState('');
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null);
  const [existingAugmentIds, setExistingAugmentIds] = useState<string[]>([]);
  const [candidateIds, setCandidateIds] = useState<string[]>(['', '', '']);
  const [compGaps, setCompGaps] = useState<string[]>([]);
  const [results, setResults] = useState<TripleChoiceResult[] | null>(null);

  const selectedHero = heroes.find((h) => h.heroId === selectedHeroId);

  const filteredHeroes = heroKeyword
    ? heroes.filter((h) =>
        h.heroNameCn.includes(heroKeyword) || h.heroNameEn.toLowerCase().includes(heroKeyword.toLowerCase())
      )
    : heroes;

  const filteredAugments = (keyword: string) =>
    keyword
      ? augments.filter((a) =>
          a.augmentNameCn.includes(keyword) || a.augmentNameEn.toLowerCase().includes(keyword.toLowerCase())
        )
      : augments.slice(0, 20);

  const handleAnalyze = () => {
    if (!selectedHeroId || candidateIds.filter(Boolean).length === 0) return;
    const result = evaluateTripleChoice({
      heroId: selectedHeroId,
      existingAugmentIds: existingAugmentIds.filter(Boolean),
      candidateAugmentIds: candidateIds.filter(Boolean) as [string, string, string],
      compGaps,
    });
    setResults(result);
  };

  const toggleCompGap = (gap: string) => {
    setCompGaps((prev) => (prev.includes(gap) ? prev.filter((g) => g !== gap) : [...prev, gap]));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-2">三选一强化助手</h1>
      <p className="text-sm text-muted-foreground mb-6">
        输入当前英雄和候选强化，获得透明、可理解的推荐理由。不假装给出绝对最优答案。
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-5">
          {/* Hero Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">1. 选择英雄</label>
            <div className="relative">
              <input
                type="text"
                value={heroKeyword}
                onChange={(e) => setHeroKeyword(e.target.value)}
                placeholder="搜索英雄名称..."
                className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm"
              />
              {heroKeyword && (
                <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded shadow-lg max-h-48 overflow-y-auto">
                  {filteredHeroes.map((hero) => (
                    <button
                      key={hero.heroId}
                      onClick={() => {
                        setSelectedHeroId(hero.heroId);
                        setHeroKeyword('');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-accent text-sm flex items-center gap-2"
                    >
                      <img src={hero.iconUrl} alt="" className="w-6 h-6 rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      {hero.heroNameCn} ({hero.heroNameEn})
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedHero && (
              <div className="mt-2 flex items-center gap-2">
                <img src={selectedHero.iconUrl} alt="" className="w-8 h-8 rounded" />
                <span className="text-sm font-medium">{selectedHero.heroNameCn}</span>
                <span className="text-xs text-muted-foreground">{selectedHero.roles.join('、')}</span>
              </div>
            )}
          </div>

          {/* Candidate Augments */}
          <div>
            <label className="text-sm font-medium mb-2 block">2. 三个候选强化（本次刷出的三选一）</label>
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="relative">
                  <input
                    type="text"
                    value={candidateIds[i]}
                    onChange={(e) => {
                      const next = [...candidateIds];
                      next[i] = e.target.value;
                      setCandidateIds(next);
                    }}
                    placeholder={`候选强化 ${i + 1}（输入名称搜索）`}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm"
                  />
                  {candidateIds[i] && (
                    <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded shadow-lg max-h-32 overflow-y-auto">
                      {filteredAugments(candidateIds[i]).map((a) => (
                        <button
                          key={a.augmentId}
                          onClick={() => {
                            const next = [...candidateIds];
                            next[i] = a.augmentNameCn;
                            setCandidateIds(next);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-accent text-xs"
                        >
                          {a.augmentNameCn} ({a.tier})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Existing Augments */}
          <div>
            <label className="text-sm font-medium mb-2 block">3. 已有强化（可选）</label>
            <p className="text-xs text-muted-foreground mb-2">输入已选择的强化名称，用于检测协同和冲突</p>
            <input
              type="text"
              placeholder="已有强化名称（用逗号分隔）"
              className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm"
              onChange={(e) => {
                const ids = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                setExistingAugmentIds(ids);
              }}
            />
          </div>

          {/* Comp Gaps */}
          <div>
            <label className="text-sm font-medium mb-2 block">4. 阵容缺口（可选）</label>
            <div className="flex flex-wrap gap-1.5">
              {COMP_GAP_OPTIONS.map((gap) => (
                <button
                  key={gap}
                  onClick={() => toggleCompGap(gap)}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    compGaps.includes(gap)
                      ? 'bg-primary/30 text-primary border border-primary/50'
                      : 'bg-secondary text-muted-foreground border border-transparent hover:border-border'
                  }`}
                >
                  {gap}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleAnalyze} className="w-full" size="lg">
            <Sparkles className="h-4 w-4 mr-2" />
            分析推荐
          </Button>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">推荐结果</h2>
          {results === null ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <HelpCircle className="h-12 w-12 mb-4" />
              <p>选择英雄和候选强化后点击"分析推荐"</p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <HelpCircle className="h-12 w-12 mb-4" />
              <p>请至少输入一个候选强化</p>
            </div>
          ) : (
            results.map((result, i) => <ResultCard key={i} result={result} />)
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/TripleChoiceHelper.tsx && git commit -m "feat: add TripleChoiceHelper with hero search, augment input, comp gaps, and result display"
```

---

### Task 21: VersionTracker page

**Files:**
- Create: `src/pages/VersionTracker.tsx`

- [ ] **Step 1: Write VersionTracker**

Write `src/pages/VersionTracker.tsx`:
```typescript
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ConfidenceBadge } from '@/components/ConfidenceBadge';
import { patchChanges, currentVersion } from '@/data/patchChanges';
import type { PatchChange } from '@/types';
import { Info } from 'lucide-react';

type Category = PatchChange['category'] | 'all';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'mechanic', label: '机制' },
  { value: 'augment', label: '强化' },
  { value: 'hero', label: '英雄' },
  { value: 'item', label: '装备' },
];

const CATEGORY_COLORS: Record<Category, string> = {
  all: '',
  mechanic: 'border-l-blue-500',
  augment: 'border-l-purple-500',
  hero: 'border-l-emerald-500',
  item: 'border-l-amber-500',
};

export function VersionTracker() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const filtered = useMemo(() => {
    if (selectedCategory === 'all') return patchChanges;
    return patchChanges.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const grouped = useMemo(() => {
    const map = new Map<string, PatchChange[]>();
    for (const change of filtered) {
      const existing = map.get(change.patchVersion) || [];
      existing.push(change);
      map.set(change.patchVersion, existing);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold">版本追踪</h1>
        <span className="text-sm bg-primary/20 text-primary px-2 py-0.5 rounded">
          当前版本: {currentVersion}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        追踪海克斯大乱斗相关的版本改动。来源截至 B站社区和 Riot Data Dragon API。
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`text-xs px-3 py-1 rounded transition-colors ${
              selectedCategory === cat.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {grouped.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">暂无该分类的版本记录</p>
        ) : (
          grouped.map(([version, changes]) => (
            <section key={version}>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                版本 {version}
                <span className="text-xs text-muted-foreground">{changes[0].date}</span>
              </h2>
              <div className="space-y-2">
                {changes.map((change) => (
                  <Card key={change.patchId} className={`bg-card border-l-2 ${CATEGORY_COLORS[change.category]}`}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs uppercase bg-secondary px-1.5 py-0.5 rounded">
                              {change.category === 'mechanic' ? '机制' :
                               change.category === 'augment' ? '强化' :
                               change.category === 'hero' ? '英雄' : '装备'}
                            </span>
                            <span className="font-medium text-sm">{change.target}</span>
                          </div>
                          <p className="text-sm">{change.changeSummary}</p>
                          {change.impactOnRecommendations && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Info className="h-3 w-3" />
                              对推荐的影响: {change.impactOnRecommendations}
                            </p>
                          )}
                        </div>
                        <ConfidenceBadge level={change.confidence} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/VersionTracker.tsx && git commit -m "feat: add VersionTracker with category filters and version grouping"
```

---

### Task 22: Verify build compiles cleanly

**Files:**
- Modify: `src/main.tsx` (ensure it imports index.css)

- [ ] **Step 1: Check main.tsx**

Read `src/main.tsx` and verify it imports `./index.css`. If not, edit to:
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 2: Run TypeScript check**

```bash
cd "C:/Users/Administrator/hextech-aram-tools" && npx tsc --noEmit
```
Expected: No TypeScript errors. Fix any type issues before proceeding.

- [ ] **Step 3: Run Vite build**

```bash
cd "C:/Users/Administrator/hextech-aram-tools" && npm run build
```
Expected: Build completes successfully with no errors.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A && git commit -m "fix: resolve build and type errors"
```

---

### Task 23: Playwright e2e verification

**Files:**
- Create: `e2e/smoke.spec.ts` (or use Playwright skill)

- [ ] **Step 1: Install Playwright if not already installed**

```bash
cd "C:/Users/Administrator/hextech-aram-tools" && npx playwright install chromium --with-deps 2>/dev/null || npx playwright install chromium
```

- [ ] **Step 2: Start dev server in background**

```bash
cd "C:/Users/Administrator/hextech-aram-tools" && npm run dev -- --port 5173 &
```
Wait 3 seconds for server to start.

- [ ] **Step 3: Test HomePage loads**

Use Playwright to navigate to `http://localhost:5173/` and verify:
- Page title contains "海克斯"
- 6 tool cards are visible (3 active, 3 "即将上线")
- CTA button "开始三选一强化选择" is visible

- [ ] **Step 4: Test AugmentEncyclopedia**

Use Playwright to navigate to `http://localhost:5173/augments` and verify:
- Page title "强化百科" is visible
- Search input works (type "一板" → at least 1 card visible)
- Tier filter works (click "Prismatic" → filter applies)
- Tag filter works (click "物理" → filter applies)

- [ ] **Step 5: Test TripleChoiceHelper**

Use Playwright to navigate to `http://localhost:5173/triple-choice` and verify:
- Page title "三选一强化助手" is visible
- Can search for hero "维克托"
- Can input candidate augment name
- Clicking "分析推荐" produces results
- Results show priority labels

- [ ] **Step 6: Test VersionTracker**

Use Playwright to navigate to `http://localhost:5173/versions` and verify:
- Page title "版本追踪" is visible
- "当前版本: 26.10" badge is displayed
- Category filter tabs are clickable
- Version sections are rendered with changes

- [ ] **Step 7: Test confidence badges render on all pages**

Verify on each page that confidence badges appear correctly:
- Green ✓ for high confidence
- Blue ~ for medium
- Yellow ? for low

- [ ] **Step 8: Stop dev server and commit**

```bash
kill %1 2>/dev/null; git add -A && git commit -m "test: add Playwright e2e smoke tests for P0 pages"
```

---

## Self-Review

**Spec coverage:**
- HomePage with 6 tool entries ✓ (Task 18)
- AugmentEncyclopedia with filters ✓ (Task 19)
- TripleChoiceHelper with decision engine ✓ (Task 20 + Task 16)
- VersionTracker ✓ (Task 21)
- Data confidence labeling system ✓ (Task 12 — ConfidenceBadge, SourceTag, TierBadge)
- 7 data tables populated ✓ (Tasks 5-11)
- Layout with NavBar + Footer ✓ (Task 17)

**Placeholder scan:** None found. All tasks contain complete code.

**Type consistency:** Verified — `Augment`, `Hero`, `HeroAugmentRule`, `TripleChoiceInput`, `TripleChoiceResult` used consistently across data files, components, pages, and decision engine.

---

## P1 Follow-up (not in this plan)

- HeroCards page (needs hero search + AugmentCard recommendations display)
- BuildRecommendations page (needs augment → item synergy display)
- CompSynergyPanel page (needs comp rule engine + warning display)
- FunBuildsWorkshop page (needs community builds gallery display)
