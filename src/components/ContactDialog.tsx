import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { X, MessageCircle, Copy, Check } from 'lucide-react';

export function ContactDialog({ onClose }: { onClose: () => void }) {
  const [copiedWechat, setCopiedWechat] = useState(false);
  const [copiedQQ, setCopiedQQ] = useState(false);

  const copyText = (text: string, type: 'wechat' | 'qq') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'wechat') { setCopiedWechat(true); setTimeout(() => setCopiedWechat(false), 2000); }
      else { setCopiedQQ(true); setTimeout(() => setCopiedQQ(false), 2000); }
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <Card className="w-full max-w-sm mx-4 bg-card border-border shadow-2xl">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2"><MessageCircle className="h-5 w-5 text-primary" /> 联系我们</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
          </div>

          <div className="space-y-3">
            {/* WeChat */}
            <div className="p-3 rounded bg-secondary flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-emerald-400">微信</div>
                <div className="text-sm font-mono mt-0.5">QWEA_7984</div>
              </div>
              <button
                onClick={() => copyText('QWEA_7984', 'wechat')}
                className="text-xs px-2 py-1 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors flex items-center gap-1"
              >
                {copiedWechat ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copiedWechat ? '已复制' : '复制'}
              </button>
            </div>

            {/* QQ */}
            <div className="p-3 rounded bg-secondary flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-blue-400">QQ</div>
                <div className="text-sm font-mono mt-0.5">2738188635</div>
              </div>
              <button
                onClick={() => copyText('2738188635', 'qq')}
                className="text-xs px-2 py-1 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors flex items-center gap-1"
              >
                {copiedQQ ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copiedQQ ? '已复制' : '复制'}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
