import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = '暂无匹配数据',
  description = '尝试使用其他关键词或筛选条件',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <SearchX className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
