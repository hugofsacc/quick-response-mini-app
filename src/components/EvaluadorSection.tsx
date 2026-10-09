import React from 'react';
import { Shield, Check, ArrowRight, RotateCcw, Activity } from 'lucide-react';
import { ASSESSMENT_QUESTIONS } from '../data/scripts';
import { SomaticSymptoms } from '../types';
import { BANNER_IMAGES } from '../data/images';

interface EvaluadorSectionProps {
  answers: Record<number, number>;
  symptoms: SomaticSymptoms;
  onAnswerChange: (questionId: number, points: number) => void;
  onSymptomToggle: (key: keyof SomaticSymptoms) => void;
  onViewDiagnostic: () => void;
  onReset: () => void;
}

const SYMPTOM_ITEMS: { key: keyof SomaticSymptoms; label: string; somaticDescription: string }[] = [
  {
    key: 'jawTension',
    label: 'Clenching teeth or jaw tightness',
    somaticDescription: 'Holding tension in the jaw when you want to speak up but hold back.',
  },
  {
    key: 'shoulderTightness',
    label: 'Shoulder and neck stiffness',
    somaticDescription: 'Carrying the stress and responsibility of keeping other people happy.',
  },
  {
    key: 'rumination',
    label: 'Replaying past conversations in your head',
    somaticDescription: 'Re-analyzing what you said or mentally rehearsing how to say no without upset.',
  },
  {
    key: 'overApologizing',
    label: 'Apologizing before stating a simple need',
    somaticDescription: 'Starting messages with "I\'m so sorry, but..." just to soften a completely normal limit.',
  },
  {
    key: 'rescuingReflex',
    label: 'Taking on extra favors at your own expense',
    somaticDescription: 'Bailing out friends or family members even when your own calendar and energy are empty.',
  },
];

export const EvaluadorSection: React.FC<EvaluadorSectionProps> = ({
  answers,
  symptoms,
  onAnswerChange,
  onSymptomToggle,
  onViewDiagnostic,
  onReset,
}) => {
  const questionsAnswered = Object.keys(answers).length;
  const activeSymptomCount = Object.values(symptoms).filter(Boolean).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Photographic Banner matching 'baner 1 y menú con pregunta 1.png' with enhanced brightness */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-300/80 p-6 sm:p-8 text-white min-h-[180px] sm:min-h-[200px] flex flex-col justify-between">
        {/* Full-bleed Photo Background - brighter & vivid */}
        <img
          src={BANNER_IMAGES.fountainPen}
          alt="Fountain pen nib writing on textured paper"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-115 contrast-105 saturate-105"
        />
        {/* Soft left-aligned shadow scrim, leaves nib and warm paper bright on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/15 pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400 shrink-0 drop-shadow-md" />
              <h2
                className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.95)' }}
              >
                Self-Assessment &amp; Boundaries
              </h2>
            </div>
            <p
              className="text-xs sm:text-sm text-white/95 leading-relaxed font-medium"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,0.95)' }}
            >
              Select the responses that best describe your natural reaction to see where conversational strain is building up in your day-to-day life.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3.5 py-1.5 rounded-full bg-black/65 backdrop-blur-md text-white border border-white/20 text-xs font-bold font-mono tracking-tight shadow-md">
              {questionsAnswered} / {ASSESSMENT_QUESTIONS.length} Completed
            </span>
            <button
              onClick={onReset}
              className="p-2 rounded-full bg-black/65 hover:bg-black/85 text-slate-200 hover:text-white border border-white/20 transition-colors shadow-md backdrop-blur-md"
              title="Reset Audit"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Clean White Question Cards matching reference */}
      <div className="space-y-5">
        {ASSESSMENT_QUESTIONS.map((question, qIdx) => {
          const selectedValue = answers[question.id];

          return (
            <div
              key={question.id}
              className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-100">
                <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase">
                  QUESTION 0{qIdx + 1}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 rounded-md px-2.5 py-0.5 uppercase tracking-wide">
                  {question.categoryLabel}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {question.prompt}
              </h3>

              {/* Options matching reference */}
              <div className="grid grid-cols-1 gap-2.5 pt-1">
                {question.options.map((option) => {
                  const isSelected = selectedValue === option.points;

                  return (
                    <button
                      key={option.id}
                      onClick={() => onAnswerChange(question.id, option.points)}
                      className={`w-full text-left p-4 rounded-xl border transition-all text-sm flex items-center justify-between gap-3 min-h-[50px] ${
                        isSelected
                          ? 'border-2 border-emerald-500 bg-emerald-50/40 text-slate-900 font-medium shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <span className="leading-relaxed text-xs sm:text-sm">{option.text}</span>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Physical Tension Signals Card */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wide">
              <Activity className="w-4 h-4" />
              <span>Physical Tension Signals</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Where Tension Shows Up in Your Body
            </h3>
            <p className="text-xs text-slate-500">
              Select the physical habits you notice when facing uncomfortable conversations or requests:
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full shrink-0">
            {activeSymptomCount} of 5 selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {SYMPTOM_ITEMS.map((item) => {
            const isChecked = symptoms[item.key];

            return (
              <button
                key={item.key}
                onClick={() => onSymptomToggle(item.key)}
                className={`text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 min-h-[52px] ${
                  isChecked
                    ? 'bg-amber-50/50 border-amber-300 text-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isChecked
                      ? 'border-amber-600 bg-amber-500 text-white'
                      : 'border-slate-300 bg-white text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs sm:text-sm font-semibold leading-snug">{item.label}</p>
                  <p className="text-[11px] text-slate-500 leading-normal">{item.somaticDescription}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA to View Diagnostic Profile */}
      <div className="text-center pt-2">
        <button
          onClick={onViewDiagnostic}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base transition-all shadow-md active:scale-95 inline-flex items-center justify-center gap-2.5 min-h-[48px]"
        >
          <span>👉 View My Communication Profile &amp; Clarity Report</span>
          <ArrowRight className="w-4 h-4 text-emerald-400" />
        </button>
      </div>
    </div>
  );
};
