import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-200 transform translate-y-0 ${
              toast.type === 'success'
                ? 'bg-slate-900/95 border-emerald-500/30 text-emerald-400'
                : toast.type === 'error'
                ? 'bg-slate-900/95 border-rose-500/30 text-rose-400'
                : 'bg-slate-900/95 border-blue-500/30 text-blue-400'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs font-medium">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />}
              {toast.type === 'info' && <Info className="w-4 h-4 shrink-0 text-blue-400" />}
              <span className="text-slate-200">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
