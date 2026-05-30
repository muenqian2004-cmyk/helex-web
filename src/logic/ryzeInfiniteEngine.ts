import coefficients from '../data/ryzeSimulatorCoefficients.json';

export type MultiplierMode = 'multiplicative' | 'additive';
export type StackMode = 'compound' | 'additive';

export interface StatForgeInput {
  hp?: number;
  ap?: number;
  ad?: number;
  mana?: number;
}

export interface RyzeSimulatorInput {
  selectedItemIds?: string[];
  selectedAugmentIds?: string[];
  tankEngineStacks?: number;
  tankEngineMode?: StackMode;
  cappaJuiceBottles?: number;
  cappaJuiceMode?: StackMode;
  demonKingStacks?: number;
  dragonheartStacks?: number;
  allStatsStackMode?: StackMode;
  multiplicative?: boolean;
  bloodmailLowHp?: boolean;
  statForge?: StatForgeInput;
  maxIterations?: number;
}

export interface RyzeStats {
  hp: number;
  mana: number;
  ad: number;
  ap: number;
}

export interface RyzeConversionEffects {
  mana_to_hp: number;
  mana_to_ad: number;
  mana_to_ap: number;
  hp_to_ad: number;
  hp_to_ap: number;
  ad_to_ap: number;
  hp_mult: number;
  ap_mult: number;
  ad_mult: number;
}

export interface RyzeLoopPaths {
  manaToAdToAp: number;
  manaToAp: number;
  manaToHpToAdToAp: number;
  manaToHpToAp: number;
}

export interface RyzeSimulatorResult {
  input: Required<RyzeSimulatorInput>;
  selectedItems: string[];
  selectedAugments: string[];
  flatStats: RyzeStats;
  effects: RyzeConversionEffects;
  multipliers: {
    hp: number;
    ap: number;
    ad: number;
    lowHpAd: number;
  };
  paths: RyzeLoopPaths;
  loopCore: number;
  loopFactor: number;
  thresholdMana: number;
  isOverflow: boolean;
  predictedStats: RyzeStats;
  iterations: number;
  warnings: string[];
}

interface CoefficientRecord {
  itemId?: string;
  augmentId?: string;
  nameCn: string;
  enabled?: boolean;
  disabled?: boolean;
  mutexGroup?: string;
  baseStats?: Partial<Record<'flatHP' | 'flatMana' | 'flatAD' | 'flatAP', number>>;
  effects?: Partial<RyzeConversionEffects>;
}

interface RawCoefficients {
  baseChampionStats: RyzeStats;
  items: CoefficientRecord[];
  augments: CoefficientRecord[];
  statForge: {
    perPoint: {
      hp: { gain: number; enabled: boolean };
      ap: { gain: number; enabled: boolean };
      ad: { gain: number; enabled: boolean };
      mana: { gain: number; enabled: boolean };
    };
  };
}

const data = coefficients as RawCoefficients;

const defaultInput: Required<RyzeSimulatorInput> = {
  selectedItemIds: ['323004', '447111', '3089', '323003', '4633', '323119'],
  selectedAugmentIds: ['adapt', 'mad_scientist', 'baron_hand', 'tank_engine'],
  tankEngineStacks: 35,
  tankEngineMode: 'compound',
  cappaJuiceBottles: 0,
  cappaJuiceMode: 'additive',
  demonKingStacks: 0,
  dragonheartStacks: 0,
  allStatsStackMode: 'additive',
  multiplicative: true,
  bloodmailLowHp: true,
  statForge: {
    hp: 0,
    ap: 0,
    ad: 0,
    mana: 0
  },
  maxIterations: 100
};

const compatibleItemIds: Record<string, string> = {
  '3119': '323119',
  '323121': '323119',
  '228002': '3090'
};

const emptyEffects: RyzeConversionEffects = {
  mana_to_hp: 0,
  mana_to_ad: 0,
  mana_to_ap: 0,
  hp_to_ad: 0,
  hp_to_ap: 0,
  ad_to_ap: 0,
  hp_mult: 0,
  ap_mult: 0,
  ad_mult: 0
};

function withDefaults(input: RyzeSimulatorInput = {}): Required<RyzeSimulatorInput> {
  return {
    ...defaultInput,
    ...input,
    selectedItemIds: input.selectedItemIds ?? defaultInput.selectedItemIds,
    selectedAugmentIds: input.selectedAugmentIds ?? defaultInput.selectedAugmentIds,
    statForge: {
      ...defaultInput.statForge,
      ...input.statForge
    }
  };
}

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/\s+/g, '');
}

function resolveItemKey(key: string) {
  return compatibleItemIds[key] ?? key;
}

function recordMatches(record: CoefficientRecord, key: string) {
  const normalizedKey = normalizeKey(key);
  return (
    normalizeKey(record.itemId ?? '') === normalizedKey ||
    normalizeKey(record.augmentId ?? '') === normalizedKey ||
    normalizeKey(record.nameCn) === normalizedKey
  );
}

function resolveRecords(records: CoefficientRecord[], keys: string[], kind: 'item' | 'augment') {
  const selected = new Map<string, CoefficientRecord>();
  const warnings: string[] = [];

  keys.forEach((rawKey) => {
    const key = kind === 'item' ? resolveItemKey(rawKey) : rawKey;
    const record = records.find((item) => recordMatches(item, key));
    if (!record) {
      warnings.push(`未找到${kind === 'item' ? '装备' : '强化'}：${rawKey}`);
      return;
    }

    if (record.disabled || record.enabled === false) {
      warnings.push(`${record.nameCn} 已禁用，未参与计算。`);
      return;
    }

    const stableKey = record.itemId ?? record.augmentId ?? record.nameCn;
    selected.set(stableKey, record);
  });

  return {
    records: applyMutexRules(Array.from(selected.values())),
    warnings
  };
}

function applyMutexRules(records: CoefficientRecord[]) {
  const grouped = new Map<string, CoefficientRecord[]>();
  const ungrouped: CoefficientRecord[] = [];

  records.forEach((record) => {
    if (!record.mutexGroup) {
      ungrouped.push(record);
      return;
    }

    const group = grouped.get(record.mutexGroup) ?? [];
    group.push(record);
    grouped.set(record.mutexGroup, group);
  });

  grouped.forEach((group) => {
    const strongest = group
      .slice()
      .sort((left, right) => effectValue(right, 'ap_mult') - effectValue(left, 'ap_mult'))[0];
    ungrouped.push(strongest);
  });

  return ungrouped;
}

function effectValue(record: CoefficientRecord, key: keyof RyzeConversionEffects) {
  return record.effects?.[key] ?? 0;
}

function addFlatStats(target: RyzeStats, record: CoefficientRecord) {
  const stats = record.baseStats ?? {};
  target.hp += stats.flatHP ?? 0;
  target.mana += stats.flatMana ?? 0;
  target.ad += stats.flatAD ?? 0;
  target.ap += stats.flatAP ?? 0;
}

function addEffects(target: RyzeConversionEffects, record: CoefficientRecord) {
  const effects = record.effects ?? {};
  Object.keys(emptyEffects).forEach((key) => {
    const effectKey = key as keyof RyzeConversionEffects;
    target[effectKey] += effects[effectKey] ?? 0;
  });
}

function stackMultiplier(perStack: number, stacks: number, mode: StackMode) {
  const safeStacks = Math.max(0, stacks);
  if (safeStacks === 0) {
    return 1;
  }

  return mode === 'compound' ? Math.pow(1 + perStack, safeStacks) : 1 + perStack * safeStacks;
}

function aggregateMultiplier(sources: number[], multiplicative: boolean) {
  if (sources.length === 0) {
    return 1;
  }

  if (multiplicative) {
    return sources.reduce((total, source) => total * source, 1);
  }

  return 1 + sources.reduce((total, source) => total + (source - 1), 0);
}

function finiteStat(value: number) {
  return Number.isFinite(value) ? value : Number.POSITIVE_INFINITY;
}

export function simulateRyzeInfiniteEngine(input: RyzeSimulatorInput = {}): RyzeSimulatorResult {
  const resolvedInput = withDefaults(input);
  const selectedItems = resolveRecords(data.items, resolvedInput.selectedItemIds, 'item');
  const selectedAugments = resolveRecords(data.augments, resolvedInput.selectedAugmentIds, 'augment');
  const records = [...selectedItems.records, ...selectedAugments.records];

  const flatStats: RyzeStats = { ...data.baseChampionStats };
  const effects: RyzeConversionEffects = { ...emptyEffects };
  const hpMultiplierSources: number[] = [];
  const apMultiplierSources: number[] = [];
  const adMultiplierSources: number[] = [];
  const warnings = [...selectedItems.warnings, ...selectedAugments.warnings];

  records.forEach((record) => {
    addFlatStats(flatStats, record);
    addEffects(effects, record);

    const hpMult = effectValue(record, 'hp_mult');
    const apMult = effectValue(record, 'ap_mult');
    const adMult = effectValue(record, 'ad_mult');
    if (hpMult) hpMultiplierSources.push(1 + hpMult);
    if (apMult) apMultiplierSources.push(1 + apMult);
    if (adMult) adMultiplierSources.push(1 + adMult);
  });

  if (selectedAugments.records.some((record) => record.augmentId === 'tank_engine')) {
    hpMultiplierSources.push(
      stackMultiplier(0.05, resolvedInput.tankEngineStacks, resolvedInput.tankEngineMode)
    );
  }

  hpMultiplierSources.push(
    stackMultiplier(0.15, resolvedInput.cappaJuiceBottles, resolvedInput.cappaJuiceMode)
  );

  const demonKingMultiplier = stackMultiplier(
    0.01,
    resolvedInput.demonKingStacks,
    resolvedInput.allStatsStackMode
  );
  const dragonheartMultiplier = stackMultiplier(
    0.04,
    Math.min(7, resolvedInput.dragonheartStacks),
    resolvedInput.allStatsStackMode
  );
  hpMultiplierSources.push(demonKingMultiplier, dragonheartMultiplier);
  apMultiplierSources.push(demonKingMultiplier, dragonheartMultiplier);
  adMultiplierSources.push(demonKingMultiplier, dragonheartMultiplier);

  const forge = resolvedInput.statForge;
  const forgeConfig = data.statForge.perPoint;
  if (forgeConfig.hp.enabled) flatStats.hp += (forge.hp ?? 0) * forgeConfig.hp.gain;
  if (forgeConfig.ap.enabled) flatStats.ap += (forge.ap ?? 0) * forgeConfig.ap.gain;
  if (forgeConfig.ad.enabled) flatStats.ad += (forge.ad ?? 0) * forgeConfig.ad.gain;
  if (forgeConfig.mana.enabled) flatStats.mana += (forge.mana ?? 0) * forgeConfig.mana.gain;

  const hpMultiplier = aggregateMultiplier(hpMultiplierSources, resolvedInput.multiplicative);
  const apMultiplier = aggregateMultiplier(apMultiplierSources, resolvedInput.multiplicative);
  const adMultiplier = aggregateMultiplier(adMultiplierSources, resolvedInput.multiplicative);
  const hasBloodmail = selectedItems.records.some((record) => record.nameCn === '霸王血铠');
  const lowHpAdMultiplier = hasBloodmail && resolvedInput.bloodmailLowHp ? 1.12 : 1;

  const paths: RyzeLoopPaths = {
    manaToAdToAp: effects.mana_to_ad * adMultiplier * effects.ad_to_ap,
    manaToAp: effects.mana_to_ap,
    manaToHpToAdToAp:
      effects.mana_to_hp *
      hpMultiplier *
      effects.hp_to_ad *
      lowHpAdMultiplier *
      adMultiplier *
      effects.ad_to_ap,
    manaToHpToAp: effects.mana_to_hp * hpMultiplier * effects.hp_to_ap
  };
  const loopCore =
    paths.manaToAdToAp + paths.manaToAp + paths.manaToHpToAdToAp + paths.manaToHpToAp;
  const loopFactor = flatStats.mana * 0.001 * loopCore * apMultiplier;
  const thresholdMana = loopCore * apMultiplier > 0 ? 1000 / (loopCore * apMultiplier) : Infinity;
  const isOverflow = loopFactor >= 1;
  const predictedStats = isOverflow
    ? {
        hp: Infinity,
        mana: Infinity,
        ad: Infinity,
        ap: Infinity
      }
    : iterateConvergedStats({
        flatStats,
        effects,
        hpMultiplier,
        apMultiplier,
        adMultiplier,
        lowHpAdMultiplier,
        adaptEnabled: effects.ad_to_ap > 0,
        maxIterations: resolvedInput.maxIterations
      });

  return {
    input: resolvedInput,
    selectedItems: selectedItems.records.map((record) => record.nameCn),
    selectedAugments: selectedAugments.records.map((record) => record.nameCn),
    flatStats,
    effects,
    multipliers: {
      hp: hpMultiplier,
      ap: apMultiplier,
      ad: adMultiplier,
      lowHpAd: lowHpAdMultiplier
    },
    paths,
    loopCore,
    loopFactor,
    thresholdMana,
    isOverflow,
    predictedStats,
    iterations: isOverflow ? 0 : resolvedInput.maxIterations,
    warnings
  };
}

function iterateConvergedStats({
  flatStats,
  effects,
  hpMultiplier,
  apMultiplier,
  adMultiplier,
  lowHpAdMultiplier,
  adaptEnabled,
  maxIterations
}: {
  flatStats: RyzeStats;
  effects: RyzeConversionEffects;
  hpMultiplier: number;
  apMultiplier: number;
  adMultiplier: number;
  lowHpAdMultiplier: number;
  adaptEnabled: boolean;
  maxIterations: number;
}): RyzeStats {
  const baseAd = data.baseChampionStats.ad;
  const stats = {
    hp: flatStats.hp,
    mana: flatStats.mana,
    ad: flatStats.ad,
    ap: flatStats.ap
  };

  for (let index = 0; index < maxIterations; index += 1) {
    const hpFromMana = stats.mana * effects.mana_to_hp * hpMultiplier;
    stats.hp = flatStats.hp + hpFromMana;

    const adFromMana = stats.mana * effects.mana_to_ad;
    const adFromHp = stats.hp * effects.hp_to_ad;
    const convertedAd = ((flatStats.ad + adFromHp) * lowHpAdMultiplier + adFromMana) * adMultiplier;
    const bonusAd = convertedAd - baseAd;
    const apFromAd = adaptEnabled ? bonusAd * effects.ad_to_ap : 0;
    stats.ad = adaptEnabled ? baseAd : convertedAd;

    const apFromMana = stats.mana * effects.mana_to_ap;
    const apFromHp = stats.hp * effects.hp_to_ap;
    stats.ap = (flatStats.ap + apFromMana + apFromHp + apFromAd) * apMultiplier;
    stats.mana = flatStats.mana * (1 + 0.001 * stats.ap);
  }

  return {
    hp: finiteStat(stats.hp),
    mana: finiteStat(stats.mana),
    ad: finiteStat(stats.ad),
    ap: finiteStat(stats.ap)
  };
}

export function formatRyzeNumber(value: number) {
  if (value === Infinity) return '∞';
  if (value > 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  return Math.round(value).toLocaleString('zh-CN');
}

export { coefficients as ryzeSimulatorCoefficients };
