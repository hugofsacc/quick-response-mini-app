import React from 'react';
import { Shield, Activity, Zap, Bookmark, HeartPulse } from 'lucide-react';
import { ActiveTab } from '../types';

interface MobileDockProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenSomaticReset: () => void;
  savedCount: number;
}

export const MobileDock: React.FC<MobileDockProps> = ({
  activeTab,
  onSelectTab,
  onOpenSomaticReset,
  savedCount,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-xl pb-safe">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-1">
        {/* Tab 1: Audit */}
        <button
          onClick={() => onSelectTab('assessment')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            activeTab === 'assessment' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Audit Tab"
        >
          <Shield className="w-4 h-4 mb-1" />
          <span className="text-[10px] tracking-tight">Audit</span>
        </button>

        {/* Tab 2: Profile */}
        <button
          onClick={() => onSelectTab('diagnostic')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            activeTab === 'diagnostic' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Profile Tab"
        >
          <Activity className="w-4 h-4 mb-1" />
          <span className="text-[10px] tracking-tight">Profile</span>
        </button>

        {/* Center Action: 2-Min Reset */}
        <div className="flex items-center justify-center h-full">
          <button
            onClick={onOpenSomaticReset}
            className="w-11 h-11 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shadow-md shadow-emerald-400/30 active:scale-95 transition-transform"
            aria-label="2-Minute Reset"
            title="⚡ 2-min Reset"
          >
            <HeartPulse className="w-5 h-5 fill-slate-950 text-slate-950" />
          </button>
        </div>

        {/* Tab 3: Scripts */}
        <button
          onClick={() => onSelectTab('scripts')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            activeTab === 'scripts' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Scripts Tab"
        >
          <Zap className="w-4 h-4 mb-1" />
          <span className="text-[10px] tracking-tight">Scripts</span>
        </button>

        {/* Tab 4: Kit */}
        <button
          onClick={() => onSelectTab('kit')}
          className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            activeTab === 'kit' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="My Kit Tab"
        >
          <Bookmark className={`w-4 h-4 mb-1 ${savedCount > 0 ? 'fill-emerald-600 text-emerald-600' : ''}`} />
          <span className="text-[10px] tracking-tight">My Kit</span>
          {savedCount > 0 && (
            <span className="absolute top-2 right-4 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center">
              {savedCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
