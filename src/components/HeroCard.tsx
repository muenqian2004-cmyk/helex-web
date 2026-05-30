import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Hero } from '@/types';

const TIER_COLORS: Record<string, string> = {
  'S+': 'bg-yellow-500 text-black',
  'S': 'bg-red-500 text-white',
  'A': 'bg-orange-500 text-white',
  'B': 'bg-green-500 text-white',
  'C': 'bg-gray-500 text-white',
};

interface HeroCardProps {
  hero: Hero;
}

export function HeroCard({ hero }: HeroCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Card className="bg-card">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          {imgError ? (
            <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center text-lg font-bold text-muted-foreground">
              {hero.heroNameCn[0]}
            </div>
          ) : (
            <img
              src={hero.iconUrl}
              alt={hero.heroNameCn}
              className="w-12 h-12 rounded"
              onError={() => setImgError(true)}
            />
          )}
          <div>
            <h3 className="font-semibold">{hero.displayNameCn}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${TIER_COLORS[hero.tierCode] || 'bg-secondary text-muted-foreground'}`}>
                {hero.tierCode}
              </span>
              <span className="text-xs text-muted-foreground">{hero.tierCn}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {hero.roles.map((role) => (
            <span key={role} className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">{role}</span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
