import React, { useState } from 'react';
import { Sparkles, X, Plus } from 'lucide-react';
import { CategoryType, ScriptItem } from '../types';

interface CustomScriptBuilderProps {
  onSaveToKit: (script: ScriptItem) => void;
  onCopy?: (text: string, title: string) => void;
  onClose?: () => void;
}

export const CustomScriptBuilder: React.FC<CustomScriptBuilderProps> = ({
  onSaveToKit,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('work');
  const [focus, setFocus] = useState('');
  const [text, setText] = useState('');

  const handleSave = () => {
    if (!text.trim()) return;

    const newScript: ScriptItem = {
      id: `custom-${Date.now()}`,
      title: title.trim() || 'Custom Boundary Script',
      category,
      scenarioTag: focus.trim() || 'Custom Scenario',
      context: 'Personal custom response crafted for your specific situation.',
      somaticCue: 'Take an easy breath and drop your shoulders. Clear honesty preserves relationships.',
      tones: {
        soft: {
          label: '🌸 Soft',
          badge: 'Personal',
          toneDescription: 'Custom response',
          text: text.trim(),
        },
        assertive: {
          label: '⚖️ Balanced',
          badge: 'Personal',
          toneDescription: 'Custom response',
          text: text.trim(),
        },
        firm: {
          label: '🛑 Firm',
          badge: 'Personal',
          toneDescription: 'Custom response',
          text: text.trim(),
        },
        steel: {
          label: '🛡️ Unshakable',
          badge: 'Personal',
          toneDescription: 'Custom response',
          text: text.trim(),
        },
      },
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    onSaveToKit(newScript);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-md space-y-6 max-w-xl mx-auto">
      {/* Modal/Card Header matching 'solapa Crear guión personalizado.png' */}
      <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-500 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              Create Custom Script
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Draft your clear response and save it to your favorites.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Inputs matching screenshot */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Script Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Limit with manager regarding Friday evening requests"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Scenario / Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryType)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="work">💼 Work / Demands</option>
              <option value="family">🏡 Family / Relatives</option>
              <option value="couples">❤️ Partner / Relationship</option>
              <option value="friends">👥 Friends / Social</option>
              <option value="digital">📱 Digital / Texts</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Main Focus (Optional)
            </label>
            <input
              type="text"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              placeholder="e.g. Weekend protection"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Script Text
          </label>
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write the exact phrase you will use to communicate with clarity and peace..."
            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="pt-2 flex items-center justify-end gap-3">
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Cancel
          </button>
        )}

        <button
          onClick={handleSave}
          disabled={!text.trim()}
          className={`px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm ${
            !text.trim()
              ? 'opacity-40 cursor-not-allowed bg-slate-200 text-slate-500'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Save Script</span>
        </button>
      </div>
    </div>
  );
};
