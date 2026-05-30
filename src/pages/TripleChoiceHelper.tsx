import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AugmentCard } from '@/components/AugmentCard';
import { heroes } from '@/data/heroes';
import { augments } from '@/data/augments';
import { evaluateTripleChoice } from '@/lib/decision-engine';
import type { TripleChoiceResult, Priority } from '@/types';
import { HelpCircle, Sparkles } from 'lucide-react';

const PRIORITY_COLORS: Record<Priority, string> = {
  'recommended': 'border-emerald-400/30 bg-emerald-400/5',
  'optional': 'border-blue-400/30 bg-blue-400/5',
  'not-recommended': 'border-red-400/30 bg-red-400/5',
  'fun': 'border-purple-400/30 bg-purple-400/5',
};

const PRIORITY_LABELS: Record<Priority, string> = {
  'recommended': '推荐',
  'optional': '可选',
  'not-recommended': '不建议',
  'fun': '娱乐向',
};

const COMP_GAP_OPTIONS = ['缺前排', '缺控制', '缺清线', '缺保护', '全AD', '全AP'];

function ResultCard({ result }: { result: TripleChoiceResult }) {
  const augment = augments.find((a) => a.augmentId === result.augmentId);

  return (
    <Card className={`border ${result.synergyCombo ? 'border-amber-400/50 bg-amber-400/5' : PRIORITY_COLORS[result.priority]}`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {result.synergyCombo && (
              <span className="text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">
                连招协同
              </span>
            )}
            <span className="font-semibold">{PRIORITY_LABELS[result.priority]}</span>
            {augment && <span className="text-sm text-muted-foreground">| {augment.augmentNameCn}</span>}
          </div>
        </div>

        <p className="text-sm">{result.reason}</p>

        {result.synergyCombo && (
          <div className="p-3 rounded bg-amber-500/10 border border-amber-400/20 space-y-2">
            <p className="text-xs text-amber-400 font-medium">
              {result.synergyCombo.comboNameCn}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">{result.synergyCombo.comboReasonCn}</p>
            <div className="flex flex-wrap gap-1">
              {result.synergyCombo.requiredAugments.map(a => (
                <span key={a.augmentId} className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
                  {a.nameCn}
                </span>
              ))}
            </div>
            {result.synergyCombo.weaknessCn && (
              <p className="text-xs text-red-400/70">
                注意：{result.synergyCombo.weaknessCn}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>打法影响: {result.impactOnPlaystyle}</div>
          <div>装备方向: {result.recommendedItemDirection}</div>
          <div>数据依据: {result.sourceBasis}</div>
        </div>

        {augment && <AugmentCard augment={augment} compact />}
      </CardContent>
    </Card>
  );
}

export function TripleChoiceHelper() {
  const [heroKeyword, setHeroKeyword] = useState('');
  const [showHeroDropdown, setShowHeroDropdown] = useState(false);
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null);
  const [existingAugments, setExistingAugments] = useState<string[]>([]);
  const [existingSearch, setExistingSearch] = useState('');
  const [showExistingDropdown, setShowExistingDropdown] = useState(false);
  const [candidateInputs, setCandidateInputs] = useState<string[]>(['', '', '']);
  const [focusedCandidate, setFocusedCandidate] = useState<number | null>(null);
  const [compGaps, setCompGaps] = useState<string[]>([]);
  const [results, setResults] = useState<TripleChoiceResult[] | null>(null);

  const selectedHero = heroes.find((h) => h.heroId === selectedHeroId);

  const filteredHeroes = heroKeyword
    ? heroes.filter((h) =>
        h.heroNameCn.includes(heroKeyword) || h.heroTitleCn.includes(heroKeyword) || h.displayNameCn.includes(heroKeyword) || h.aliases.some((a) => a.includes(heroKeyword))
      )
    : [];

  const filteredAugments = (keyword: string) =>
    keyword
      ? augments.filter((a) =>
          a.augmentNameCn.includes(keyword) || a.augmentId.includes(keyword.toLowerCase())
        ).slice(0, 20)
      : augments.slice(0, 20);

  const handleAnalyze = () => {
    if (!selectedHeroId) return;

    // Existing augments already stored as IDs
    const existingIds = existingAugments;

    const candidateIds = candidateInputs
      .map((input) => input.trim())
      .filter(Boolean)
      .map((input) => {
        const found = augments.find((a) => a.augmentNameCn === input || a.augmentId === input);
        return found ? found.augmentId : input;
      });

    if (candidateIds.length === 0) return;

    const result = evaluateTripleChoice({
      heroId: selectedHeroId,
      existingAugmentIds: existingIds,
      candidateAugmentIds: candidateIds as [string, string, string],
      compGaps,
    });
    setResults(result);
  };

  const toggleCompGap = (gap: string) => {
    setCompGaps((prev) => (prev.includes(gap) ? prev.filter((g) => g !== gap) : [...prev, gap]));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-2">三选一强化助手</h1>
      <p className="text-sm text-muted-foreground mb-6">
        输入当前英雄和候选强化，获得透明、可理解的推荐理由。不假装给出绝对最优答案。
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium mb-2 block">1. 选择英雄</label>
            <div className="relative">
              <input
                type="text"
                value={heroKeyword}
                onChange={(e) => {
                  setHeroKeyword(e.target.value);
                  setShowHeroDropdown(true);
                }}
                onFocus={() => { if (heroKeyword) setShowHeroDropdown(true); }}
                onBlur={() => setTimeout(() => setShowHeroDropdown(false), 150)}
                placeholder="搜索英雄名称..."
                className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm"
              />
              {showHeroDropdown && heroKeyword && (
                <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded shadow-lg max-h-48 overflow-y-auto">
                  {filteredHeroes.map((hero) => (
                    <button
                      key={hero.heroId}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setSelectedHeroId(hero.heroId);
                        setHeroKeyword('');
                        setShowHeroDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-accent text-sm flex items-center gap-2"
                    >
                      <img src={hero.iconUrl} alt="" className="w-6 h-6 rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <span>{hero.displayNameCn}</span>
                      <span className={`text-xs px-1 rounded font-bold ml-auto ${hero.tierCode === 'S+' ? 'bg-yellow-500 text-black' : hero.tierCode === 'S' ? 'bg-red-500 text-white' : hero.tierCode === 'A' ? 'bg-orange-500 text-white' : 'bg-secondary text-muted-foreground'}`}>
                        {hero.tierCode}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedHero && (
              <div className="mt-2 flex items-center gap-2">
                <img src={selectedHero.iconUrl} alt="" className="w-8 h-8 rounded" />
                <span className="text-sm font-medium">{selectedHero.displayNameCn}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                  selectedHero.tierCode === 'S+' ? 'bg-yellow-500 text-black' :
                  selectedHero.tierCode === 'S' ? 'bg-red-500 text-white' :
                  selectedHero.tierCode === 'A' ? 'bg-orange-500 text-white' :
                  'bg-secondary text-muted-foreground'
                }`}>
                  {selectedHero.tierCode} {selectedHero.tierCn}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">2. 三个候选强化（本次刷出的三选一）</label>
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="relative">
                  <input
                    type="text"
                    value={candidateInputs[i]}
                    onChange={(e) => {
                      const next = [...candidateInputs];
                      next[i] = e.target.value;
                      setCandidateInputs(next);
                      setFocusedCandidate(i);
                    }}
                    onFocus={() => setFocusedCandidate(i)}
                    onBlur={() => setTimeout(() => setFocusedCandidate(null), 150)}
                    placeholder={`候选强化 ${i + 1}（输入名称搜索）`}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm"
                  />
                  {focusedCandidate === i && candidateInputs[i] && (
                    <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded shadow-lg max-h-32 overflow-y-auto">
                      {filteredAugments(candidateInputs[i]).map((a) => (
                        <button
                          key={a.augmentId}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            const next = [...candidateInputs];
                            next[i] = a.augmentNameCn;
                            setCandidateInputs(next);
                            setFocusedCandidate(null);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-accent text-xs"
                        >
                          {a.augmentNameCn} ({a.tier === 'Prismatic' ? '棱彩' : a.tier === 'Gold' ? '金色' : '银色'} · {a.winRate.toFixed(1)}%)
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">3. 已有强化（可选）</label>
            <p className="text-xs text-muted-foreground mb-2">搜索并添加已持有的强化符文，用于检测协同和连招</p>

            {existingAugments.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {existingAugments.map((augId) => {
                  const aug = augments.find((a) => a.augmentId === augId);
                  return (
                    <span key={augId} className="inline-flex items-center gap-1 text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      {aug?.augmentNameCn || augId}
                      <button onClick={() => setExistingAugments(prev => prev.filter(id => id !== augId))} className="hover:text-red-400 ml-0.5">×</button>
                    </span>
                  );
                })}
              </div>
            )}

            <div className="relative">
              <input
                type="text"
                value={existingSearch}
                onChange={(e) => { setExistingSearch(e.target.value); setShowExistingDropdown(true); }}
                onFocus={() => { if (existingSearch) setShowExistingDropdown(true); }}
                onBlur={() => setTimeout(() => setShowExistingDropdown(false), 150)}
                placeholder="搜索已有强化名称..."
                className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm"
              />
              {showExistingDropdown && existingSearch && (
                <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded shadow-lg max-h-32 overflow-y-auto">
                  {augments.filter((a) => a.augmentNameCn.includes(existingSearch) && !existingAugments.includes(a.augmentId)).slice(0, 15).map((a) => (
                    <button
                      key={a.augmentId}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { setExistingAugments(prev => [...prev, a.augmentId]); setExistingSearch(''); setShowExistingDropdown(false); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-accent text-xs"
                    >
                      {a.augmentNameCn} ({a.tier === 'Prismatic' ? '棱彩' : a.tier === 'Gold' ? '金色' : '银色'} · {a.winRate.toFixed(1)}%)
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">4. 阵容缺口（可选）</label>
            <div className="flex flex-wrap gap-1.5">
              {COMP_GAP_OPTIONS.map((gap) => (
                <button
                  key={gap}
                  onClick={() => toggleCompGap(gap)}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    compGaps.includes(gap)
                      ? 'bg-primary/30 text-primary border border-primary/50'
                      : 'bg-secondary text-muted-foreground border border-transparent hover:border-border'
                  }`}
                >
                  {gap}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleAnalyze} className="w-full" size="lg">
            <Sparkles className="h-4 w-4 mr-2" />
            分析推荐
          </Button>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">推荐结果</h2>
          {results === null ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <HelpCircle className="h-12 w-12 mb-4" />
              <p>选择英雄和候选强化后点击"分析推荐"</p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <HelpCircle className="h-12 w-12 mb-4" />
              <p>请至少输入一个候选强化</p>
            </div>
          ) : (
            results.map((result, i) => <ResultCard key={i} result={result} />)
          )}
        </div>
      </div>
    </div>
  );
}
