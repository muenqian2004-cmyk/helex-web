import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { X, Volume2, VolumeX } from 'lucide-react';
import {
  type AudioSettings,
  loadAudioSettings,
  saveAudioSettings,
} from '@/lib/welcomeAudio';

const LANGUAGES: Array<{ code: AudioSettings['language']; label: string; flag: string }> = [
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
];

export function AudioSettingsDialog({
  onClose,
  onSettingsChange,
}: {
  onClose: () => void;
  onSettingsChange?: (settings: AudioSettings) => void;
}) {
  const [settings, setSettings] = useState(loadAudioSettings());

  const applySettings = (next: AudioSettings) => {
    setSettings(next);
    saveAudioSettings(next);
    onSettingsChange?.(next);
  };

  const toggleEnabled = () => {
    const next = { ...settings, enabled: !settings.enabled };
    applySettings(next);
  };

  const selectLanguage = (lang: AudioSettings['language']) => {
    const next = { ...settings, language: lang };
    applySettings(next);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <Card className="w-full max-w-sm mx-4 bg-card border-border shadow-2xl">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-primary" /> 音效设置
            </h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-between p-3 rounded bg-secondary">
            <div className="flex items-center gap-2">
              {settings.enabled ? <Volume2 className="h-4 w-4 text-emerald-400" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
              <span className="text-sm">欢迎音效</span>
            </div>
            <button
              onClick={toggleEnabled}
              className={`relative w-11 h-6 rounded-full transition-colors ${settings.enabled ? 'bg-emerald-500' : 'bg-secondary border border-border'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${settings.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Language selection */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">通知语言</label>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => selectLanguage(lang.code)}
                  className={`p-2 rounded text-sm transition-all border ${
                    settings.language === lang.code
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-border bg-secondary text-muted-foreground hover:border-primary/40'
                  }`}
                >
                  <span className="text-lg block">{lang.flag}</span>
                  <span className="text-xs">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Current audio source info */}
          <div className="text-xs text-muted-foreground p-2 rounded bg-secondary/50">
            <p>当前音效文件: <code className="text-primary/70">/audio/welcome_{settings.language}.mp3</code></p>
            <p className="mt-1">音效将在进入欢迎页面时自动播放</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
