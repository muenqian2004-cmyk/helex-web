import { Badge } from '@/components/ui/badge';
import type { Tier } from '@/types';

const tierConfig: Record<Tier, string> = {
  Silver: 'bg-gray-500 hover:bg-gray-600',
  Gold: 'bg-amber-500 hover:bg-amber-600',
  Prismatic: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
};

export function TierBadge({ tier }: { tier: Tier }) {
  return <Badge className={`text-xs font-semibold ${tierConfig[tier]}`}>{tier}</Badge>;
}
