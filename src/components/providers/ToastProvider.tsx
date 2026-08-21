'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (t: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DURATION_MS = 4000;

const variantConfig: Record<ToastVariant, { icon: React.ElementType; className: string; iconClassName: string }> = {
  success: {
    icon: CheckCircle2,
    className: 'bg-white dark:bg-surface-raised border-emerald-200 dark:border-emerald-900',
    iconClassName: 'text-emerald-600 dark:text-emerald-400',
  },
  error: {
    icon: XCircle,
    className: 'bg-white dark:bg-surface-raised border-rose-200 dark:border-rose-900',
    iconClassName: 'text-rose-600 dark:text-rose-400',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-white dark:bg-surface-raised border-amber-200 dark:border-amber-900',
    iconClassName: 'text-amber-600 dark:text-amber-400',
  },
  info: {
    icon: Info,
    className: 'bg-white dark:bg-surface-raised border-sky-200 dark:border-sky-900',
    iconClassName: 'text-sky-600 dark:text-sky-400',
  },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => dismiss(id), DURATION_MS);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="fixed z-[70] top-4 right-4 left-4 sm:left-auto flex flex-col gap-2 items-end pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const cfg = variantConfig[t.variant];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: -12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, transition: { duration: 0.15 } }}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                className={cn(
                  'pointer-events-auto w-full sm:w-80 max-w-full border rounded-xl shadow-raised px-3.5 py-3 flex items-start gap-2.5',
                  cfg.className
                )}
                role="status"
              >
                <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', cfg.iconClassName)} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">{t.title}</p>
                  {t.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{t.description}</p>
                  )}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  aria-label="Tutup notifikasi"
                  className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx.toast;
}
