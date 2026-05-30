import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { heroes } from '@/data/heroes';
import { augments } from '@/data/augments';
import { X, Send } from 'lucide-react';

const DRAFT_KEY = 'hextech_submit_draft';

interface Draft {
  heroId: string;
  augmentIds: string[];
  itemNames: string;
}

function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveDraft(d: Draft) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

const MAX_AUGMENTS = 3;

export function SubmitDialog({ onClose }: { onClose: () => void }) {
  const draft = loadDraft();
  const [heroKeyword, setHeroKeyword] = useState('');
  const [showHeroDropdown, setShowHeroDropdown] = useState(false);
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(draft?.heroId || null);
  const [augmentKeyword, setAugmentKeyword] = useState('');
  const [showAugDropdown, setShowAugDropdown] = useState(false);
  const [selectedAugIds, setSelectedAugIds] = useState<string[]>(draft?.augmentIds || []);
  const [itemNames, setItemNames] = useState(draft?.itemNames || '');

  const selectedHero = heroes.find(h => h.heroId === selectedHeroId);

  useEffect(() => {
    if (selectedHeroId) {
      saveDraft({ heroId: selectedHeroId, augmentIds: selectedAugIds, itemNames });
    }
  }, [selectedHeroId, selectedAugIds, itemNames]);

  const heroFiltered = heroKeyword
    ? heroes.filter(h => h.heroNameCn.includes(heroKeyword) || h.heroTitleCn.includes(heroKeyword) || h.displayNameCn.includes(heroKeyword) || h.aliases.some(a => a.includes(heroKeyword)))
    : [];

  const augFiltered = augmentKeyword
    ? augments.filter(a => a.augmentNameCn.includes(augmentKeyword) && !selectedAugIds.includes(a.augmentId)).slice(0, 15)
    : [];

  const canSubmit = selectedHeroId && selectedAugIds.length > 0;

  const addAugment = (augId: string) => {
    if (selectedAugIds.length >= MAX_AUGMENTS) return;
    setSelectedAugIds(prev => [...prev, augId]);
    setAugmentKeyword('');
    setShowAugDropdown(false);
  };

  const removeAugment = (augId: string) => {
    setSelectedAugIds(prev => prev.filter(id => id !== augId));
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    const heroName = selectedHero?.displayNameCn || selectedHeroId;
    const augNames = selectedAugIds.map(id => {
      const a = augments.find(x => x.augmentId === id);
      return a ? a.augmentNameCn : id;
    }).join('、');
    const subject = `Aerilia海克斯大乱斗工具-投稿：${heroName} + ${augNames}`;
    const body = `英雄：${heroName}%0D%0A强化符文：${augNames}%0D%0A推荐装备：${itemNames || '无'}%0D%0A%0D%0A请在此补充其他说明：`;
    window.open(`mailto:2738188635@qq.com?subject=${encodeURIComponent(subject)}&body=${body}`, '_blank');
    clearDraft();
    onClose();
  };

  const handleCancel = () => {
    if (selectedHeroId) {
      saveDraft({ heroId: selectedHeroId, augmentIds: selectedAugIds, itemNames });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) handleCancel(); }}>
      <Card className="w-full max-w-md mx-4 bg-card border-border shadow-2xl">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2"><Send className="h-5 w-5 text-primary" /> 投稿</h2>
            <button onClick={handleCancel} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
          </div>

          {/* Hero */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">英雄 <span className="text-red-400">*</span></label>
            <div className="relative">
              {selectedHero ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded text-sm">
                  <img src={selectedHero.iconUrl} className="w-6 h-6 rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <span>{selectedHero.displayNameCn}</span>
                  <button onClick={() => setSelectedHeroId(null)} className="ml-auto text-muted-foreground hover:text-red-400"><X className="h-4 w-4" /></button>
                </div>
              ) : (
                <>
                  <input type="text" value={heroKeyword} onChange={(e) => { setHeroKeyword(e.target.value); setShowHeroDropdown(true); }}
                    onFocus={() => { if (heroKeyword) setShowHeroDropdown(true); }}
                    onBlur={() => setTimeout(() => setShowHeroDropdown(false), 150)}
                    placeholder="搜索英雄名称..." className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm" />
                  {showHeroDropdown && heroKeyword && (
                    <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded shadow-lg max-h-48 overflow-y-auto">
                      {heroFiltered.map((h) => (
                        <button key={h.heroId} onMouseDown={(e) => e.preventDefault()}
                          onClick={() => { setSelectedHeroId(h.heroId); setHeroKeyword(''); setShowHeroDropdown(false); }}
                          className="w-full text-left px-3 py-2 hover:bg-accent text-sm flex items-center gap-2">
                          <img src={h.iconUrl} className="w-6 h-6 rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          <span>{h.displayNameCn}</span>
                          <span className={`text-xs px-1 rounded ml-auto ${h.tierCode === 'S+' ? 'bg-yellow-500 text-black' : h.tierCode === 'S' ? 'bg-red-500 text-white' : 'bg-secondary text-muted-foreground'}`}>{h.tierCode}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Augments (up to 3) */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              强化符文 <span className="text-red-400">*</span>
              <span className="text-xs text-muted-foreground ml-1">（最多 {MAX_AUGMENTS} 个，已选 {selectedAugIds.length}/{MAX_AUGMENTS}）</span>
            </label>

            {/* Selected chips */}
            {selectedAugIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {selectedAugIds.map((augId) => {
                  const a = augments.find(x => x.augmentId === augId);
                  return (
                    <span key={augId} className="inline-flex items-center gap-1 text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      {a?.augmentNameCn || augId}
                      <button onClick={() => removeAugment(augId)} className="hover:text-red-400 ml-0.5">×</button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Search input (hidden when max reached) */}
            {selectedAugIds.length < MAX_AUGMENTS && (
              <div className="relative">
                <input type="text" value={augmentKeyword} onChange={(e) => { setAugmentKeyword(e.target.value); setShowAugDropdown(true); }}
                  onFocus={() => { if (augmentKeyword) setShowAugDropdown(true); }}
                  onBlur={() => setTimeout(() => setShowAugDropdown(false), 150)}
                  placeholder="搜索强化符文名称..." className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm" />
                {showAugDropdown && augmentKeyword && (
                  <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded shadow-lg max-h-48 overflow-y-auto">
                    {augFiltered.map((a) => (
                      <button key={a.augmentId} onMouseDown={(e) => e.preventDefault()}
                        onClick={() => addAugment(a.augmentId)}
                        className="w-full text-left px-3 py-2 hover:bg-accent text-sm flex items-center gap-2">
                        {a.iconUrl && <img src={a.iconUrl} className="w-6 h-6 rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                        <span>{a.augmentNameCn}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{a.tier === 'Prismatic' ? '棱彩' : a.tier === 'Gold' ? '金色' : '银色'} · {a.winRate.toFixed(1)}%</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Items (optional) */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">推荐装备 <span className="text-xs text-muted-foreground">（选填）</span></label>
            <input type="text" value={itemNames} onChange={(e) => setItemNames(e.target.value)}
              placeholder="装备名称，用逗号分隔..." className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm" />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button onClick={handleCancel} className="flex-1 px-4 py-2 rounded border border-border text-sm hover:bg-secondary transition-colors">取消</button>
            <button onClick={handleSubmit} disabled={!canSubmit}
              className={`flex-1 px-4 py-2 rounded text-sm font-medium transition-colors ${canSubmit ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary text-muted-foreground cursor-not-allowed'}`}>
              确定
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
