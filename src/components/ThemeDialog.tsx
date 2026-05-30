import { Card, CardContent } from '@/components/ui/card';
import { X, Sun, Moon } from 'lucide-react';

const THEME_KEY = 'hextech_theme';

export function getStoredTheme(): 'light' | 'dark' {
  try { return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'dark'; }
  catch { return 'dark'; }
}

export function applyTheme(theme: 'light' | 'dark') {
  if (theme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }
  localStorage.setItem(THEME_KEY, theme);
}

export function ThemeDialog({ onClose }: { onClose: () => void }) {
  const current = getStoredTheme();

  const select = (theme: 'light' | 'dark') => {
    applyTheme(theme);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <Card className="w-full max-w-sm mx-4 bg-card border-border shadow-2xl">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2"><Sun className="h-5 w-5 text-primary" /> 颜色</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => select('light')}
              className={`p-4 rounded-lg border-2 transition-all text-center ${current === 'light' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40 bg-secondary'}`}
            >
              <Sun className="h-8 w-8 mx-auto mb-2 text-amber-500" />
              <div className="font-medium text-sm">浅色</div>
              <div className="text-xs text-muted-foreground mt-0.5">明亮清爽</div>
            </button>

            <button
              onClick={() => select('dark')}
              className={`p-4 rounded-lg border-2 transition-all text-center ${current === 'dark' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40 bg-secondary'}`}
            >
              <Moon className="h-8 w-8 mx-auto mb-2 text-indigo-400" />
              <div className="font-medium text-sm">深色</div>
              <div className="text-xs text-muted-foreground mt-0.5">护眼沉浸</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
