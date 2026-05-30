import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { augments } from '@/data/augments';
import { gameItems } from '@/data/gameItems';
import { simulateRyzeInfiniteEngine, formatRyzeNumber } from '@/logic/ryzeInfiniteEngine';
import type { StackMode } from '@/logic/ryzeInfiniteEngine';
import coeff from '@/data/ryzeSimulatorCoefficients.json';
import { Zap, Shield, Swords, Flame, Minus, Plus, AlertTriangle } from 'lucide-react';

// ─── coefficient-derived configs ───
const SIM_AUGMENTS = coeff.augments;
const SIM_ITEMS = coeff.items;
const PRIORITY_ITEMS = ['323004', '323003', '323119', '447111', '4633', '3089', '3090', '6657'];

function findAugCoeff(id: string) { return SIM_AUGMENTS.find(a => a.augmentId === id); }
function findItemCoeff(id: string) { return SIM_ITEMS.find(i => i.itemId === id); }

// ID mappings: coefficients → augments/gameItems
const AUG_ID_MAP: Record<string, string> = { 'baron_hand': 'hand_of_baron' };
const ITEM_ID_MAP: Record<string, string> = { '3090': '228002' };

function resolveAugId(id: string) { return AUG_ID_MAP[id] || id; }
function resolveItemId(id: string) { return ITEM_ID_MAP[id] || id; }

// ─── sub-components ───

function AugmentCard_({ id, selected, onToggle }: { id: string; selected: boolean; onToggle: () => void }) {
  const c = findAugCoeff(id);
  const aug = augments.find(a => a.augmentId === resolveAugId(id));
  const disabled = !c || c.disabled || c.enabled === false;
  return (
    <button
      onClick={() => !disabled && onToggle()}
      disabled={disabled}
      className={`text-left p-3 rounded-lg border transition-all ${
        disabled ? 'border-border/30 opacity-40 cursor-not-allowed' :
        selected ? 'border-primary/60 bg-primary/5' : 'border-border bg-card hover:border-primary/30'
      }`}
    >
      <div className="flex items-start gap-2.5">
        {aug?.iconUrl ? (
          <img src={aug.iconUrl} alt={c?.nameCn} className="w-8 h-8 rounded shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        ) : (
          <div className="w-8 h-8 rounded bg-secondary shrink-0 flex items-center justify-center text-[10px] text-muted-foreground">{c?.nameCn?.[0]}</div>
        )}
        <div className="min-w-0">
          <div className="text-sm font-medium">{c?.nameCn || id}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
            {disabled ? '已损坏' : (c?.roleInLoop || '').slice(0, 60)}
          </div>
        </div>
      </div>
    </button>
  );
}

function ItemCard_({ id, selected, onToggle, bloodmail, onBloodmail }: {
  id: string; selected: boolean; onToggle: () => void; bloodmail?: boolean; onBloodmail?: (v: boolean) => void;
}) {
  const c = findItemCoeff(id);
  const item = gameItems.find(i => i.itemId === resolveItemId(id));
  return (
    <button
      onClick={onToggle}
      className={`text-left p-3 rounded-lg border transition-all ${
        selected ? 'border-primary/60 bg-primary/5' : 'border-border bg-card hover:border-primary/30'
      }`}
    >
      <div className="flex items-start gap-2.5">
        {item?.iconUrl ? (
          <img src={item.iconUrl} alt={c?.nameCn} className="w-8 h-8 shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        ) : (
          <div className="w-8 h-8 rounded bg-secondary shrink-0 flex items-center justify-center text-[10px] text-muted-foreground">{c?.nameCn?.[0]}</div>
        )}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium">{c?.nameCn || id}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            {c?.baseStats ? `HP:${c.baseStats.flatHP || 0} AP:${c.baseStats.flatAP || 0} Mana:${c.baseStats.flatMana || 0} AD:${c.baseStats.flatAD || 0}` : '装备'}
          </div>
          <span className="text-[9px] bg-primary/10 text-primary px-1 rounded mt-0.5 inline-block">STATS</span>
        </div>
      </div>
      {id === '447111' && onBloodmail && (
        <div className="mt-2 pt-2 border-t border-border flex items-center justify-between" onClick={e => e.stopPropagation()}>
          <span className="text-[10px] text-muted-foreground">低生命值（扳机）</span>
          <div
            role="switch" aria-checked={bloodmail}
            onClick={() => onBloodmail(!bloodmail)}
            className={`w-8 h-4 rounded-full transition-colors cursor-pointer ${bloodmail ? 'bg-red-500' : 'bg-secondary border border-border'}`}
          >
            <span className={`block w-3 h-3 rounded-full bg-white transition-transform ${bloodmail ? 'translate-x-[18px]' : 'translate-x-[2px]'}`} />
          </div>
        </div>
      )}
    </button>
  );
}

// ─── main page ───

export function SimulatorPage() {
  // State
  const [itemIds, setItemIds] = useState<string[]>(['323004', '447111', '3089', '323003', '4633', '323119']);
  const [augIds, setAugIds] = useState<string[]>(['adapt', 'mad_scientist', 'baron_hand', 'tank_engine']);
  const [tankStacks, setTankStacks] = useState(35);
  const [tankMode, setTankMode] = useState<StackMode>('compound');
  const [cappaJuice, setCappaJuice] = useState(0);
  const [cappaMode, setCappaMode] = useState<StackMode>('additive');
  const [demonKing, setDemonKing] = useState(0);
  const [dragonheart, setDragonheart] = useState(0);
  const [multiplicative, setMultiplicative] = useState(true);
  const [bloodmail, setBloodmail] = useState(true);
  const [forgeHP, setForgeHP] = useState(0);
  const [forgeAP, setForgeAP] = useState(0);
  const [forgeAD, setForgeAD] = useState(0);
  const [forgeMana, setForgeMana] = useState(0);

  // Compute
  const result = useMemo(() => {
    try {
      return simulateRyzeInfiniteEngine({
        selectedItemIds: itemIds,
        selectedAugmentIds: augIds,
        tankEngineStacks: tankStacks,
        tankEngineMode: tankMode,
        cappaJuiceBottles: cappaJuice,
        cappaJuiceMode: cappaMode,
        demonKingStacks: demonKing,
        dragonheartStacks: dragonheart,
        allStatsStackMode: 'additive',
        multiplicative,
        bloodmailLowHp: bloodmail,
        statForge: { hp: forgeHP, ap: forgeAP, ad: forgeAD, mana: forgeMana },
      });
    } catch { return null; }
  }, [itemIds, augIds, tankStacks, tankMode, cappaJuice, cappaMode, demonKing, dragonheart, multiplicative, bloodmail, forgeHP, forgeAP, forgeAD, forgeMana]);

  const isOverflow = result?.isOverflow ?? false;
  const loopPct = result ? Math.min(result.loopFactor * 100, 999) : 0;

  // Tank engine bonus text
  const teBonus = tankMode === 'compound'
    ? Math.round(((1.05 ** tankStacks) - 1) * 100)
    : tankStacks * 5;
  const cappaBonus = cappaMode === 'compound'
    ? Math.round(((1.15 ** cappaJuice) - 1) * 100)
    : cappaJuice * 15;

  return (
    <div className="container mx-auto px-4 py-6 max-w-[1160px]">
      {/* ── Header ── */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
          <img
            src="https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/Ryze.png"
            alt="瑞兹"
            className="w-12 h-12"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
        <div>
          <h1 className="text-xl font-bold">瑞兹 无限引擎</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">海克斯大乱斗</span>
            <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">法师</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            配置强化符文与装备，模拟瑞兹在海克斯大乱斗中的成长循环和属性面板。
          </p>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── LEFT: Config ── */}
        <div className="lg:w-[580px] shrink-0 space-y-4">
          {/* 1. Augments */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" /> 海克斯符文
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {SIM_AUGMENTS.map(a => (
                  <AugmentCard_
                    key={a.augmentId}
                    id={a.augmentId}
                    selected={augIds.includes(a.augmentId)}
                    onToggle={() => setAugIds(prev => prev.includes(a.augmentId) ? prev.filter(x => x !== a.augmentId) : [...prev, a.augmentId])}
                  />
                ))}
              </div>
              {/* Tank engine slider */}
              {augIds.includes('tank_engine') && (
                <div className="mt-3 p-3 rounded-lg bg-secondary/50 border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">坦克引擎 · 层数</span>
                    <span className="text-xs text-muted-foreground">{tankStacks} 层 · 当前加成 +{teBonus}%</span>
                  </div>
                  <input type="range" min={0} max={100} value={tankStacks} onChange={e => setTankStacks(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none bg-secondary accent-primary cursor-pointer" />
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">0</span>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input type="checkbox" checked={tankMode === 'compound'} onChange={e => setTankMode(e.target.checked ? 'compound' : 'additive')} className="w-3 h-3" />
                      复利 (1.05)^N
                    </label>
                    <span className="text-muted-foreground">100</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2. Items */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <Swords className="h-4 w-4 text-blue-400" /> 装备栏（{itemIds.length}）
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {PRIORITY_ITEMS.map(id => (
                  <ItemCard_
                    key={id}
                    id={id}
                    selected={itemIds.includes(id)}
                    onToggle={() => setItemIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                    bloodmail={bloodmail}
                    onBloodmail={id === '447111' ? setBloodmail : undefined}
                  />
                ))}
              </div>
              {/* Additional items search */}
              <details className="mt-3">
                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">更多装备...</summary>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {gameItems.filter(i => !PRIORITY_ITEMS.includes(i.itemId)).slice(0, 20).map(item => (
                    <ItemCard_
                      key={item.itemId}
                      id={item.itemId}
                      selected={itemIds.includes(item.itemId)}
                      onToggle={() => setItemIds(prev => prev.includes(item.itemId) ? prev.filter(x => x !== item.itemId) : [...prev, item.itemId])}
                    />
                  ))}
                </div>
              </details>
            </CardContent>
          </Card>

          {/* 3. Stat Forge */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <Flame className="h-4 w-4 text-purple-400" /> 属性锻造
              </h2>
              <div className="space-y-2">
                {[
                  { label: 'Mana', gain: '+300', color: 'text-blue-400', val: forgeMana, set: setForgeMana },
                  { label: 'HP', gain: '+200', color: 'text-emerald-400', val: forgeHP, set: setForgeHP },
                  { label: 'AP', gain: '+30', color: 'text-purple-400', val: forgeAP, set: setForgeAP },
                  { label: 'AD', gain: '+20', color: 'text-orange-400', val: forgeAD, set: setForgeAD },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${row.color}`}>{row.label} <span className="text-muted-foreground">({row.gain})</span></span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => row.set(Math.max(0, row.val - 1))}
                        className="w-6 h-6 rounded border border-border flex items-center justify-center hover:bg-secondary text-xs"><Minus className="h-3 w-3" /></button>
                      <span className="text-sm font-mono w-6 text-center">{row.val}</span>
                      <button onClick={() => row.set(row.val + 1)}
                        className="w-6 h-6 rounded border border-border flex items-center justify-center hover:bg-secondary text-xs"><Plus className="h-3 w-3" /></button>
                    </div>
                  </div>
                ))}
                {!coeff.statForge.perPoint.mana.enabled && (
                  <p className="text-[10px] text-muted-foreground italic">Mana 锻造已禁用</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 4. Cappa Juice + stacks */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" /> 帽子饮品
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {/* Cappa juice */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">瓶数</span>
                    <span className="text-xs text-muted-foreground">{cappaJuice} 瓶</span>
                  </div>
                  <input type="range" min={0} max={30} value={cappaJuice} onChange={e => setCappaJuice(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none bg-secondary accent-green-500 cursor-pointer" />
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-0.5">
                    <span>每瓶 +15% HP</span>
                    <span>倍率 +{cappaBonus}%</span>
                  </div>
                  <label className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1 cursor-pointer">
                    <input type="checkbox" checked={cappaMode === 'compound'} onChange={e => setCappaMode(e.target.checked ? 'compound' : 'additive')} className="w-3 h-3" />
                    复利
                  </label>
                </div>
                {/* Demon King */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">大魔王层数</span>
                    <span className="text-xs text-muted-foreground">{demonKing}</span>
                  </div>
                  <input type="range" min={0} max={50} value={demonKing} onChange={e => setDemonKing(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none bg-secondary accent-red-500 cursor-pointer" />
                  <span className="text-[10px] text-muted-foreground">每层 +1% 全属性</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Dragonheart */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">龙心层数</span>
                    <span className="text-xs text-muted-foreground">{dragonheart} / 7</span>
                  </div>
                  <input type="range" min={0} max={7} value={dragonheart} onChange={e => setDragonheart(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none bg-secondary accent-orange-500 cursor-pointer" />
                  <span className="text-[10px] text-muted-foreground">每层 +4% 全属性</span>
                </div>
                {/* Multiplicative toggle */}
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={multiplicative} onChange={e => setMultiplicative(e.target.checked)} className="w-3 h-3" />
                    <span className="text-xs text-muted-foreground">乘区连乘模式</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── RIGHT: Results ── */}
        <div className="lg:w-[440px] flex-1 space-y-4 lg:sticky lg:top-[72px] lg:self-start">
          {/* 1. Simulation Result */}
          <Card className={`border-2 ${isOverflow ? 'border-red-400/40 bg-red-400/5' : 'border-emerald-400/30'}`}>
            <CardContent className="p-5">
              <h2 className="text-sm font-semibold text-muted-foreground mb-4">模拟结果</h2>

              <div className="text-center mb-4">
                <div className={`text-2xl font-bold ${isOverflow ? 'text-red-400' : 'text-emerald-400'}`}>
                  {isOverflow ? '数值溢出' : '数值收敛'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {isOverflow ? '系统进入无限循环' : '循环增益不足，属性稳定在以下数值'}
                </p>
              </div>

              {/* Progress bar */}
              <div className="relative h-3 rounded-full bg-secondary overflow-hidden mb-2">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-300 ${isOverflow ? 'bg-red-500' : loopPct > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(loopPct, 100)}%` }}
                />
              </div>
              <div className={`text-center text-lg font-bold ${isOverflow ? 'text-red-400' : 'text-foreground'}`}>
                {loopPct.toFixed(2)}%
              </div>

              {/* Base stats */}
              <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                <span>基础蓝量 {result ? formatRyzeNumber(result.flatStats.mana) : '--'}</span>
                <span>阈值 {result ? formatRyzeNumber(result.thresholdMana) : '--'}</span>
              </div>

              {result && result.warnings.length > 0 && (
                <div className="mt-3 p-2 rounded bg-amber-400/5 border border-amber-400/20">
                  {result.warnings.map((w, i) => (
                    <p key={i} className="text-[10px] text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 shrink-0" /> {w}
                    </p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2. Predicted Stats */}
          <Card>
            <CardContent className="p-5">
              <h2 className="text-sm font-semibold text-muted-foreground mb-3">Ryze 属性面板（预测）</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '法术强度（AP）', val: result ? formatRyzeNumber(result.predictedStats.ap) : '--', mult: result ? `${result.multipliers.ap.toFixed(2)}x` : '', color: 'text-purple-400', bg: 'bg-purple-400/5 border-purple-400/20' },
                  { label: '生命值（HP）', val: result ? formatRyzeNumber(result.predictedStats.hp) : '--', mult: result ? `${result.multipliers.hp.toFixed(2)}x` : '', color: 'text-emerald-400', bg: 'bg-emerald-400/5 border-emerald-400/20' },
                  { label: '法力值（MANA）', val: result ? formatRyzeNumber(result.predictedStats.mana) : '--', mult: result ? `基础 ${formatRyzeNumber(result.flatStats.mana)}` : '', color: 'text-blue-400', bg: 'bg-blue-400/5 border-blue-400/20' },
                  { label: '攻击力（AD）', val: result ? formatRyzeNumber(result.predictedStats.ad) : '--', mult: '', color: 'text-orange-400', bg: 'bg-orange-400/5 border-orange-400/20' },
                ].map(stat => (
                  <div key={stat.label} className={`p-3 rounded-lg border ${stat.bg}`}>
                    <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                    <div className={`text-xl font-bold ${stat.color}`}>{stat.val}</div>
                    {stat.mult && <div className="text-[10px] text-muted-foreground">{stat.mult}</div>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 3. Conclusion */}
          <Card>
            <CardContent className="p-5">
              <h2 className="text-sm font-semibold text-muted-foreground mb-2">结论</h2>
              <p className="text-sm leading-relaxed">
                {isOverflow
                  ? '无限引擎：当前配置已经达到循环因子 100% 以上，瑞兹会进入无限增长。'
                  : '数值收敛：当前配置尚未达到无限循环阈值，可以继续提高蓝量、生命值转化或法强乘区。'}
              </p>
              <p className="text-[10px] text-muted-foreground mt-2">
                已同步当前配置重新计算 · 数据来自本地瑞兹模拟器系数文件 v{coeff.meta.version}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
