import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { heroes } from '@/data/heroes';
import { heroBuildsByHeroId } from '@/data/heroBuilds';
import { heroDetailsByHeroId } from '@/data/heroDetails';
import { augmentsById } from '@/data/augments';
import { ArrowLeft } from 'lucide-react';

const TIER_COLORS: Record<string, string> = {
  'S+': 'bg-yellow-500 text-black',
  'S': 'bg-red-500 text-white',
  'A': 'bg-orange-500 text-white',
  'B': 'bg-green-500 text-white',
  'C': 'bg-gray-500 text-white',
};

const TIER_STYLES: Record<string, string> = {
  '棱彩阶': 'border-purple-400/40 bg-purple-400/5',
  '金色阶': 'border-amber-400/40 bg-amber-400/5',
  '银色阶': 'border-gray-400/40 bg-gray-400/5',
};

const TIER_BADGE: Record<string, string> = {
  '棱彩阶': 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  '金色阶': 'bg-amber-500 text-white',
  '银色阶': 'bg-gray-400 text-white',
};

function ItemIcon({ name, url }: { name: string; url: string }) {
  const [err, setErr] = useState(false);
  if (err) return <span className="text-xs text-muted-foreground truncate max-w-16" title={name}>{name}</span>;
  return <img src={url} alt={name} className="w-10 h-10 rounded shrink-0" title={name} onError={() => setErr(true)} />;
}

export function HeroDetailPage() {
  const { heroId } = useParams<{ heroId: string }>();
  const [heroImgErr, setHeroImgErr] = useState(false);

  const hero = heroId ? heroes.find((h) => h.heroId === heroId) : null;
  const detail = heroId ? heroDetailsByHeroId[heroId] : null;
  const build = heroId ? heroBuildsByHeroId[heroId] : null;

  if (!hero) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">英雄未找到</h1>
        <Link to="/heroes" className="text-primary hover:underline">返回英雄速查卡</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back link */}
      <Link to="/heroes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> 返回英雄速查卡
      </Link>

      {/* Hero Header */}
      <div className="flex items-start gap-5 mb-8">
        <div className="shrink-0">
          {heroImgErr ? (
            <div className="w-20 h-20 rounded-lg bg-secondary flex items-center justify-center text-2xl font-bold text-muted-foreground">
              {hero.heroNameCn[0]}
            </div>
          ) : (
            <img src={hero.iconUrl} alt={hero.heroNameCn} className="w-20 h-20 rounded-lg" onError={() => setHeroImgErr(true)} />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{hero.displayNameCn}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${TIER_COLORS[hero.tierCode] || 'bg-secondary'}`}>
              {hero.tierCode} {hero.tierCn}
            </span>
            <span className="text-sm text-muted-foreground">{hero.roles.join(' / ')}</span>
          </div>
        </div>
      </div>

      {/* Recommended Augments by Tier */}
      {detail && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">推荐强化符文</h2>
          <div className="space-y-4">
            {[
              { key: 'prismaticAugments', label: '棱彩阶', items: detail.prismaticAugments },
              { key: 'goldAugments', label: '金色阶', items: detail.goldAugments },
              { key: 'silverAugments', label: '银色阶', items: detail.silverAugments },
            ].map((tier) => (
              tier.items.length > 0 && (
                <Card key={tier.key} className={`${TIER_STYLES[tier.label]}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs px-2 py-0.5 rounded font-semibold ${TIER_BADGE[tier.label]}`}>
                        {tier.label}
                      </span>
                      <span className="text-xs text-muted-foreground">{tier.items.length} 个推荐</span>
                    </div>
                    <div className="space-y-1.5">
                      {tier.items.map((a) => {
                        const augData = augmentsById[a.augmentId];
                        return (
                          <Link
                            key={a.augmentId}
                            to={`/augments/${a.augmentId}`}
                            className="flex items-center gap-2 bg-secondary hover:bg-accent px-3 py-2 rounded transition-colors"
                          >
                            {augData?.iconUrl && (
                              <img
                                src={augData.iconUrl}
                                alt={a.augmentNameCn}
                                className="w-8 h-8 rounded shrink-0"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-medium">{a.augmentNameCn}</span>
                                {augData && (
                                  <span className="text-xs text-muted-foreground">
                                    ({augData.winRate.toFixed(1)}%)
                                  </span>
                                )}
                                {a.recommendationTypeCn && (
                                  <span className={`text-[10px] px-1 rounded shrink-0 ${
                                    a.recommendationTypeCn === '最佳推荐' ? 'bg-amber-500/20 text-amber-400' :
                                    a.recommendationTypeCn === '较为推荐' ? 'bg-blue-500/20 text-blue-400' :
                                    a.recommendationTypeCn === '套路可玩' ? 'bg-purple-500/20 text-purple-400' :
                                    'bg-secondary text-muted-foreground'
                                  }`}>
                                    {a.recommendationTypeCn}
                                  </span>
                                )}
                                {a.comboHeroTierCn && (
                                  <span className={`text-[10px] px-1 rounded font-bold shrink-0 ${
                                    a.comboHeroTierCn.includes('S') ? 'bg-red-500/20 text-red-400' :
                                    a.comboHeroTierCn.includes('A') ? 'bg-orange-500/20 text-orange-400' :
                                    'bg-secondary text-muted-foreground'
                                  }`}>
                                    {a.comboHeroTierCn}
                                  </span>
                                )}
                              </div>
                              {a.reasonHeroCn && (
                                <p className="text-xs text-muted-foreground mt-0.5 truncate">{a.reasonHeroCn}</p>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            ))}
          </div>
        </section>
      )}

      {/* Item Builds */}
      {build && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">推荐出装</h2>
          <Card>
            <CardContent className="p-5 space-y-4">
              {build.startingItems.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">出门装</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {build.startingItems.slice(0, 2).flatMap((g, gi) =>
                      g.items.map((it, ii) => <ItemIcon key={`s-${gi}-${ii}`} name={it.itemNameCn} url={it.itemIconUrl} />)
                    )}
                  </div>
                </div>
              )}
              {build.boots.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">鞋子</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {build.boots.slice(0, 2).map((b, i) => (
                      <ItemIcon key={`b-${i}`} name={b.itemNameCn} url={b.itemIconUrl} />
                    ))}
                  </div>
                </div>
              )}
              {build.coreBuilds.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    核心出装
                    {build.coreBuilds[0].winRate && (
                      <span className="ml-1 text-emerald-400 text-xs">
                        胜率 {build.coreBuilds[0].winRate.toFixed(1)}%
                      </span>
                    )}
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {build.coreBuilds[0].items.map((it, i) => (
                      <ItemIcon key={`c-${i}`} name={it.itemNameCn} url={it.itemIconUrl} />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Skill Upgrade Order — 3 plans */}
      {detail && detail.skillPlans.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">推荐技能升级顺序</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {detail.skillPlans.map((plan) => (
              <Card key={plan.planOrder} className={plan.planOrder === 1 ? 'border-primary/40' : ''}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                        plan.planOrder === 1 ? 'bg-primary text-primary-foreground' :
                        plan.planOrder === 2 ? 'bg-blue-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {plan.planOrder === 1 ? '推荐方案' : plan.planOrder === 2 ? '备选方案' : '另一方案'}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-foreground">{plan.skillPriorityCn}</p>

                  {/* Skill priority icons */}
                  <div className="flex items-center gap-1.5">
                    {plan.skillPriority.map((skill, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span className="w-7 h-7 rounded bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                          {skill}
                        </span>
                        {i < plan.skillPriority.length - 1 && (
                          <span className="text-muted-foreground text-xs">&gt;</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Level-up order */}
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1.5">Lv1-15 加点序列</span>
                    <div className="flex flex-wrap gap-0.5">
                      {plan.levelUpOrder.map((skill, i) => (
                        <span
                          key={i}
                          className={`w-6 h-6 rounded text-[10px] font-bold flex items-center justify-center ${
                            skill === 'R'
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              : 'bg-secondary text-foreground'
                          }`}
                          title={`Lv${i + 1}: ${skill}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
