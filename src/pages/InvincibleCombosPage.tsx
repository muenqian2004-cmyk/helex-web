import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { SearchInput } from '@/components/SearchInput';
import { EmptyState } from '@/components/EmptyState';
import { invincibleCombos } from '@/data/invincibleCombos';
import { augmentsById } from '@/data/augments';
import { heroes } from '@/data/heroes';
import { Zap, Shield, Star, AlertTriangle } from 'lucide-react';

const POWER_COLORS: Record<string, string> = {
  '近似无敌': 'bg-red-500/20 text-red-400 border-red-400/30',
  '版本答案': 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30',
  '极高上限': 'bg-purple-500/20 text-purple-400 border-purple-400/30',
};

export function InvincibleCombosPage() {
  const [keyword, setKeyword] = useState('');
  const [selectedHero, setSelectedHero] = useState<string | null>(null);

  const heroIds = [...new Set(invincibleCombos.map(c => c.heroId))];

  const filtered = invincibleCombos.filter((c) => {
    if (selectedHero && c.heroId !== selectedHero) return false;
    if (keyword) {
      const k = keyword.toLowerCase();
      return c.comboNameCn.includes(k) || c.heroNameCn.includes(k) ||
        c.heroAliasesUsed.some(a => a.includes(k)) ||
        c.requiredAugments.some(a => a.nameCn.includes(k)) ||
        c.skillOrPlaystyleCn.includes(k);
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-2">无敌套路</h1>
      <p className="text-sm text-muted-foreground mb-6">
        收录 {invincibleCombos.length} 套高上限连招组合。这些组合一旦成型强度极高，但需要特定强化和装备配合。
      </p>

      <div className="space-y-4 mb-6">
        <SearchInput value={keyword} onChange={setKeyword} placeholder="搜索套路名、英雄、强化..." />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedHero(null)}
            className={`text-xs px-3 py-1 rounded transition-colors ${!selectedHero ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
          >
            全部英雄
          </button>
          {heroIds.map((hid) => {
            const hero = heroes.find(h => h.heroId === hid);
            return (
              <button
                key={hid}
                onClick={() => setSelectedHero(hid === selectedHero ? null : hid)}
                className={`text-xs px-3 py-1 rounded transition-colors ${hid === selectedHero ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
              >
                {hero?.heroNameCn || hid}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((combo) => {
            const hero = heroes.find(h => h.heroId === combo.heroId);
            return (
              <Card key={combo.comboId} className={`border ${POWER_COLORS[combo.powerLevelCn] || 'border-border'}`}>
                <CardContent className="p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {hero && (
                        <img src={hero.iconUrl} alt={hero.heroNameCn} className="w-10 h-10 rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold">{combo.comboNameCn}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded font-bold border ${POWER_COLORS[combo.powerLevelCn] || 'bg-secondary text-muted-foreground'}`}>
                            {combo.powerLevelCn}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {combo.heroNameCn} · 发力期：{combo.powerSpikeCn}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Required Augments */}
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-400" /> 核心强化
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {combo.requiredAugments.map((a) => {
                        const augData = augmentsById[a.augmentId];
                        return (
                          <Link
                            key={a.augmentId}
                            to={`/augments/${a.augmentId}`}
                            className="bg-secondary hover:bg-accent px-3 py-2 rounded transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              {augData?.iconUrl && (
                                <img src={augData.iconUrl} alt={a.nameCn} className="w-7 h-7 rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                              )}
                              <div>
                                <span className="text-sm font-medium">{a.nameCn}</span>
                                <p className="text-xs text-muted-foreground">{a.roleInComboCn}</p>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Optional Augments */}
                  {combo.optionalAugments.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                        <Shield className="h-4 w-4 text-blue-400" /> 可选强化
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {combo.optionalAugments.map((a) => (
                          <Link
                            key={a.augmentId}
                            to={`/augments/${a.augmentId}`}
                            className="bg-secondary hover:bg-accent px-3 py-2 rounded transition-colors"
                          >
                            <span className="text-sm">{a.nameCn}</span>
                            {a.reasonCn && <span className="text-xs text-muted-foreground ml-1">— {a.reasonCn}</span>}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Items */}
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-1">推荐装备</h4>
                    <p className="text-sm">{combo.recommendedItemsCn.join('、')}</p>
                  </div>

                  {/* Mechanism */}
                  <div className="p-3 rounded bg-secondary/50 space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-1">
                      <Zap className="h-4 w-4 text-yellow-400" /> 核心机制
                    </h4>
                    <p className="text-sm leading-relaxed">{combo.skillOrPlaystyleCn}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                      <div className="text-xs space-y-1">
                        <span className="text-emerald-400 font-medium">为何组合前不强：</span>
                        <p className="text-muted-foreground">{combo.whyBeforeComboNotBrokenCn}</p>
                      </div>
                      <div className="text-xs space-y-1">
                        <span className="text-red-400 font-medium">为何组合后无敌：</span>
                        <p className="text-muted-foreground">{combo.whyComboIsBrokenCn}</p>
                      </div>
                    </div>

                    {combo.counterplayOrWeaknessCn && (
                      <div className="text-xs space-y-1 pt-1">
                        <span className="text-amber-400 font-medium flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> 弱点
                        </span>
                        <p className="text-muted-foreground">{combo.counterplayOrWeaknessCn}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
