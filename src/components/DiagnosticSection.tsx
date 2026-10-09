import React, { useState } from 'react';
import { DiagnosticResult, ToneType } from '../types';
import { Flame, ShieldCheck, ArrowRight, RotateCcw, Trash2, Sparkles } from 'lucide-react';
import { BANNER_IMAGES } from '../data/images';

interface DiagnosticSectionProps {
  diagnostic: DiagnosticResult;
  onGoToScripts: (tonePreference?: ToneType) => void;
  onRetakeAssessment: () => void;
}

export const DiagnosticSection: React.FC<DiagnosticSectionProps> = ({
  diagnostic,
  onGoToScripts,
  onRetakeAssessment,
}) => {
  const {
    score,
    maxScore,
    symptomCount,
    cortisolLoadPercent,
    autonomyIndexPercent,
    tierTitle,
    summary,
    physicalManifestations,
    emotionalDynamics,
    recommendedTone,
  } = diagnostic;

  const [thoughtInput, setThoughtInput] = useState('');
  const [thoughtBurned, setThoughtBurned] = useState(false);

  const handleBurnThought = () => {
    if (!thoughtInput.trim()) return;
    setThoughtBurned(true);
    setTimeout(() => {
      setThoughtInput('');
      setThoughtBurned(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Photographic Banner matching 'baner 2 muestra.png' with enhanced brightness */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-300/80 p-6 sm:p-8 text-white min-h-[180px] sm:min-h-[200px] flex flex-col justify-between">
        {/* Full-bleed Photo Background - brighter & clear */}
        <img
          src={BANNER_IMAGES.relationalStress}
          alt="Hands holding smartphone reviewing messages"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-115 contrast-105 saturate-105"
        />
        {/* Soft gradient scrim on left, leaves the phone and hands brightly visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/15 pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <span
              className="text-[11px] font-bold tracking-widest text-emerald-300 uppercase"
              style={{ textShadow: '0 2px 6px rgba(0,0,0,0.85)' }}
            >
              Personal Report
            </span>
            <h2
              className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.95)' }}
            >
              Communication Profile &amp; Pressure Report
            </h2>
            <p
              className="text-xs sm:text-sm text-white/95 leading-relaxed font-medium"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,0.95)' }}
            >
              {summary}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3.5 py-1.5 rounded-full bg-black/65 backdrop-blur-md text-amber-300 border border-white/20 text-xs font-bold tracking-tight shadow-md">
              {tierTitle.split(':')[0]} ({score}/{maxScore} pts)
            </span>
            <button
              onClick={onRetakeAssessment}
              className="p-2 rounded-full bg-black/65 hover:bg-black/85 text-slate-200 hover:text-white border border-white/20 transition-colors shadow-md backdrop-blur-md"
              title="Retake Audit"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Two Metric Cards matching reference */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Metric Card 1: Conversational Pressure */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Conversational Pressure Load
              </span>
            </div>
            <span className="text-xl font-bold font-mono tabular-nums text-rose-600">
              {cortisolLoadPercent}%
            </span>
          </div>

          {/* Color Gradient Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div
              className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500"
              style={{ width: `${cortisolLoadPercent}%` }}
            />
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {cortisolLoadPercent > 70
              ? 'High sustained pressure: You frequently anticipate conflict or disappointment, leading you to over-accommodate.'
              : cortisolLoadPercent > 40
              ? 'Moderate pressure: You absorb extra strain to keep interactions smooth, often second-guessing yourself afterward.'
              : 'Grounded baseline: Low internal strain; you feel comfortable stating your limits without long rumination.'}
          </p>

          {/* Yellow-tinted inner box */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-2 text-slate-800">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 uppercase tracking-wide text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Physical &amp; Emotional Reactions</span>
            </div>
            <p>
              <strong>Physically:</strong> {physicalManifestations[0]}
            </p>
            <p>
              <strong>Emotionally:</strong> {emotionalDynamics[0]}
            </p>
            <p className="text-slate-600 pt-1 border-t border-amber-200/60 text-[11px]">
              <strong>Summary:</strong> Having ready-to-use scripts eliminates the panic of having to formulate responses under pressure.
            </p>
          </div>
        </div>

        {/* Metric Card 2: Clarity & Confidence */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Communication Clarity &amp; Ease
              </span>
            </div>
            <span className="text-xl font-bold font-mono tabular-nums text-emerald-600">
              {autonomyIndexPercent}%
            </span>
          </div>

          {/* Teal Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div
              className="h-full rounded-full transition-all duration-700 bg-emerald-500"
              style={{ width: `${autonomyIndexPercent}%` }}
            />
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {autonomyIndexPercent < 40
              ? 'High improvisation hurdle: When caught off guard, having pre-crafted responses removes the panic of over-explaining.'
              : autonomyIndexPercent < 75
              ? 'Growing confidence: You know what you want to communicate, but benefit from tested words that prevent giving in.'
              : 'Grounded ease: You communicate directly with warmth, clarity, and peace of mind.'}
          </p>

          {/* Teal-tinted inner box */}
          <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200/80 text-xs space-y-2 text-slate-800">
            <div className="flex items-center gap-1.5 font-bold text-teal-900 uppercase tracking-wide text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              <span>Clarity &amp; Boundary Practice</span>
            </div>
            <p>
              <strong>Habits:</strong> {physicalManifestations[1] || 'Steady, unhurried pace'}
            </p>
            <p>
              <strong>Mindset:</strong> {emotionalDynamics[1] || 'Holding boundaries without guilt'}
            </p>
            <p className="text-slate-600 pt-1 border-t border-teal-200/60 text-[11px]">
              <strong>Summary:</strong> Communicating limits clearly protects both your energy and the genuine respect of the relationship.
            </p>
          </div>
        </div>
      </div>

      {/* Overthinking Release Ritual matching 'complemento 2 baner 2.png' */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-500" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Ritual: Overthinking &amp; Worry Release
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 rounded-md px-2.5 py-0.5 uppercase tracking-wide">
            Emotional Release
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Overthinking happens when your mind fixates on variables you cannot control. Type that anxious thought here and release it digitally.
        </p>

        <div className="relative">
          <textarea
            rows={3}
            value={thoughtInput}
            onChange={(e) => setThoughtInput(e.target.value)}
            placeholder="e.g. 'I'm terrified they will be angry with me if I decline this weekend and they will freeze me out...'"
            className={`w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all font-mono ${
              thoughtBurned ? 'opacity-0 scale-95 transition-all duration-700' : 'opacity-100'
            }`}
          />
        </div>

        <div className="flex items-center justify-end">
          <button
            onClick={handleBurnThought}
            disabled={!thoughtInput.trim() || thoughtBurned}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs min-h-[44px] ${
              !thoughtInput.trim()
                ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-500'
                : 'bg-rose-500 hover:bg-rose-400 text-white active:scale-95'
            }`}
          >
            <span>🔥 Release Thought</span>
          </button>
        </div>
      </div>

      {/* Dark Navy Action Banner matching 'complemento del baner 2 con footer.png' */}
      <div className="p-6 sm:p-7 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 font-bold text-base sm:text-lg text-white">
            <span className="text-emerald-400">⚡</span>
            <span>Immediate Solution: Tested Script Bank</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            Replace hesitation with tested phrases that communicate firmness without aggression.
          </p>
        </div>

        <button
          onClick={() => onGoToScripts(recommendedTone)}
          className="px-6 py-3 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95 flex items-center gap-2 shrink-0 min-h-[44px]"
        >
          <span>Open Script Bank</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </button>
      </div>
    </div>
  );
};
