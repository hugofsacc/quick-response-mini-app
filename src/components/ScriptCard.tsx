import React, { useState } from 'react';
import { Copy, Check, Bookmark, Lightbulb, Wind } from 'lucide-react';
import { ScriptItem, ToneType } from '../types';

interface ScriptCardProps {
  script: ScriptItem;
  defaultTone?: ToneType;
  isSaved: boolean;
  onCopy: (text: string, title: string) => void;
  onToggleSave: (script: ScriptItem, tone: ToneType) => void;
}

const TONE_CONFIGS: { type: ToneType; label: string; activeClass: string }[] = [
  { type: 'soft', label: '🌸 Soft', activeClass: 'bg-emerald-600 text-white' },
  { type: 'assertive', label: '⚖️ Balanced', activeClass: 'bg-sky-500 text-white' },
  { type: 'firm', label: '🛑 Firm', activeClass: 'bg-amber-600 text-white' },
  { type: 'steel', label: '🛡️ Unshakable', activeClass: 'bg-slate-900 text-white' },
];

export const ScriptCard: React.FC<ScriptCardProps> = ({
  script,
  defaultTone = 'assertive',
  isSaved,
  onCopy,
  onToggleSave,
}) => {
  const [selectedTone, setSelectedTone] = useState<ToneType>(defaultTone);
  const [hasCopied, setHasCopied] = useState(false);

  const activeVariant = script.tones[selectedTone];
  const tipText = activeVariant.tipNote || activeVariant.clinicalNote;

  const handleCopy = () => {
    onCopy(activeVariant.text, script.title);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
      {/* Top Meta Line matching reference */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              selectedTone === 'assertive'
                ? 'bg-sky-500'
                : selectedTone === 'soft'
                ? 'bg-emerald-500'
                : selectedTone === 'firm'
                ? 'bg-amber-500'
                : 'bg-slate-900'
            }`}
          />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {script.title}
          </span>
        </div>
        <span
          className={`text-[11px] font-bold border rounded-md px-2.5 py-0.5 uppercase tracking-wide ${
            selectedTone === 'assertive'
              ? 'text-sky-800 bg-sky-50 border-sky-200/80'
              : selectedTone === 'soft'
              ? 'text-emerald-800 bg-emerald-50 border-emerald-200/80'
              : selectedTone === 'firm'
              ? 'text-amber-800 bg-amber-50 border-amber-200/80'
              : 'text-slate-800 bg-slate-100 border-slate-200'
          }`}
        >
          {script.category} · {selectedTone}
        </span>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        {script.context}
      </p>

      {/* Tone Intensity Buttons matching '2. INTENSIDAD DEL LÍMITE' */}
      <div className="space-y-1.5 pt-1">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Select Tone:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TONE_CONFIGS.map((cfg) => {
            const isActive = selectedTone === cfg.type;
            return (
              <button
                key={cfg.type}
                onClick={() => setSelectedTone(cfg.type)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center min-h-[40px] flex items-center justify-center border ${
                  isActive
                    ? `${cfg.activeClass} shadow-xs border-transparent`
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Script Box in soft gray container */}
      <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-900 text-sm sm:text-base font-serif italic leading-relaxed select-all">
        &ldquo;{activeVariant.text}&rdquo;
      </div>

      {/* Somatic/Calm Anchor Mint Box matching 'complemento 1 baner 2.png' */}
      <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-2">
        <Wind className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-emerald-900">Pre-Response Grounding:</strong>{' '}
          <span className="text-emerald-800">{script.somaticCue}</span>
        </div>
      </div>

      {/* Bottom Bar: Tip + Bookmark + Copy Button */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>
            <strong>Communication Tip:</strong> {tipText || 'Direct, polite, and without excuses.'}
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={() => onToggleSave(script, selectedTone)}
            className={`p-2.5 rounded-full border transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center ${
              isSaved
                ? 'bg-amber-100 border-amber-300 text-amber-800'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
            }`}
            title={isSaved ? 'Saved in Kit' : 'Save to Kit'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
          </button>

          <button
            onClick={handleCopy}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all min-h-[40px] shadow-xs ${
              hasCopied
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95'
            }`}
          >
            {hasCopied ? (
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
    </div>
  );
};
