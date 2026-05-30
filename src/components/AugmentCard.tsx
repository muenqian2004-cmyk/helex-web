import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { TierBadge } from './TierBadge';
import type { Augment } from '@/types';

interface AugmentCardProps {
  augment: Augment;
  compact?: boolean;
  clickable?: boolean;
}

const STAGE_LABELS: Record<number, string> = {
  3: '开局',
  7: 'Lv6',
  11: 'Lv11',
  15: '后期',
};

export function AugmentCard({ augment, compact = false, clickable = false }: AugmentCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (clickable) {
      navigate(`/augments/${augment.augmentId}`);
    }
  };

  if (compact) {
    return (
      <Card className="bg-card hover:bg-accent transition-colors cursor-pointer" onClick={handleClick}>
        <CardContent className="p-3 flex items-center gap-3">
          <TierBadge tier={augment.tier} />
          <div className="flex-1 min-w-0">
            <span className="font-medium text-sm truncate">{augment.augmentNameCn}</span>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{augment.effect}</p>
          </div>
          {/* confidence removed */}
        </CardContent>
      </Card>
    );
  }

  const stageText = augment.availabilityStages
    .map((s) => STAGE_LABELS[s] || `Lv${s}`)
    .join(' / ');

  return (
    <Card
      className={`bg-card ${clickable ? 'hover:bg-accent cursor-pointer transition-colors' : ''}`}
      onClick={handleClick}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TierBadge tier={augment.tier} />
            <h3 className="text-lg font-semibold">{augment.augmentNameCn}</h3>
            <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
              {augment.winRate.toFixed(1)}% 胜率
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* source/confidence removed */}
          </div>
        </div>

        <p className="text-sm text-foreground">{augment.effect}</p>

        <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
          <span className="bg-secondary px-2 py-0.5 rounded">
            出现阶段: {stageText}
          </span>
        </div>

        {augment.notes && (
          <p className="text-xs text-muted-foreground border-t border-border pt-2">{augment.notes}</p>
        )}
      </CardContent>
    </Card>
  );
}
