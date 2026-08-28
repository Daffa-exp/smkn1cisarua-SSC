'use client';

import { useCallback, useEffect, useState } from 'react';

const DISMISS_KEY = 'ssc_push_prompt_dismissed_at';
const DISMISS_COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000; // don't re-ask for 3 days after "Nanti"

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export type PushSupportState = 'unsupported' | 'checking' | 'default' | 'granted' | 'denied';

/**
 * Client-side helper around Notification permission + PushManager.
 * Never requests permission automatically — the caller decides when to show
 * a prompt UI and only calls `subscribe()` on explicit user action.
 */
export function usePushNotifications() {
  const [state, setState] = useState<PushSupportState>('checking');
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    const supported =
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window;

    if (!supported) {
      setState('unsupported');
      return;
    }

    setState(Notification.permission as PushSupportState);
  }, []);

  const shouldShowPrompt = useCallback(() => {
    if (state !== 'default') return false;
    if (typeof window === 'undefined') return false;

    const dismissedAt = window.localStorage.getItem(DISMISS_KEY);
    if (!dismissedAt) return true;

    const elapsed = Date.now() - Number(dismissedAt);
    return elapsed > DISMISS_COOLDOWN_MS;
  }, [state]);

  const dismissPrompt = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    }
  }, []);

  const subscribe = useCallback(async (): Promise<{ success: boolean; message?: string }> => {
    if (state === 'unsupported') {
      return { success: false, message: 'Perangkat/browser ini tidak mendukung notifikasi push.' };
    }

    setIsSubscribing(true);
    try {
      const permission = await Notification.requestPermission();
      setState(permission as PushSupportState);

      if (permission !== 'granted') {
        return { success: false, message: 'Izin notifikasi tidak diberikan.' };
      }

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        console.error('[push] NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set.');
        return { success: false, message: 'Konfigurasi notifikasi belum tersedia.' };
      }

      const registration = await navigator.serviceWorker.ready;

      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });
      }

      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || 'Gagal mendaftarkan notifikasi.' };
      }

      return { success: true };
    } catch (err) {
      console.error('[push] subscribe error:', err);
      return { success: false, message: 'Terjadi kesalahan saat mengaktifkan notifikasi.' };
    } finally {
      setIsSubscribing(false);
    }
  }, [state]);

  const unsubscribe = useCallback(async (): Promise<{ success: boolean }> => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (!subscription) return { success: true };

      const endpoint = subscription.endpoint;
      await subscription.unsubscribe();

      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint }),
      });

      return { success: true };
    } catch (err) {
      console.error('[push] unsubscribe error:', err);
      return { success: false };
    }
  }, []);

  // If permission was already granted previously (e.g. re-installed PWA, new
  // device already trusted), silently (re)register the subscription without
  // showing any prompt — this keeps the endpoint fresh with no extra UI.
  const silentlyResubscribeIfGranted = useCallback(async () => {
    if (state !== 'granted') return;
    try {
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) return;

      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });
      }

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      }).catch(() => {});
    } catch (err) {
      // Non-fatal: this is a best-effort background sync.
      console.error('[push] silent resubscribe error:', err);
    }
  }, [state]);

  return {
    state,
    isSubscribing,
    shouldShowPrompt,
    dismissPrompt,
    subscribe,
    unsubscribe,
    silentlyResubscribeIfGranted,
  };
}
