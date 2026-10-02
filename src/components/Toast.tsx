import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, dismissToast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-200 bg-white',
    error: 'border-rose-200 bg-white',
    info: 'border-blue-200 bg-white'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm animate-fade-in">
      <div
        className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg ${borders[toast.type]}`}
      >
        {icons[toast.type]}
        <div className="flex-1 text-sm font-medium text-slate-800 leading-snug">
          {toast.message}
        </div>
        <button
          onClick={dismissToast}
          className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
