import React, { useState } from 'react';
import { ScriptItem } from '../types';
import { Bookmark, Copy, Trash2, Download, Plus, Check } from 'lucide-react';
import { CustomScriptBuilder } from './CustomScriptBuilder';
import { BANNER_IMAGES } from '../data/images';

interface KitSectionProps {
  savedScripts: ScriptItem[];
  onRemoveFromKit: (scriptId: string) => void;
  onCopy: (text: string, title: string) => void;
  onSaveCustomScript: (script: ScriptItem) => void;
  onGoToBank: () => void;
}

export const KitSection: React.FC<KitSectionProps> = ({
  savedScripts,
  onRemoveFromKit,
  onCopy,
  onSaveCustomScript,
}) => {
  const [showBuilder, setShowBuilder] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredSaved = savedScripts.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.scenarioTag.toLowerCase().includes(q) ||
      Object.values(s.tones).some((t) => t.text.toLowerCase().includes(q))
    );
  });

  const handleCopySingle = (text: string, title: string, id: string) => {
    onCopy(text, title);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportAll = () => {
    if (savedScripts.length === 0) return;

    let content = `========================================================\n`;
    content += `QUICK RESPONSE: PERSONAL SCRIPT TOOLKIT\n`;
    content += `The right words, right when you need them.\n`;
    content += `Exported: ${new Date().toLocaleDateString()}\n`;
    content += `========================================================\n\n`;

    savedScripts.forEach((script, idx) => {
      content += `[${idx + 1}] ${script.title.toUpperCase()}\n`;
      content += `Category: ${script.category} | Scenario: ${script.scenarioTag}\n`;
      content += `Situation Context: ${script.context}\n`;
      content += `Pre-Response Grounding: ${script.somaticCue}\n\n`;

      if (script.isCustom) {
        content += `Response Script:\n"${script.tones.assertive.text}"\n\n`;
      } else {
        content += `Tone Variations:\n`;
        content += `• Soft: "${script.tones.soft.text}"\n\n`;
        content += `• Balanced: "${script.tones.assertive.text}"\n\n`;
        content += `• Firm: "${script.tones.firm.text}"\n\n`;
        content += `• Unshakable: "${script.tones.steel.text}"\n\n`;
      }
      content += `--------------------------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quick-response-toolkit-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Photographic Banner matching 'menú con solapas y baner 4.png' with enhanced brightness */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-300/80 p-6 sm:p-8 text-white min-h-[180px] sm:min-h-[200px] flex flex-col justify-between">
        {/* Full-bleed Photo Background - brighter & vivid */}
        <img
          src={BANNER_IMAGES.notepadChecklist}
          alt="Notebook checklist with pen"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-115 contrast-105 saturate-105"
        />
        {/* Soft gradient scrim on left, leaves the journal and table bright on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/15 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-emerald-400 shrink-0 drop-shadow-md" />
              <h2
                className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.95)' }}
              >
                My Saved Scripts Toolkit
              </h2>
            </div>
            <p
              className="text-xs sm:text-sm text-white/95 leading-relaxed font-medium"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,0.95)' }}
            >
              {savedScripts.length} scripts saved for direct access.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved..."
              className="px-3.5 py-2 rounded-full bg-black/65 backdrop-blur-md border border-white/25 text-white placeholder:text-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400 min-w-[150px] shadow-sm"
            />

            <button
              onClick={() => setShowBuilder(true)}
              className="px-4 py-2 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 min-h-[36px]"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Create Script</span>
            </button>

            {savedScripts.length > 0 && (
              <button
                onClick={handleExportAll}
                className="p-2 rounded-full bg-black/65 hover:bg-black/85 text-slate-200 hover:text-white border border-white/20 transition-colors shadow-sm backdrop-blur-md"
                title="Download .TXT backup"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Builder Modal or Section */}
      {showBuilder && (
        <CustomScriptBuilder
          onSaveToKit={(script) => {
            onSaveCustomScript(script);
            setShowBuilder(false);
          }}
          onClose={() => setShowBuilder(false)}
        />
      )}

      {/* Saved Scripts List */}
      <div className="space-y-4">
        {filteredSaved.length > 0 ? (
          filteredSaved.map((script) => {
            const defaultText =
              script.tones.assertive?.text ||
              script.tones.firm?.text ||
              script.tones.soft?.text ||
              '';

            return (
              <div
                key={script.id}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                      <span className="text-emerald-700 font-bold uppercase tracking-wider">{script.scenarioTag}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{script.category}</span>
                      {script.isCustom && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-600 font-medium">Custom</span>
                        </>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-slate-900">
                      {script.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => onRemoveFromKit(script.id)}
                    className="text-slate-400 hover:text-rose-500 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                    title="Remove from saved kit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-900 font-serif italic leading-relaxed select-all">
                  &ldquo;{defaultText}&rdquo;
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-500">
                  <div className="text-[11px] max-w-md">
                    <strong>Tip:</strong> {script.somaticCue}
                  </div>

                  <button
                    onClick={() => handleCopySingle(defaultText, script.title, script.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                      copiedId === script.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95'
                    }`}
                  >
                    {copiedId === script.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Script</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          /* Empty State matching 'menú con solapas y baner 4.png' */
          <div className="p-16 text-center rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4 max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Bookmark className="w-7 h-7 stroke-[1.5]" />
            </div>

            <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              You haven&apos;t saved any scripts to your kit yet. Explore the script bank or self-assessment to save your favorites.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setShowBuilder(true)}
                className="text-emerald-700 hover:text-emerald-800 font-bold text-xs sm:text-sm inline-flex items-center gap-1"
              >
                <span>+ Create Custom Script</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
