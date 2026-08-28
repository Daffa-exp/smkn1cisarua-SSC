'use client';

import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { usePushNotifications } from '@/lib/usePushNotifications';

/**
 * Natural, dismissible "Aktifkan Notifikasi" banner.
 * - Never shown on first page load before the user is logged in.
 * - Never shown if permission is already granted or denied.
 * - "Nanti" hides it for a few days instead of nagging every visit.
 */
export const PushNotificationPrompt: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { state, isSubscribing, shouldShowPrompt, dismissPrompt, subscribe, silentlyResubscribeIfGranted } =
    usePushNotifications();
  const [visible, setVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading || !user) return;
    if (state === 'granted') {
      silentlyResubscribeIfGranted();
      return;
    }
    // Small delay so the prompt doesn't fight for attention with the page
    // that just loaded — feels like a deliberate offer, not a first-load ambush.
    const timer = setTimeout(() => {
      if (shouldShowPrompt()) setVisible(true);
    }, 2500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, user, state]);

  if (!visible) return null;

  const handleActivate = async () => {
    setErrorMsg(null);
    const result = await subscribe();
    if (result.success) {
      setVisible(false);
    } else {
      setErrorMsg(result.message || 'Gagal mengaktifkan notifikasi.');
    }
  };

  const handleLater = () => {
    dismissPrompt();
    setVisible(false);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white dark:bg-[#0f1729] border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-lg p-4 flex gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 flex items-center justify-center shrink-0">
          <Bell className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Aktifkan Notifikasi
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Dapatkan pemberitahuan penting dari SSC langsung di perangkatmu.
          </p>
          {errorMsg && <p className="text-[11px] text-rose-600 mt-1">{errorMsg}</p>}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleActivate}
              disabled={isSubscribing}
              className="text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white px-3.5 py-1.5 rounded-xl transition-colors disabled:opacity-60"
            >
              {isSubscribing ? 'Mengaktifkan...' : 'Aktifkan'}
            </button>
            <button
              onClick={handleLater}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-3.5 py-1.5 rounded-xl transition-colors"
            >
              Nanti
            </button>
          </div>
        </div>
        <button
          onClick={handleLater}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 h-fit"
          title="Tutup"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
