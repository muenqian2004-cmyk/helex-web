import { Badge } from '@/components/ui/badge';
import type { Confidence } from '@/types';

const confidenceConfig: Record<Confidence, { label: string; className: string }> = {
  high:   { label: '✓ 可信', className: 'bg-emerald-600 hover:bg-emerald-700' },
  medium: { label: '~ 较可信', className: 'bg-blue-600 hover:bg-blue-700' },
  low:    { label: '? 待确认', className: 'text-yellow-400 border-yellow-400' },
  unverified: { label: '⚠ 未验证', className: 'bg-gray-600 hover:bg-gray-700' },
};

export function ConfidenceBadge({ level }: { level: Confidence }) {
  const config = confidenceConfig[level];
  return <Badge className={`text-xs ${config.className}`}>{config.label}</Badge>;
}
