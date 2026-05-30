import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { SearchInput } from '@/components/SearchInput';
import { EmptyState } from '@/components/EmptyState';
import { heroes } from '@/data/heroes';
import { heroBuildsByHeroId } from '@/data/heroBuilds';
import { augmentsById } from '@/data/augments';
import type { Hero, HeroBuild } from '@/types';

const TIER_COLORS: Record<string, string> = {
  'S+': 'bg-yellow-500 text-black',
  'S': 'bg-red-500 text-white',
  'A': 'bg-orange-500 text-white',
  'B': 'bg-green-500 text-white',
  'C': 'bg-gray-500 text-white',
};

function ItemIcon({ name, url }: { name: string; url: string }) {
  const [err, setErr] = useState(false);
  if (err) return <span className="text-xs text-muted-foreground truncate" title={name}>{name}</span>;
  return (
    <img
      src={url}
      alt={name}
      className="w-8 h-8 rounded shrink-0"
      title={name}
      onError={() => setErr(true)}
    />
  );
}

function HeroDetailCard({ hero, build }: { hero: Hero; build: HeroBuild | null }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  // Group augments by recommendationGroupCn
  const augGroups = useMemo(() => {
    if (!build) return {};
    const groups: Record<string, typeof build.recommendedAugments> = {};
    for (const a of build.recommendedAugments) {
      const g = a.recommendationGroupCn || '其他';
      if (!groups[g]) groups[g] = [];
      groups[g].push(a);
    }
    return groups;
  }, [build]);

  return (
    <Card className="bg-card hover:bg-accent cursor-pointer transition-colors" onClick={() => navigate(`/heroes/${hero.heroId}`)}>
      <CardContent className="p-5 space-y-4">
        {/* Hero header */}
        <div className="flex items-center gap-3">
          {imgError ? (
            <div className="w-14 h-14 rounded bg-secondary flex items-center justify-center text-xl font-bold text-muted-foreground">
              {hero.heroNameCn[0]}
            </div>
          ) : (
            <img
              src={hero.iconUrl}
              alt={hero.heroNameCn}
              className="w-14 h-14 rounded"
              onError={() => setImgError(true)}
            />
          )}
          <div>
            <h3 className="font-bold text-lg">{hero.displayNameCn}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${TIER_COLORS[hero.tierCode] || 'bg-secondary'}`}>
                {hero.tierCode}
              </span>
              <span className="text-xs text-muted-foreground">{hero.tierCn}</span>
              <span className="text-xs text-muted-foreground">· {hero.roles.join(' / ')}</span>
            </div>
          </div>
        </div>

        {/* Recommended Augments */}
        {build && build.recommendedAugments.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">推荐强化符文</h4>
            <div className="space-y-2">
              {Object.entries(augGroups).map(([group, augs]) => (
                <div key={group}>
                  <span className="text-xs text-muted-foreground mb-1 block">{group}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {augs.map((a) => {
                      const augData = augmentsById[a.augmentId];
                      return (
                        <Link
                          key={a.augmentId}
                          to={`/augments/${a.augmentId}`}
                          className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-2 py-1 rounded transition-colors"
                          title={augData?.effect || ''}
                        >
                          {a.augmentNameCn}
                          {augData && <span className="ml-1 text-muted-foreground">({augData.winRate.toFixed(1)}%)</span>}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Item Builds */}
        {build && (
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">推荐出装</h4>
            <div className="space-y-2">
              {build.startingItems.length > 0 && (
                <div>
                  <span className="text-xs text-muted-foreground">出门装</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {build.startingItems.slice(0, 1).flatMap(g => g.items).map((it, i) => (
                      <ItemIcon key={i} name={it.itemNameCn} url={it.itemIconUrl} />
                    ))}
                  </div>
                </div>
              )}
              {build.boots.length > 0 && (
                <div>
                  <span className="text-xs text-muted-foreground">鞋子</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {build.boots.slice(0, 2).map((b, i) => (
                      <ItemIcon key={i} name={b.itemNameCn} url={b.itemIconUrl} />
                    ))}
                  </div>
                </div>
              )}
              {build.coreBuilds.length > 0 && (
                <div>
                  <span className="text-xs text-muted-foreground">
                    核心出装
                    {build.coreBuilds[0].winRate && (
                      <span className="ml-1 text-emerald-400">胜率 {build.coreBuilds[0].winRate.toFixed(1)}%</span>
                    )}
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {build.coreBuilds[0].items.map((it, i) => (
                      <ItemIcon key={i} name={it.itemNameCn} url={it.itemIconUrl} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!build && (
          <p className="text-xs text-muted-foreground">暂无推荐数据</p>
        )}
      </CardContent>
    </Card>
  );
}

export function HeroCardsPage() {
  const [keyword, setKeyword] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const ROLES = ['全部', '法师', '射手', '战士', '刺客', '坦克', '辅助'];

  const filtered = useMemo(() => {
    let result = heroes;
    if (keyword) {
      result = result.filter((h) =>
        h.heroNameCn.includes(keyword) ||
        h.heroTitleCn.includes(keyword) ||
        h.displayNameCn.includes(keyword) ||
        h.aliases.some((a) => a.includes(keyword))
      );
    }
    if (selectedRole && selectedRole !== '全部') {
      result = result.filter((h) => h.roles.includes(selectedRole));
    }
    return result;
  }, [keyword, selectedRole]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-2">英雄速查卡</h1>
      <p className="text-sm text-muted-foreground mb-6">
        共 {heroes.length} 名英雄。查看推荐强化符文和出装方向。
      </p>

      <div className="space-y-4 mb-6">
        <SearchInput value={keyword} onChange={setKeyword} placeholder="搜索英雄名称或称号..." />

        <div className="flex flex-wrap gap-2">
          {ROLES.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role === '全部' ? null : role)}
              className={`text-xs px-3 py-1 rounded transition-colors ${
                (role === '全部' && !selectedRole) || selectedRole === role
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((hero) => (
            <HeroDetailCard
              key={hero.heroId}
              hero={hero}
              build={heroBuildsByHeroId[hero.heroId] || null}
            />
          ))
        )}
      </div>
    </div>
  );
}
