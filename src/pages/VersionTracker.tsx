import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
