'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { AIChatPanel } from '@/components/ai/AIChatPanel';
import { useAuth } from '@/components/providers/AuthProvider';

export const FloatingAIButton: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { user } = useAuth();

  const openPanel = useCallback(() => setIsPanelOpen(true), []);
  const closePanel = useCallback(() => setIsPanelOpen(false), []);

  if (!user) return null;

  return (
    <>
      <motion.button
        type="button"
        onClick={openPanel}
        aria-label="Buka SSC Assistant"
        title="SSC Assistant"
        className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-4 z-50 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-brand-600 text-white shadow-[0_12px_28px_rgba(3,105,161,0.28)] transition-[transform,box-shadow] hover:shadow-[0_16px_34px_rgba(3,105,161,0.34)] active:scale-95 md:bottom-6 md:right-6"
        initial={{ opacity: 0, scale: 0.82, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.35 }}
        whileHover={{ y: -2 }}
      >
        <Sparkles className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 dark:border-surface-raised" />
      </motion.button>

      <AIChatPanel isOpen={isPanelOpen} onClose={closePanel} />
    </>
  );
};
