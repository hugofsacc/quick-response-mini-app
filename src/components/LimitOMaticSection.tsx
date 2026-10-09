import React, { useState, useMemo } from 'react';
import { Search, Zap, PlusCircle } from 'lucide-react';
import { CategoryType, ScriptItem, ToneType } from '../types';
import { ScriptCard } from './ScriptCard';
import { BANNER_IMAGES } from '../data/images';

interface LimitOMaticSectionProps {
  scripts: ScriptItem[];
  savedScriptIds: Set<string>;
  initialTone?: ToneType;
  onCopy: (text: string, title: string) => void;
  onToggleSave: (script: ScriptItem, tone: ToneType) => void;
  onGoToBuilder: () => void;
}

const CATEGORIES: { id: 'all' | CategoryType; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'work', label: '💼 Work', icon: '💼' },
  { id: 'family', label: '🏡 Family', icon: '🏡' },
  { id: 'couples', label: '❤️ Partner', icon: '❤️' },
  { id: 'friends', label: '👥 Friends', icon: '👥' },
  { id: 'digital', label: '📱 Digital', icon: '📱' },
];

const TONES_FILTER: { id: ToneType; label: string }[] = [
  { id: 'soft', label: '🌸 Soft' },
  { id: 'assertive', label: '⚖️ Balanced' },
  { id: 'firm', label: '🛑 Firm' },
  { id: 'steel', label: '🛡️ Unshakable' },
];

export const LimitOMaticSection: React.FC<LimitOMaticSectionProps> = ({
  scripts,
  savedScriptIds,
  initialTone = 'assertive',
  onCopy,
  onToggleSave,
  onGoToBuilder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | CategoryType>('all');
  const [activeTone, setActiveTone] = useState<ToneType>(initialTone);

  const filteredScripts = useMemo(() => {
    return scripts.filter((s) => {
      const matchesCategory =
        selectedCategory === 'all' || s.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchTag = s.scenarioTag.toLowerCase().includes(q);
      const matchContext = s.context.toLowerCase().includes(q);
      const matchTones = Object.values(s.tones).some((t) =>
        t.text.toLowerCase().includes(q)
      );

      return matchTitle || matchTag || matchContext || matchTones;
    });
  }, [scripts, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Photographic Banner matching 'baner 3 y bloques debajo.png' with enhanced brightness */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-300/80 p-6 sm:p-8 text-white min-h-[180px] sm:min-h-[200px] flex flex-col justify-between">
        {/* Full-bleed Photo Background - brighter & clear */}
        <img
          src={BANNER_IMAGES.phoneTyping}
          alt="Person typing on smartphone"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-115 contrast-105 saturate-105"
        />
        {/* Soft gradient scrim on left, leaves the person and phone clearly bright */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/15 pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-emerald-400 shrink-0 drop-shadow-md" />
              <h2
                className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.95)' }}
              >
                Límit-O-Matic
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase tracking-wide shadow-md">
                100% Guilt-Free
              </span>
            </div>
            <p
              className="text-xs sm:text-sm text-white/95 leading-relaxed font-medium"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,0.95)' }}
            >
              Configure the recipient and the tone intensity to find your assertive text ready to copy and send.
            </p>
          </div>

          <button
            onClick={onGoToBuilder}
            className="px-4 py-2 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-1.5 shrink-0 active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>Create Script</span>
          </button>
        </div>
      </div>

      {/* Two Control Selector Cards matching 'baner 3 y bloques debajo.png' */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: 1. DESTINATARIO DEL MENSAJE */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            1. Message Recipient
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] flex items-center gap-1.5 border ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card 2: 2. INTENSIDAD DEL LÍMITE */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            2. Limit Intensity
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TONES_FILTER.map((t) => {
              const isActive = activeTone === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTone(t.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] flex items-center justify-center border text-center ${
                    isActive
                      ? t.id === 'assertive'
                        ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                        : t.id === 'firm'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : t.id === 'steel'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter scripts by keyword (e.g. 'slack', 'silent', 'family', 'favor', 'rest')..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs transition-all min-h-[46px]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-800"
          >
            Clear
          </button>
        )}
      </div>

      {/* Script Results */}
      <div className="space-y-4">
        {filteredScripts.length > 0 ? (
          filteredScripts.map((script) => (
            <ScriptCard
              key={script.id}
              script={script}
              defaultTone={activeTone}
              isSaved={savedScriptIds.has(script.id)}
              onCopy={onCopy}
              onToggleSave={onToggleSave}
            />
          ))
        ) : (
          <div className="p-12 text-center rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <p className="text-sm text-slate-700 font-bold">No scripts match your search criteria.</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try a different keyword or create your own custom response using our 3-step response builder.
            </p>
            <button
              onClick={onGoToBuilder}
              className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-xs"
            >
              Launch Custom Script Builder
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
