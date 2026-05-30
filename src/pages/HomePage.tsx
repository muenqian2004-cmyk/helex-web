import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BookOpen, HelpCircle, Clock, Sparkles, Swords, Zap, Package, Calculator } from 'lucide-react';

const toolEntries = [
  {
    to: '/augments',
    icon: BookOpen,
    title: '强化百科',
    description: '浏览196张强化符文，查看效果、适合英雄和可信度',
    available: true,
  },
  {
    to: '/triple-choice',
    icon: HelpCircle,
    title: '三选一强化助手',
    description: '输入英雄和候选强化，获得透明的推荐和建议理由',
    available: true,
    highlight: true,
  },
  {
    to: '/versions',
    icon: Clock,
    title: '版本追踪',
    description: '追踪当前版本和关键改动，了解强化和英雄的版本变化',
    available: true,
  },
  {
    to: '/heroes',
    icon: Swords,
    title: '英雄速查卡',
    description: '查看英雄适合的强化类型和推荐装备方向',
    available: true,
  },
  {
    to: '/builds',
    icon: Sparkles,
    title: '强化驱动出装',
    description: '根据强化符文机制优先推荐装备，英雄定位兜底',
    available: true,
    highlight: true,
  },
  {
    to: '/invincible-combos',
    icon: Zap,
    title: '无敌套路',
    description: '收录高上限连招组合，附带核心机制解析和装备推荐',
    available: true,
    highlight: true,
  },
  {
    to: '/simulator',
    icon: Calculator,
    title: '模拟器',
    description: '瑞兹无限循环数值模拟，预测属性面板与循环因子',
    available: true,
    highlight: true,
  },
  {
    to: '/items',
    icon: Package,
    title: '装备查询',
    description: '浏览200件装备，查看属性、价格和合成路线',
    available: true,
  },
];

export function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3">Aerilia海克斯大乱斗工具</h1>
        <p className="text-muted-foreground">
          可信、清晰的决策工具。所有建议标注来源，不伪装客观最优。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {toolEntries.map((entry) => (
          <Card
            key={entry.to}
            className={`bg-card transition-colors ${
              entry.available
                ? entry.highlight
                  ? 'border-primary/50 hover:border-primary'
                  : 'hover:bg-accent'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <CardContent className="p-5">
              {entry.available ? (
                <Link to={entry.to} className="block">
                  <div className="flex items-start gap-3">
                    <entry.icon className={`h-6 w-6 mt-0.5 ${entry.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {entry.title}
                        {entry.highlight && (
                          <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">核心功能</span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{entry.description}</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="flex items-start gap-3">
                  <entry.icon className="h-6 w-6 mt-0.5 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      {entry.title}
                      <span className="text-xs bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">即将上线</span>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{entry.description}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/triple-choice"
          className={cn(buttonVariants({ size: 'lg' }), 'bg-primary hover:bg-primary/90')}
        >
          开始三选一强化选择 →
        </Link>
      </div>
    </div>
  );
}
