/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ActiveTab, DiagnosticResult, ScriptItem, SomaticSymptoms, ToastMessage, ToneType } from './types';
import { INITIAL_SCRIPTS } from './data/scripts';
import { calculateDiagnostic } from './utils/diagnosticCalculator';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { TabNavigation } from './components/TabNavigation';
import { EvaluadorSection } from './components/EvaluadorSection';
import { DiagnosticSection } from './components/DiagnosticSection';
import { LimitOMaticSection } from './components/LimitOMaticSection';
import { KitSection } from './components/KitSection';
import { SomaticResetModal } from './components/SomaticResetModal';
import { MobileDock } from './components/MobileDock';
import { Toast } from './components/Toast';

const STORAGE_KEY_ANSWERS = 'quick_response_answers_v2';
const STORAGE_KEY_SYMPTOMS = 'quick_response_symptoms_v2';
const STORAGE_KEY_SAVED_SCRIPTS = 'quick_response_saved_scripts_v2';
const STORAGE_KEY_CUSTOM_SCRIPTS = 'quick_response_custom_scripts_v2';

const DEFAULT_SYMPTOMS: SomaticSymptoms = {
  jawTension: true,
  shoulderTightness: true,
  rumination: true,
  overApologizing: false,
  rescuingReflex: false,
};

const DEFAULT_ANSWERS: Record<number, number> = {
  1: 1,
  2: 1,
  3: 1,
  4: 1,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('assessment');
  const [isSomaticModalOpen, setIsSomaticModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [preferredTone, setPreferredTone] = useState<ToneType>('assertive');

  // Answers State
  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ANSWERS);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_ANSWERS;
  });

  // Somatic Symptoms State
  const [symptoms, setSymptoms] = useState<SomaticSymptoms>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SYMPTOMS);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_SYMPTOMS;
  });

  // Custom User Scripts
  const [customScripts, setCustomScripts] = useState<ScriptItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CUSTOM_SCRIPTS);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  });

  // Saved Bookmarked Scripts
  const [savedScripts, setSavedScripts] = useState<ScriptItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SAVED_SCRIPTS);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [INITIAL_SCRIPTS[0], INITIAL_SCRIPTS[2]];
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(answers));
    } catch {}
  }, [answers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SYMPTOMS, JSON.stringify(symptoms));
    } catch {}
  }, [symptoms]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED_SCRIPTS, JSON.stringify(savedScripts));
    } catch {}
  }, [savedScripts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_SCRIPTS, JSON.stringify(customScripts));
    } catch {}
  }, [customScripts]);

  // Merge default + custom scripts
  const allScripts = useMemo(() => {
    return [...customScripts, ...INITIAL_SCRIPTS];
  }, [customScripts]);

  const savedScriptIds = useMemo(() => {
    return new Set(savedScripts.map((s) => s.id));
  }, [savedScripts]);

  // Compute diagnostic metrics
  const diagnosticResult: DiagnosticResult = useMemo(() => {
    return calculateDiagnostic(answers, symptoms);
  }, [answers, symptoms]);

  // Toast Helpers
  const addToast = useCallback((message: string, type: 'success' | 'info' | 'copy' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Copy with fallback
  const handleCopyScript = useCallback(
    (text: string, title: string) => {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(
          () => addToast(`Copied "${title}" to clipboard!`, 'copy'),
          () => copyFallback(text, title)
        );
      } else {
        copyFallback(text, title);
      }
    },
    [addToast]
  );

  const copyFallback = (text: string, title: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      addToast(`Copied "${title}" to clipboard!`, 'copy');
    } catch (err) {
      addToast('Could not copy automatically. Please select text manually.', 'info');
    }
  };

  // Toggle Save to Kit
  const handleToggleSaveScript = useCallback(
    (script: ScriptItem, tone: ToneType) => {
      setSavedScripts((prev) => {
        const exists = prev.some((s) => s.id === script.id);
        if (exists) {
          addToast(`Removed "${script.title}" from your Kit`, 'info');
          return prev.filter((s) => s.id !== script.id);
        } else {
          addToast(`Saved "${script.title}" (${tone} tone) to your Kit!`, 'success');
          return [script, ...prev];
        }
      });
    },
    [addToast]
  );

  // Save Custom Script
  const handleSaveCustomScript = useCallback(
    (newScript: ScriptItem) => {
      setCustomScripts((prev) => [newScript, ...prev]);
      setSavedScripts((prev) => [newScript, ...prev]);
      addToast(`Created and saved custom script "${newScript.title}"!`, 'success');
    },
    [addToast]
  );

  // Remove single script from Kit
  const handleRemoveFromKit = useCallback(
    (scriptId: string) => {
      setSavedScripts((prev) => {
        const target = prev.find((s) => s.id === scriptId);
        if (target) {
          addToast(`Removed "${target.title}" from Kit`, 'info');
        }
        return prev.filter((s) => s.id !== scriptId);
      });
    },
    [addToast]
  );

  const handleAnswerChange = (questionId: number, points: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: points,
    }));
  };

  const handleSymptomToggle = (key: keyof SomaticSymptoms) => {
    setSymptoms((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleResetAssessment = () => {
    setAnswers({});
    setSymptoms({
      jawTension: false,
      shoulderTightness: false,
      rumination: false,
      overApologizing: false,
      rescuingReflex: false,
    });
    addToast('Audit answers cleared.', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* Toast Manager */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSomaticReset={() => setIsSomaticModalOpen(true)}
        savedCount={savedScripts.length}
      />

      {/* Main Photographic Hero Banner matching 'portada y menú con 4 solapas funcionales.png' */}
      <HeroBanner
        onOpenSomaticReset={() => setIsSomaticModalOpen(true)}
        onOpenBuilder={() => {
          setActiveTab('kit');
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
        onOpenKit={() => {
          setActiveTab('kit');
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
      />

      {/* Tab Navigation Segmented Bar matching reference */}
      <TabNavigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        savedCount={savedScripts.length}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-16">
        {activeTab === 'assessment' && (
          <EvaluadorSection
            answers={answers}
            symptoms={symptoms}
            onAnswerChange={handleAnswerChange}
            onSymptomToggle={handleSymptomToggle}
            onViewDiagnostic={() => {
              setActiveTab('diagnostic');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onReset={handleResetAssessment}
          />
        )}

        {activeTab === 'diagnostic' && (
          <DiagnosticSection
            diagnostic={diagnosticResult}
            onGoToScripts={(recommendedTone) => {
              if (recommendedTone) setPreferredTone(recommendedTone);
              setActiveTab('scripts');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onRetakeAssessment={() => {
              setActiveTab('assessment');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'scripts' && (
          <LimitOMaticSection
            scripts={allScripts}
            savedScriptIds={savedScriptIds}
            initialTone={preferredTone}
            onCopy={handleCopyScript}
            onToggleSave={handleToggleSaveScript}
            onGoToBuilder={() => {
              setActiveTab('kit');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'kit' && (
          <KitSection
            savedScripts={savedScripts}
            onRemoveFromKit={handleRemoveFromKit}
            onCopy={handleCopyScript}
            onSaveCustomScript={handleSaveCustomScript}
            onGoToBank={() => {
              setActiveTab('scripts');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* 2-Minute Calming Reset Modal matching reference */}
      <SomaticResetModal
        isOpen={isSomaticModalOpen}
        onClose={() => setIsSomaticModalOpen(false)}
        onCompleteToScripts={() => {
          setIsSomaticModalOpen(false);
          setActiveTab('scripts');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Floating Mobile Thumb-Dock */}
      <MobileDock
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSomaticReset={() => setIsSomaticModalOpen(true)}
        savedCount={savedScripts.length}
      />

      {/* Footer matching 'complemento del baner 2 con footer.png' */}
      <div className="max-w-6xl mx-auto px-4 w-full mb-8">
        <footer className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden text-center text-xs text-slate-500 py-6 px-4">
          <div className="w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500 -mt-6 mb-5" />
          <p className="font-semibold text-slate-700">
            © 2026 Quick Response™ — Practical Conversational Clarity &amp; Boundary Scripts.
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            The right words, right when you need them. Calm before speaking, clarity during the conversation, peace of mind after.
          </p>
        </footer>
      </div>
    </div>
  );
}
