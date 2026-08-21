'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { Check, Loader2 } from 'lucide-react';
import { APP_NAME, SCHOOL_LOGO_SRC } from '@/lib/branding';

const SPLASH_KEY = 'ssc-splash-seen';
const TOTAL_DURATION_MS = 3200;
const ease = [0.22, 1, 0.36, 1] as const;

interface SplashScreenProps {
  onComplete: () => void;
}

const loadingSteps = [
  { at: 0, progress: 8, label: 'Menyiapkan platform...' },
  { at: 650, progress: 34, label: 'Memuat identitas sekolah...' },
  { at: 1250, progress: 62, label: 'Menyiapkan layanan...' },
  { at: 1950, progress: 84, label: 'Hampir selesai...' },
  { at: 2550, progress: 100, label: 'Siap digunakan' },
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(loadingSteps[0].label);
  const [exiting, setExiting] = useState(false);

  const finish = useCallback(() => {
    setExiting(true);
    window.setTimeout(onComplete, 420);
  }, [onComplete]);

  useEffect(() => {
    if (reduceMotion) {
      const t = window.setTimeout(onComplete, 280);
      return () => window.clearTimeout(t);
    }

    const timers = loadingSteps.map((step, index) =>
      window.setTimeout(() => {
        setPhase(index + 1);
        setProgress(step.progress);
        setStatus(step.label);
      }, step.at)
    );

    const finishTimer = window.setTimeout(finish, TOTAL_DURATION_MS);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(finishTimer);
    };
  }, [finish, onComplete, reduceMotion]);

  const brandWords = useMemo(() => APP_NAME.split(' '), []);

  if (reduceMotion) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-[#070b14]">
        <Image
          src={SCHOOL_LOGO_SRC}
          alt="Logo SMKN 1 Cisarua"
          width={96}
          height={96}
          priority
          className="h-24 w-24 object-contain"
        />
      </div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-white text-slate-900 dark:bg-[#070b14] dark:text-slate-100"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.42, ease }}
      aria-label="Memuat SMKN 1 Cisarua Connect"
      role="status"
    >
      {/* Quiet ambient layer — deliberately restrained. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <motion.div
          className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.09),transparent_68%)] dark:bg-[radial-gradient(circle,rgba(59,130,246,0.12),transparent_68%)]"
          initial={{ scale: 0.82, opacity: 0 }}
          animate={{ scale: phase >= 1 ? 1 : 0.82, opacity: phase >= 1 ? 1 : 0 }}
          transition={{ duration: 1.1, ease }}
        />
        <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.025] [background-image:linear-gradient(rgba(15,23,42,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.45)_1px,transparent_1px)] [background-size:48px_48px] dark:[background-image:linear-gradient(rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)]" />
      </div>

      <motion.div
        className="relative z-10 flex w-full max-w-sm flex-col items-center px-6 sm:max-w-md"
        animate={exiting ? { y: -12, scale: 0.985, opacity: 0 } : { y: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.42, ease }}
      >
        {/* Logo */}
        <div className="relative flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40">
          <motion.div
            className="absolute inset-2 rounded-full border border-blue-200/70 dark:border-blue-400/20"
            initial={{ scale: 0.82, opacity: 0 }}
            animate={phase >= 1 ? { scale: 1, opacity: 1 } : { scale: 0.82, opacity: 0 }}
            transition={{ duration: 0.7, ease }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border border-blue-100/70 dark:border-blue-400/10"
            initial={{ scale: 0.72, opacity: 0 }}
            animate={phase >= 2 ? { scale: [0.86, 1.08, 1.08], opacity: [0.45, 0, 0] } : { scale: 0.72, opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
          <motion.div
            className="relative drop-shadow-[0_12px_34px_rgba(37,99,235,0.16)] dark:drop-shadow-[0_14px_36px_rgba(37,99,235,0.22)]"
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(5px)' }}
            animate={phase >= 1 ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 0.9, filter: 'blur(5px)' }}
            transition={{ type: 'spring', stiffness: 130, damping: 18 }}
          >
            <Image
              src={SCHOOL_LOGO_SRC}
              alt="Logo resmi SMKN 1 Cisarua"
              width={144}
              height={144}
              priority
              className="h-24 w-24 select-none object-contain sm:h-32 sm:w-32"
            />
          </motion.div>
        </div>

        {/* Brand lockup */}
        <div className="mt-5 text-center">
          <div className="flex justify-center gap-x-1 text-lg font-bold tracking-tight sm:text-xl">
            {brandWords.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                initial={{ opacity: 0, y: 8 }}
                animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                transition={{ duration: 0.38, delay: index * 0.045, ease }}
              >
                {word}
              </motion.span>
            ))}
          </div>
          <motion.p
            className="mt-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400 sm:text-[11px]"
            initial={{ opacity: 0, y: 6 }}
            animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: 0.4, delay: 0.18, ease }}
          >
            Digital School Platform
          </motion.p>
        </div>
      </motion.div>

      {/* Unified loading system. Text, percentage and rail intentionally share one visual block. */}
      <motion.div
        className="absolute bottom-[max(2.25rem,env(safe-area-inset-bottom))] left-1/2 z-10 w-[min(86vw,20rem)] -translate-x-1/2"
        initial={{ opacity: 0, y: 8 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.4, ease }}
      >
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-3.5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-md dark:border-white/10 dark:bg-slate-900/55 dark:shadow-[0_16px_44px_rgba(0,0,0,0.18)]">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={status}
                  className="flex min-w-0 items-center gap-2 text-[10px] font-medium text-slate-500 dark:text-slate-400"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.18 }}
                >
                  {progress >= 100 ? (
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  ) : (
                    <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-blue-500" />
                  )}
                  <span className="truncate">{status}</span>
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="shrink-0 text-[10px] font-semibold tabular-nums text-slate-400 dark:text-slate-500">
              {progress}%
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 shadow-[0_0_12px_rgba(37,99,235,0.28)]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.55, ease }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

type SplashState = 'checking' | 'splash' | 'done';

export function useSplashScreen() {
  const [state, setState] = useState<SplashState>('checking');

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem(SPLASH_KEY);
      setState(seen ? 'done' : 'splash');
    } catch {
      setState('done');
    }
  }, []);

  const completeSplash = useCallback(() => {
    try {
      sessionStorage.setItem(SPLASH_KEY, '1');
    } catch {
      /* ignore */
    }
    setState('done');
  }, []);

  return {
    checking: state === 'checking',
    showSplash: state === 'splash',
    ready: state === 'done',
    completeSplash,
  };
}
