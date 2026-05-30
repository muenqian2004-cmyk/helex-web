import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SearchInput } from '@/components/SearchInput';
import { EmptyState } from '@/components/EmptyState';
import { gameItems } from '@/data/gameItems';
import type { GameItem } from '@/types';
import { Package, Coins, ArrowRight, Sparkles } from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  '传说': '传说装备',
  '起始': '起始装备',
  '消耗品': '消耗品',
  'epic': '史诗装备',
  'basic': '基础装备',
  'boots_tier2': '二级鞋',
  'boots_basic': '基础鞋',
  'trinket': '饰品',
  'vision': '视野',
};

function ItemCard({ item }: { item: GameItem }) {
  const [imgErr, setImgErr] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="bg-card hover:bg-accent/30 transition-colors cursor-pointer" onClick={() => setExpanded(!expanded)}>
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="shrink-0 w-10 h-10 flex items-center justify-center">
            {imgErr ? (
              <Package className="w-8 h-8 text-muted-foreground" />
            ) : (
              <img src={item.iconUrl} alt={item.nameCn} className="w-10 h-10" onError={() => setImgErr(true)} />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{item.nameCn}</span>
              {item.isAramModified && (
                <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1 rounded">海克斯</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span>{CATEGORY_LABELS[item.categoryCn] || item.categoryCn}</span>
              <span>·</span>
              <span className="flex items-center gap-0.5"><Coins className="h-3 w-3" /> {item.price}</span>
              {item.tags.length > 0 && (
                <>
                  <span>·</span>
                  <span className="truncate">{item.tags.slice(0, 3).map(t => {
                    const tagMap: Record<string, string> = {
                      'Damage': '攻击', 'Health': '生命', 'AttackSpeed': '攻速', 'CriticalStrike': '暴击',
                      'Armor': '护甲', 'SpellBlock': '魔抗', 'AbilityHaste': '技能急速', 'Mana': '法力',
                      'LifeSteal': '吸血', 'MagicPenetration': '法穿', 'ArmorPenetration': '护穿',
                      'OnHit': '命中', 'Active': '主动', 'Boots': '鞋子', 'SpellDamage': '法强',
                      'CooldownReduction': '冷却', 'NonbootsMovement': '移速', 'Slow': '减速',
                    };
                    return tagMap[t] || t;
                  }).join('、')}</span>
                </>
              )}
            </div>
          </div>

          <span className="text-xs text-muted-foreground shrink-0">
            {expanded ? '收起' : '详情'}
          </span>
        </div>

        {/* Expanded detail */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-border space-y-2 text-xs text-muted-foreground">
            {item.plainTextCn && (
              <p className="text-emerald-400/80 font-medium">{item.plainTextCn}</p>
            )}
            {item.descriptionCn && (
              <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: item.descriptionCn.replace(/<br>/g, '<br/>') }} />
            )}

            {/* Build paths */}
            {item.buildFrom.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">合成：</span>
                {item.buildFrom.map((fromId, i) => {
                  const fromItem = gameItems.find(gi => gi.itemId === fromId);
                  return (
                    <span key={i} className="flex items-center gap-0.5">
                      {fromItem?.nameCn || fromId}
                      {i < item.buildFrom.length - 1 && <span className="text-muted-foreground">+</span>}
                    </span>
                  );
                })}
                <ArrowRight className="h-3 w-3" />
                <span className="text-foreground font-medium">{item.nameCn}</span>
              </div>
            )}

            {item.buildInto.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">可合成：</span>
                {item.buildInto.map((intoId, i) => {
                  const intoItem = gameItems.find(gi => gi.itemId === intoId);
                  return (
                    <span key={i}>
                      {intoItem?.nameCn || intoId}
                      {i < item.buildInto.length - 1 && <span className="text-muted-foreground">、</span>}
                    </span>
                  );
                })}
              </div>
            )}

            {item.aramChangeCn && (
              <p className="flex items-center gap-1 text-amber-400/80">
                <Sparkles className="h-3 w-3" /> {item.aramChangeCn}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ItemsPage() {
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(gameItems.map(i => i.categoryCn))];

  const filtered = useMemo(() => {
    let result = gameItems;
    if (keyword) {
      const k = keyword.toLowerCase();
      result = result.filter(i =>
        i.nameCn.includes(k) || i.plainTextCn.includes(k) || i.descriptionCn.includes(k) ||
        i.tags.some(t => t.toLowerCase().includes(k))
      );
    }
    if (selectedCategory) {
      result = result.filter(i => i.categoryCn === selectedCategory);
    }
    return result;
  }, [keyword, selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <Package className="h-6 w-6 text-primary" /> 装备查询
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        共收录 {gameItems.length} 件装备。点击装备卡片展开详情（属性、合成路线、海克斯改动）。
      </p>

      <div className="space-y-4 mb-6">
        <SearchInput value={keyword} onChange={setKeyword} placeholder="搜索装备名称、属性标签..." />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`text-xs px-3 py-1 rounded transition-colors ${!selectedCategory ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
          >
            全部分类
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`text-xs px-3 py-1 rounded transition-colors ${selectedCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
            >
              {CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((item) => (
            <ItemCard key={item.itemId} item={item} />
          ))
        )}
      </div>
    </div>
  );
}
