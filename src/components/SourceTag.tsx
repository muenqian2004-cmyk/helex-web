import { Badge } from '@/components/ui/badge';
import type { SourceType } from '@/types';

const sourceConfig: Record<SourceType, { label: string; className: string }> = {
  official:   { label: '官方', className: 'bg-cyan-700 hover:bg-cyan-800' },
  community:  { label: '社区', className: 'bg-indigo-700 hover:bg-indigo-800' },
  inferred:   { label: '推断', className: 'bg-orange-700 hover:bg-orange-800' },
};

export function SourceTag({ type }: { type: SourceType }) {
  const config = sourceConfig[type];
  return <Badge className={`text-xs ${config.className}`}>{config.label}</Badge>;
}
