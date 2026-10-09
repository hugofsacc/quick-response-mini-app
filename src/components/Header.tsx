import React from 'react';
import { Zap, HeartPulse } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenSomaticReset: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenSomaticReset,
  savedCount,
}) => {
  return (
    <header className="relative w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      {/* Top Bar - Strictly adhering to 3-zone contract */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand wordmark as single text element */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('assessment')}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500/20 transition-colors">
              <HeartPulse className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
              Quick Response
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onSelectTab('assessment')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap min-h-[44px] flex items-center ${
              activeTab === 'assessment'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            1. Self-Assessment
          </button>
          <button
            onClick={() => onSelectTab('diagnostic')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap min-h-[44px] flex items-center ${
              activeTab === 'diagnostic'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            2. Communication Profile
          </button>
          <button
            onClick={() => onSelectTab('scripts')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap min-h-[44px] flex items-center ${
              activeTab === 'scripts'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            3. Script Bank
          </button>
          <button
            onClick={() => onSelectTab('kit')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap min-h-[44px] flex items-center gap-1.5 ${
              activeTab === 'kit'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <span>4. My Saved Scripts</span>
            {savedCount > 0 && (
              <span className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                activeTab === 'kit'
                  ? 'bg-emerald-400 text-slate-950'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSomaticReset}
            className="group relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-95 transition-all shadow-sm min-h-[44px] min-w-[44px]"
            title="Launch 2-Minute Calming Reset"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-700 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
            </span>
            <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
            <span className="whitespace-nowrap">⚡ 2-Min Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
