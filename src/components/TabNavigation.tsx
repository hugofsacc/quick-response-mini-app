import React from 'react';
import { ActiveTab } from '../types';
import { Shield, Activity, Zap, Bookmark } from 'lucide-react';

interface TabNavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  savedCount: number;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; count?: number }[] = [
    {
      id: 'assessment',
      label: 'Self-Assessment',
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: 'diagnostic',
      label: 'Communication Profile',
      icon: <Activity className="w-4 h-4" />,
    },
    {
      id: 'scripts',
      label: 'Script Bank',
      icon: <Zap className="w-4 h-4" />,
    },
    {
      id: 'kit',
      label: 'My Kit',
      icon: <Bookmark className="w-4 h-4" />,
      count: savedCount,
    },
  ];

  return (
    <div className="w-full pt-4 pb-2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-1.5 bg-slate-200/70 rounded-2xl border border-slate-300/60">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center justify-center gap-2 py-3 px-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap min-h-[48px] ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                <span className={isActive ? 'text-emerald-400' : 'text-slate-500'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                      isActive
                        ? 'bg-emerald-400 text-slate-950'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
