import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { heroes } from '@/data/heroes';
import { augments } from '@/data/augments';
import { recommendItems } from '@/logic/augmentItemRecommender';
import type { BuildResult, RecommendedItem } from '@/logic/augmentItemRecommender';
import { X, Swords, Shield, Zap, AlertTriangle, HelpCircle } from 'lucide-react';

const SRC_COLORS: Record<string, string> = {
  '强化联动': 'border-blue-400/40 bg-blue-400/5',
  '英雄定位': 'border-emerald-400/40 bg-emerald-400/5',
  '双重命中': 'border-amber-400/40 bg-amber-400/5',
  '情况补充': 'border-muted',
  '反协同': 'border-red-400/40 bg-red-400/5',
};

function ItemCard({ item }: { item: RecommendedItem }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${SRC_COLORS[item.sourceLabelCn] || 'border-border'} bg-card`}>
      {imgErr ? (
        <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center shrink-0 text-muted-foreground"><Swords className="h-5 w-5" /></div>
      ) : (
        <img src={item.iconUrl} alt={item.nameCn} className="w-10 h-10 rounded shrink-0" onError={() => setImgErr(true)} />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{item.nameCn}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
            item.scoreTier === 'core' ? 'bg-amber-500/20 text-amber-400' :
            item.scoreTier === 'good' ? 'bg-blue-500/20 text-blue-400' :
            item.scoreTier === 'optional' ? 'bg-secondary text-muted-foreground' :
            'bg-red-500/20 text-red-400'
          }`}>
            {item.scoreTier === 'core' ? '核心' : item.scoreTier === 'good' ? '可选' : item.scoreTier === 'optional' ? '情况' : '不推荐'}
          </span>
          <span className={`text-[10px] px-1 py-0.5 rounded ${
            item.sourceType === 'augment_synergy' ? 'bg-blue-500/10 text-blue-400' :
            item.sourceType === 'hero_role_fallback' ? 'bg-emerald-500/10 text-emerald-400' :
            item.sourceType === 'dual_match' ? 'bg-amber-500/10 text-amber-400' :
            'bg-red-500/10 text-red-400'
          }`}>{item.sourceLabelCn}</span>
        </div>
        {item.matchedTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {item.matchedTags.map(t => (
              <span key={t} className="text-[9px] bg-secondary text-muted-foreground px-1 py-0.5 rounded">{t}</span>
            ))}
          </div>
        )}
        {item.reasonsCn.map((r, i) => (
          <p key={i} className="text-xs text-muted-foreground mt-1 leading-relaxed">{r}</p>
        ))}
      </div>
    </div>
  );
}

export function BuildRecommendationsPage() {
  const [heroKeyword, setHeroKeyword] = useState('');
  const [showHero, setShowHero] = useState(false);
  const [heroId, setHeroId] = useState<string | null>(null);
  const [augKeyword, setAugKeyword] = useState('');
  const [showAug, setShowAug] = useState(false);
  const [augIds, setAugIds] = useState<string[]>([]);

  const selectedHero = heroId ? heroes.find(h => h.heroId === heroId) : null;

  const heroFiltered = heroKeyword
    ? heroes.filter(h => h.heroNameCn.includes(heroKeyword) || h.heroTitleCn.includes(heroKeyword) || h.displayNameCn.includes(heroKeyword) || h.aliases.some(a => a.includes(heroKeyword)))
    : [];

  const augFiltered = augKeyword
    ? augments.filter(a => a.augmentNameCn.includes(augKeyword)).slice(0, 20)
    : augments.slice(0, 20);

  const result: BuildResult | null = useMemo(() => {
    if (!heroId) return null;
    return recommendItems({ heroId, selectedAugmentIds: augIds });
  }, [heroId, augIds]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1180px]">
      <h1 className="text-2xl font-bold mb-1">强化驱动出装</h1>
      <p className="text-sm text-muted-foreground mb-6">
        先按强化符文机制推荐装备；如果强化没有明确装备联动，则按英雄定位兜底推荐。
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── LEFT: Inputs ── */}
        <div className="lg:w-[420px] shrink-0 space-y-4">
          {/* Hero */}
          <Card>
            <CardContent className="p-4">
              <label className="text-sm font-medium mb-2 block">英雄选择</label>
              {selectedHero ? (
                <div className="flex items-center gap-2 p-2 bg-secondary rounded">
                  <img src={selectedHero.iconUrl} alt="" className="w-8 h-8 rounded" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <span className="text-sm font-medium">{selectedHero.displayNameCn}</span>
                  <span className={`text-[10px] px-1 py-0.5 rounded ml-auto ${selectedHero.tierCode === 'S+' ? 'bg-yellow-500 text-black' : selectedHero.tierCode === 'S' ? 'bg-red-500 text-white' : 'bg-secondary text-muted-foreground'}`}>{selectedHero.tierCode}</span>
                  <button onClick={() => setHeroId(null)} className="text-muted-foreground hover:text-red-400"><X className="h-4 w-4" /></button>
                </div>
              ) : (
                <div className="relative">
                  <input type="text" value={heroKeyword} onChange={e => { setHeroKeyword(e.target.value); setShowHero(true); }}
                    onFocus={() => { if (heroKeyword) setShowHero(true); }}
                    onBlur={() => setTimeout(() => setShowHero(false), 150)}
                    placeholder="搜索英雄名称或称号..." className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm" />
                  {showHero && heroKeyword && (
                    <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded shadow-lg max-h-48 overflow-y-auto">
                      {heroFiltered.map(h => (
                        <button key={h.heroId} onMouseDown={e => e.preventDefault()}
                          onClick={() => { setHeroId(h.heroId); setHeroKeyword(''); setShowHero(false); }}
                          className="w-full text-left px-3 py-2 hover:bg-accent text-sm flex items-center gap-2">
                          <img src={h.iconUrl} className="w-6 h-6 rounded" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          <span>{h.displayNameCn}</span>
                          <span className={`text-[10px] px-1 rounded ml-auto ${h.tierCode === 'S+' ? 'bg-yellow-500 text-black' : h.tierCode === 'S' ? 'bg-red-500 text-white' : 'bg-secondary text-muted-foreground'}`}>{h.tierCode}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Augments */}
          <Card>
            <CardContent className="p-4">
              <label className="text-sm font-medium mb-2 block">已选强化符文</label>
              {augIds.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {augIds.map(aid => {
                    const a = augments.find(x => x.augmentId === aid);
                    return (
                      <span key={aid} className="inline-flex items-center gap-1 text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                        {a?.augmentNameCn || aid}
                        <button onClick={() => setAugIds(prev => prev.filter(x => x !== aid))} className="hover:text-red-400">×</button>
                      </span>
                    );
                  })}
                </div>
              )}
              <div className="relative">
                <input type="text" value={augKeyword} onChange={e => { setAugKeyword(e.target.value); setShowAug(true); }}
                  onFocus={() => { if (augKeyword) setShowAug(true); }}
                  onBlur={() => setTimeout(() => setShowAug(false), 150)}
                  placeholder="搜索强化符文..." className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm" />
                {showAug && augKeyword && (
                  <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded shadow-lg max-h-48 overflow-y-auto">
                    {augFiltered.filter(a => !augIds.includes(a.augmentId)).map(a => (
                      <button key={a.augmentId} onMouseDown={e => e.preventDefault()}
                        onClick={() => { setAugIds(prev => [...prev, a.augmentId]); setAugKeyword(''); setShowAug(false); }}
                        className="w-full text-left px-3 py-1.5 hover:bg-accent text-xs">
                        {a.augmentNameCn} <span className="text-muted-foreground">({a.tier === 'Prismatic' ? '棱彩' : a.tier === 'Gold' ? '金色' : '银色'})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Strategy note */}
          <div className="flex items-start gap-2 text-xs text-muted-foreground p-3 rounded bg-secondary/30">
            <Zap className="h-4 w-4 shrink-0 mt-0.5 text-primary/60" />
            <span>系统会优先读取强化机制；当强化无法明确影响装备时，使用英雄定位兜底。</span>
          </div>
        </div>

        {/* ── RIGHT: Results ── */}
        <div className="flex-1 space-y-4 lg:sticky lg:top-[72px] lg:self-start">
          {!heroId ? (
            <Card><CardContent className="p-10 text-center text-muted-foreground">
              <HelpCircle className="h-10 w-10 mx-auto mb-3" />
              <p>请选择英雄后查看推荐。</p>
            </CardContent></Card>
          ) : result ? (
            <>
              {/* Overview */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {selectedHero && (
                      <img src={selectedHero.iconUrl} alt="" className="w-10 h-10 rounded" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    )}
                    <div>
                      <h2 className="text-lg font-bold">{result.hero.heroNameCn} · {result.hero.roles.join(' / ')}</h2>
                      <p className="text-xs text-muted-foreground">已选 {augIds.length} 个强化</p>
                    </div>
                    <div className="ml-auto grid grid-cols-2 gap-1.5 text-center">
                      {[
                        { label: '强化联动', count: result.sourceSummary.augmentSynergyCount, color: 'text-blue-400' },
                        { label: '英雄兜底', count: result.sourceSummary.roleFallbackCount, color: 'text-emerald-400' },
                        { label: '双重命中', count: result.sourceSummary.dualMatchCount, color: 'text-amber-400' },
                        { label: '反协同', count: result.sourceSummary.antiSynergyCount, color: 'text-red-400' },
                      ].map(s => (
                        <div key={s.label} className="text-[10px]"><span className={s.color + ' font-bold'}>{s.count}</span><br /><span className="text-muted-foreground">{s.label}</span></div>
                      ))}
                    </div>
                  </div>
                  {augIds.length === 0 && (
                    <p className="text-xs text-muted-foreground p-2 rounded bg-secondary/50 flex items-center gap-1.5">
                      <AlertTriangle className="h-3 w-3" /> 当前未选择强化，系统将按英雄定位推荐基础装备。
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Core */}
              {result.groups.core.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Swords className="h-4 w-4 text-amber-400" /> 核心装备
                  </h3>
                  <div className="space-y-2">
                    {result.groups.core.map(item => <ItemCard key={item.itemId} item={item} />)}
                  </div>
                </div>
              )}

              {/* Optional */}
              {result.groups.optional.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-blue-400" /> 可选装备
                  </h3>
                  <div className="space-y-2">
                    {result.groups.optional.map(item => <ItemCard key={item.itemId} item={item} />)}
                  </div>
                </div>
              )}

              {/* Situational */}
              {result.groups.situational.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-muted-foreground" /> 情况装备
                  </h3>
                  <div className="space-y-2">
                    {result.groups.situational.map(item => <ItemCard key={item.itemId} item={item} />)}
                  </div>
                </div>
              )}

              {/* Avoid */}
              {result.groups.avoid.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-red-400" /> 不推荐装备
                  </h3>
                  <div className="space-y-2">
                    {result.groups.avoid.map(item => <ItemCard key={item.itemId} item={item} />)}
                  </div>
                </div>
              )}

              {result.groups.core.length === 0 && result.groups.optional.length === 0 && result.groups.situational.length === 0 && (
                <Card><CardContent className="p-8 text-center text-muted-foreground">
                  <p>当前配置没有明确装备联动，建议按英雄定位和局势选择装备。</p>
                </CardContent></Card>
              )}
            </>
          ) : (
            <Card><CardContent className="p-10 text-center text-muted-foreground">
              <p>加载中...</p>
            </CardContent></Card>
          )}
        </div>
      </div>
    </div>
  );
}
