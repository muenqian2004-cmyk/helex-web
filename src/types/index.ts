export type Confidence = 'high' | 'medium' | 'low' | 'unverified';
export type SourceType = 'official' | 'community' | 'inferred';
export type Status = 'active' | 'unknown' | 'unverified';
export type Tier = 'Silver' | 'Gold' | 'Prismatic';
export type Priority = 'recommended' | 'optional' | 'not-recommended' | 'fun';

export interface Hero {
  heroId: string;
  heroNameCn: string;
  heroTitleCn: string;
  displayNameCn: string;
  aliases: string[];
  roles: string[];
  primaryRoleCn: string;
  tierCn: string;
  tierCode: string;
  iconUrl: string;
  sourceUrl: string;
  confidence: Confidence;
  status: Status;
}

export interface Augment {
  augmentId: string;
  augmentNameCn: string;
  tier: Tier;
  effect: string;
  iconUrl: string;
  winRate: number;
  availabilityStages: number[];
  sourceType: SourceType;
  sourceUrl: string;
  confidence: Confidence;
  status: Status;
  notes: string;
}

export interface HeroBuild {
  heroId: string;
  recommendedAugments: HeroAugmentRef[];
  startingItems: ItemGroup[];
  boots: BootItem[];
  coreBuilds: ItemGroup[];
  lateGameBuilds: ItemGroup[];
}

export interface HeroAugmentRef {
  augmentId: string;
  augmentNameCn: string;
  rarityCn?: string;
  tierCn?: string;
  recommendationOrder?: number;
  recommendationGroupCn?: string;
  matchConfidence?: string;
  confidence?: string;
  displayOrder?: number;
  sourceUrl?: string;
  notes?: string;
  recommendationTypeCn?: string;
  comboHeroTierCn?: string;
  reasonHeroCn?: string;
}

export interface ItemGroup {
  buildOrder: number;
  winRate: number | null;
  items: BuildItem[];
}

export interface BuildItem {
  itemNameCn: string;
  itemIconUrl: string;
  notes: string;
}

export interface SkillPlan {
  planOrder: number;
  skillPriority: string[];
  skillPriorityCn: string;
  levelUpOrder: string[];
  sourceTextCn: string;
  confidence: string;
  notes: string;
  sourceUrl: string;
}

export interface HeroDetail {
  heroId: string;
  prismaticAugments: HeroAugmentRef[];
  goldAugments: HeroAugmentRef[];
  silverAugments: HeroAugmentRef[];
  skillPlans: SkillPlan[];
}

export interface AugmentSuitableHero {
  heroId: string;
  heroNameCn: string;
  heroTitleCn: string;
  displayNameCn: string;
  recommendationTypeCn: string;
  comboTierCn: string;
  reasonCn: string;
  sourceSectionsCn: string[];
  confidence: string;
}

export interface GameItem {
  itemId: string;
  nameCn: string;
  categoryCn: string;
  price: number;
  iconUrl: string;
  descriptionCn: string;
  plainTextCn: string;
  tags: string[];
  buildFrom: string[];
  buildInto: string[];
  isAramModified: boolean;
  aramChangeCn: string;
}

export interface BootItem {
  itemOrder: number;
  itemNameCn: string;
  itemIconUrl: string;
  winRate: number | null;
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

export interface InvincibleCombo {
  comboId: string;
  heroId: string;
  heroNameCn: string;
  heroAliasesUsed: string[];
  heroTypeTags: string[];
  comboNameCn: string;
  powerLevelCn: string;
  powerSpikeCn: string;
  requiredAugments: ComboAugment[];
  optionalAugments: ComboAugment[];
  recommendedItemsCn: string[];
  skillOrPlaystyleCn: string;
  whyBeforeComboNotBrokenCn: string;
  whyComboIsBrokenCn: string;
  counterplayOrWeaknessCn: string;
  confidence: string;
}

export interface ComboAugment {
  augmentId: string;
  nameCn: string;
  rarityCn: string;
  roleInComboCn?: string;
  reasonCn?: string;
}

export interface ComboAugmentRef {
  augmentId: string;
  nameCn: string;
  rarityCn: string;
  roleInComboCn?: string;
}

export interface SynergyCombo {
  comboId: string;
  scopeType: string;
  heroIds: string[];
  heroNamesCn: string[];
  heroTypeTags: string[];
  comboNameCn: string;
  comboTypeCn: string;
  requiredAugments: ComboAugmentRef[];
  optionalAugments: ComboAugmentRef[];
  recommendedItemsCn: string[];
  playstyleCn: string;
  whyBeforeComboNotFormedCn: string;
  comboReasonCn: string;
  weaknessCn: string;
  evidence: { platform: string; sourceTitle: string; sourceUrl: string; matchedText: string }[];
  confidence: string;
  needsManualReview: boolean;
}

export interface TripleChoiceResult {
  augmentId: string;
  priority: Priority;
  reason: string;
  impactOnPlaystyle: string;
  recommendedItemDirection: string;
  sourceBasis: '官方机制' | '社区经验' | '机制推断';
  confidence: Confidence;
  synergyCombo?: SynergyCombo;
}
