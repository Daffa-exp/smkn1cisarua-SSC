'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SCHOOL_LOGO_SRC } from '@/lib/branding';

const sizeMap = {
  xs: { box: 'w-7 h-7', px: 28 },
  sm: { box: 'w-9 h-9', px: 36 },
  md: { box: 'w-14 h-14', px: 56 },
  lg: { box: 'w-24 h-24', px: 96 },
  xl: { box: 'w-36 h-36', px: 144 },
} as const;

type LogoSize = keyof typeof sizeMap;

interface SchoolLogoProps {
  size?: LogoSize;
  className?: string;
  animated?: boolean;
  priority?: boolean;
  showGlow?: boolean;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  size = 'sm',
  className,
  animated = false,
  priority = false,
  showGlow = false,
}) => {
  const reduceMotion = useReducedMotion();
  const { box, px } = sizeMap[size];
  const shouldAnimate = animated && !reduceMotion;

  const image = (
    <Image
      src={SCHOOL_LOGO_SRC}
      alt="Logo SMK Negeri 1 Cisarua, Kabupaten Bandung Barat"
      width={px}
      height={px}
      priority={priority}
      className={cn('object-contain select-none', box, className)}
    />
  );

  if (!shouldAnimate) {
    return (
      <div className={cn('relative shrink-0', showGlow && 'drop-shadow-[0_4px_20px_rgba(59,130,246,0.25)]')}>
        {image}
      </div>
    );
  }

  return (
    <motion.div
      className={cn('relative shrink-0', showGlow && 'drop-shadow-[0_4px_20px_rgba(59,130,246,0.25)]')}
      initial={{ opacity: 0, scale: 0.9, filter: 'blur(6px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {image}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.35, 0] }}
        transition={{ duration: 0.8, delay: 0.6, ease: 'easeInOut' }}
        aria-hidden
      >
        <div className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12" />
      </motion.div>
    </motion.div>
  );
};

/** Compact circular avatar for chat / assistant contexts */
export const SchoolLogoAvatar: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn(
      'w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-slate-200/80 bg-white flex items-center justify-center',
      className
    )}
  >
    <Image
      src={SCHOOL_LOGO_SRC}
      alt="SSC Assistant"
      width={32}
      height={32}
      className="w-7 h-7 object-contain"
    />
  </div>
);
