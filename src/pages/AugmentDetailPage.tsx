import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { TierBadge } from '@/components/TierBadge';
import { augmentsById } from '@/data/augments';
import { augmentSuitableHeroes } from '@/data/augmentSuitableHeroes';
import { ArrowLeft } from 'lucide-react';

function heroTierColor(tier: string): string {
  if (tier.includes('S') && !tier.includes('A')) return 'bg-red-500 text-white';
  if (tier.includes('A')) return 'bg-orange-500 text-white';
  return 'bg-secondary text-muted-foreground';
}

function heroTierLabel(tier: string): string {
  const map: Record<string, string> = {
    'S 神级': 'S 神级', 'S 强力': 'S 强力', 'S 黑科技': 'S 黑科', 'S 娱乐': 'S 娱乐',
    'A 强力': 'A 强力', 'A 娱乐': 'A 娱乐', 'A 黑科技': 'A 黑科', '': '', 'A': 'A', 'S': 'S',
  };
  return map[tier] || tier;
}

const STAGE_LABELS: Record<number, string> = {
  3: '开局',
  7: 'Lv6',
  11: 'Lv11',
  15: '后期',
};

export function AugmentDetailPage() {
  const { augmentId } = useParams<{ augmentId: string }>();
  const [imgError, setImgError] = useState(false);

  const augment = augmentId ? augmentsById[augmentId] : null;

  if (!augment) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">强化符文未找到</h1>
        <p className="text-muted-foreground mb-6">未找到该强化符文的数据，可能已被移除或链接无效。</p>
        <Link to="/augments" className="text-primary hover:underline">
          返回强化百科
        </Link>
      </div>
    );
  }

  const stageText = augment.availabilityStages
    .map((s) => STAGE_LABELS[s] || `Lv${s}`)
    .join(' / ');

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back link */}
      <Link
        to="/augments"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        返回强化百科
      </Link>

      {/* Header */}
      <div className="flex items-start gap-5 mb-8">
        <div className="shrink-0">
          {imgError ? (
            <div className="w-20 h-20 rounded-lg bg-secondary flex items-center justify-center text-2xl font-bold text-muted-foreground">
              {augment.augmentNameCn[0]}
            </div>
          ) : (
            <img
              src={augment.iconUrl}
              alt={augment.augmentNameCn}
              className="w-20 h-20 rounded-lg object-cover"
              onError={() => setImgError(true)}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <TierBadge tier={augment.tier} />
            <h1 className="text-2xl font-bold">{augment.augmentNameCn}</h1>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm bg-primary/20 text-primary px-1.5 py-0.5 rounded">
              {augment.winRate.toFixed(1)}% 胜率
            </span>
            <span className="text-xs text-muted-foreground">
              出现阶段: {stageText}
            </span>
          </div>
          <div></div>
        </div>
      </div>

      {/* Effect */}
      <Card className="mb-8">
        <CardContent className="p-5">
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">效果说明</h2>
          <p className="text-base leading-relaxed">{augment.effect}</p>
        </CardContent>
      </Card>

      {/* 适配英雄 */}
      <Card className="mb-8">
        <CardContent className="p-5">
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">适配英雄</h2>
          {augmentId && augmentSuitableHeroes[augmentId] && augmentSuitableHeroes[augmentId].length > 0 ? (
            <div className="space-y-2">
              {augmentSuitableHeroes[augmentId].map((sh, i) => (
                <Link
                  key={i}
                  to={`/heroes/${sh.heroId}`}
                  className="flex items-center gap-3 bg-secondary/50 hover:bg-accent px-3 py-2.5 rounded transition-colors group"
                >
                  {/* Tier badge */}
                  <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded font-bold ${heroTierColor(sh.comboTierCn)}`}>
                    {heroTierLabel(sh.comboTierCn) || '--'}
                  </span>

                  {/* Hero name */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium">{sh.displayNameCn}</span>
                      <span className={`text-[10px] px-1 rounded ${
                        sh.recommendationTypeCn === '专属推荐' ? 'bg-amber-500/20 text-amber-400' :
                        sh.recommendationTypeCn === '适用于该职业' ? 'bg-blue-500/20 text-blue-400' :
                        sh.recommendationTypeCn === '组合推荐' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-secondary text-muted-foreground'
                      }`}>
                        {sh.recommendationTypeCn}
                      </span>
                    </div>
                    {sh.reasonCn && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate group-hover:text-foreground/80">
                        {sh.reasonCn}
                      </p>
                    )}
                  </div>

                  {/* Confidence */}
                  <span className="shrink-0">
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <p className="text-sm">暂无适配英雄数据</p>
              <p className="text-xs mt-1">该强化符文可能尚未有足够的英雄推荐数据</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 系列羁绊 - framework placeholder */}
      <Card className="mb-8">
        <CardContent className="p-5">
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">系列羁绊</h2>
          <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <p className="text-sm">系列羁绊数据正在整理中</p>
            <p className="text-xs mt-1">该功能将在后续版本中开放，届时可查看与该强化符文同系列的其他符文</p>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {augment.notes && (
        <Card>
          <CardContent className="p-5">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">备注</h2>
            <p className="text-sm text-muted-foreground">{augment.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
