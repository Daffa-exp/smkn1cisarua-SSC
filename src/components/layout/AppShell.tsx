'use client';

import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { EmergencyAlertBanner } from '@/components/emergency/EmergencyAlertBanner';
import { SplashScreen, useSplashScreen } from '@/components/ui/SplashScreen';
import { FloatingAIButton } from '@/components/ai/FloatingAIButton';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { checking, showSplash, ready, completeSplash } = useSplashScreen();

  if (checking) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-[#070b14]" aria-hidden>
        <div className="h-8 w-8 animate-pulse rounded-full bg-brand-500/10" />
      </div>
    );
  }

  if (!ready) return showSplash ? <SplashScreen onComplete={completeSplash} /> : null;

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b14]">
      {/* Ambient app background — subtle brand glow + fine grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-12%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-500/[0.06] blur-3xl dark:bg-brand-500/[0.08]" />
        <div className="absolute inset-0 opacity-[0.5] [background-image:radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.05)_1px,transparent_0)] [background-size:30px_30px] dark:opacity-[0.35] dark:[background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)]" />
      </div>

      <div className="relative flex min-h-screen flex-col">
        <EmergencyAlertBanner />
        <Header />
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 pb-20 md:pb-8 max-w-full overflow-x-hidden">
            {children}
          </main>
        </div>
        <BottomNav />
        <FloatingAIButton />
      </div>
    </div>
  );
};
