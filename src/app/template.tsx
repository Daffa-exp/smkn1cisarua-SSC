'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Wraps every route segment. Kept intentionally short (180ms) and subtle
 * (opacity + 6px translateY) so it reads as "same app, new content" rather
 * than a slide-deck transition, and never delays perceived navigation.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
