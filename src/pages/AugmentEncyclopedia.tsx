import { useState, useMemo } from 'react';
import { SearchInput } from '@/components/SearchInput';
import { AugmentCard } from '@/components/AugmentCard';
import { EmptyState } from '@/components/EmptyState';
import { augments } from '@/data/augments';
import { searchByKeyword } from '@/lib/search';
import type { Tier } from '@/types';

const TIERS: Tier[] = ['Prismatic', 'Gold', 'Silver'];
const TIER_LABELS: Record<Tier, string> = {
  Prismatic: '棱彩',
  Gold: '金色',
  Silver: '银色',
};

export function AugmentEncyclopedia() {
  const [keyword, setKeyword] = useState('');
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);

  const filtered = useMemo(() => {
    let result = augments;
    result = searchByKeyword(result, keyword, (a) =>
      [a.augmentNameCn, a.effect, a.notes].join(' ')
    );
    if (selectedTier) result = result.filter((a) => a.tier === selectedTier);
    return result;
  }, [keyword, selectedTier]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-2">强化百科</h1>
      <p className="text-sm text-muted-foreground mb-6">
        共收录 {augments.length} 张强化符文（数据来源：ARAM Mayhem）。所有数据标注来源和可信度。
      </p>

      <div className="space-y-4 mb-6">
        <SearchInput value={keyword} onChange={setKeyword} placeholder="搜索强化名称、效果..." />

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
              {TIER_LABELS[tier]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((augment) => (
            <AugmentCard key={augment.augmentId} augment={augment} clickable />
          ))
        )}
      </div>
    </div>
  );
}
