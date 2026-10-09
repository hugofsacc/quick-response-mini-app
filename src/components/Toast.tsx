import React from 'react';
import { Check, Copy, Info } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/95 border border-teal-500/30 text-slate-100 shadow-xl shadow-black/40 backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
              {toast.type === 'copy' ? (
                <Copy className="w-4 h-4" />
              ) : toast.type === 'info' ? (
                <Info className="w-4 h-4" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-200">{toast.message}</p>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-slate-200 text-xs px-1.5 py-1 rounded transition-colors"
            aria-label="Dismiss toast"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
