import React, { useState, useEffect } from 'react';
import { X, Heart, RotateCcw, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface SomaticResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteToScripts: () => void;
}

export const SomaticResetModal: React.FC<SomaticResetModalProps> = ({
  isOpen,
  onClose,
  onCompleteToScripts,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [stepNumber, setStepNumber] = useState<'1/2' | '2/2'>('1/2');
  const [completedCycles, setCompletedCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Breathing timer loop
  useEffect(() => {
    if (!isOpen || !isActive) return;

    let timer: NodeJS.Timeout;

    if (phase === 'inhale') {
      timer = setTimeout(() => {
        setPhase('exhale');
        setStepNumber('2/2');
      }, 4000);
    } else {
      timer = setTimeout(() => {
        setPhase('inhale');
        setStepNumber('1/2');
        setCompletedCycles((c) => c + 1);
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [isOpen, isActive, phase]);

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setStepNumber('1/2');
    setCompletedCycles(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-3xl bg-[#0B132B] border border-slate-800 text-white shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header matching 'solapa reset somático.png' */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Heart className="w-5 h-5 fill-emerald-400/20 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                2-Minute Reset: Clear Your Head
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Activation of Calm Breathing &amp; Presence
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Glowing Circular Breath Indicator */}
        <div className="py-4 flex flex-col items-center justify-center text-center">
          <div className="relative w-52 h-52 rounded-full flex items-center justify-center">
            {/* Outer animated ring */}
            <div
              className={`absolute inset-0 rounded-full border-2 transition-all duration-1000 ${
                isActive
                  ? phase === 'inhale'
                    ? 'scale-105 border-emerald-400 shadow-xl shadow-emerald-500/20'
                    : 'scale-95 border-teal-500/60 shadow-lg shadow-teal-500/10'
                  : 'border-slate-800'
              }`}
            />

            {/* Inner circle */}
            <div
              className={`w-44 h-44 rounded-full flex flex-col items-center justify-center transition-all duration-1000 ${
                isActive
                  ? phase === 'inhale'
                    ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-950/80 scale-105 text-white'
                    : 'bg-gradient-to-br from-slate-900 to-slate-950 scale-95 text-slate-300'
                  : 'bg-slate-900/90 text-slate-400'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-1">
                {isActive
                  ? phase === 'inhale'
                    ? 'Inhale Deeply'
                    : 'Exhale Slowly'
                  : 'Ready to Begin'}
              </span>

              <span className="text-3xl font-extrabold font-mono tracking-tight text-white">
                {stepNumber}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 max-w-xs mx-auto mt-5 leading-relaxed">
            Slow, deliberate breathing is the fastest way to relax physical tension and restore clarity before responding.
          </p>
        </div>

        {/* Bottom Control Bar matching screenshot */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800/80">
          <div className="text-xs text-slate-400 font-mono">
            Cycles completed: <strong className="text-white font-bold">{completedCycles}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Reset cycles"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Toggle sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsActive(!isActive)}
              className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isActive ? 'Pause' : 'Start Reset'}</span>
            </button>
          </div>
        </div>

        {completedCycles >= 2 && (
          <div className="text-center pt-1">
            <button
              onClick={() => {
                onClose();
                onCompleteToScripts();
              }}
              className="text-emerald-400 hover:text-emerald-300 text-xs font-bold underline"
            >
              I am grounded — take me to the scripts →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
